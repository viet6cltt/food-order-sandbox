// src/features/owner/components/OrderList.tsx
import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getRestaurantOrders, confirmOrder, prepareOrder, deliverOrder, cancelOrderByRestaurant, completeOrder } from '../api';
import type { Order, OrderStatus } from '../../../types/order';
import OrderTable from './OrderTable';

function getErrorMessage(err: unknown, fallback: string) {
    if (err && typeof err === 'object') {
        const maybe = err as {
            message?: unknown;
            response?: { data?: { message?: unknown } };
        };
        const fromResponse = maybe.response?.data?.message;
        if (typeof fromResponse === 'string' && fromResponse.trim()) return fromResponse;
        if (typeof maybe.message === 'string' && maybe.message.trim()) return maybe.message;
    }
    return fallback;
}

export type OrderListHandle = {
    reload: () => Promise<void>;
};

type OrderListProps = {
    restaurantId: string | null;
    onOrderCompleted?: () => void;
};

const OrderList = forwardRef<OrderListHandle, OrderListProps>(({ onOrderCompleted, restaurantId }, ref) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!restaurantId) return;

        const fetchOrders = async () => {
            try {
                setLoading(true);
                // Filter orders that need processing: pending, confirmed, preparing, delivering
                const result = await getRestaurantOrders(restaurantId, {
                    page: 1,
                    limit: 50,
                    // Don't filter by status, get all orders and filter in frontend if needed
                });
                setOrders(result.orders || []);
                setError(null);
            } catch (err: unknown) {
                setError(getErrorMessage(err, 'Không thể tải danh sách đơn hàng.'));
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [restaurantId]);

    const refreshOrders = useCallback(async () => {
        if (!restaurantId) return;
        try {
            setLoading(true);
            const result = await getRestaurantOrders(restaurantId, {
                page: 1,
                limit: 50,
            });
            setOrders(result.orders || []);
            setError(null);
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Không thể tải danh sách đơn hàng.'));
            throw err;
        } finally {
            setLoading(false);
        }
    }, [restaurantId]);

    useImperativeHandle(ref, () => ({
        reload: async () => {
            if (!restaurantId) {
                toast.error('Không tìm thấy thông tin nhà hàng.');
                return;
            }
            try {
                await refreshOrders();
                // toast.success('Đã tải lại đơn hàng hôm nay');
            } catch (err: unknown) {
                toast.error(getErrorMessage(err, 'Không thể tải lại danh sách đơn hàng.'));
            }
        },
    }), [restaurantId, refreshOrders]);


    const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
        if (!restaurantId) {
            toast.error('Không tìm thấy thông tin nhà hàng.');
            return;
        }

        try {
            // Call appropriate API based on status
            switch (newStatus) {
                case 'confirmed':
                    await confirmOrder(restaurantId, orderId);
                    break;
                case 'preparing':
                    await prepareOrder(restaurantId, orderId);
                    break;
                case 'delivering':
                    await deliverOrder(restaurantId, orderId);
                    break;
                case 'completed':
                    await completeOrder(restaurantId, orderId);
                    break;
                case 'cancelled':
                    await cancelOrderByRestaurant(restaurantId, orderId);
                    break;
                default:
                    toast.error('Không thể cập nhật trạng thái này.');
                    return;
            }

            toast.success('Cập nhật trạng thái đơn hàng thành công!');
            
            // Refresh orders list
            await refreshOrders();

            if (newStatus === 'completed') {
                onOrderCompleted?.();
            }
        } catch (err: unknown) {
            toast.error(getErrorMessage(err, 'Không thể cập nhật trạng thái đơn hàng.'));
            console.error('Error updating order status:', err);
        }
    };

    // Filter orders that need processing (pending, confirmed, preparing, delivering)
    const ordersToProcess = orders.filter(order => {
        const originalStatus = order.status as string;
        return ['pending', 'confirmed', 'preparing', 'delivering'].includes(originalStatus);
    });

    // Map orders to include normalized status
    const normalizedOrders: Order[] = ordersToProcess.map(order => ({
        ...order,
        status: order.status as OrderStatus,
    }));

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <p className="text-gray-500">Đang tải...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-8">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (normalizedOrders.length === 0) {
        return (
            <div className="flex items-center justify-center py-8">
                <p className="text-gray-500">Không có đơn hàng cần xử lý.</p>
            </div>
        );
    }

    return (
        <OrderTable 
            orders={normalizedOrders} 
            onUpdateStatus={handleUpdateStatus}
            onRefresh={refreshOrders}
        />
    );
});

export default OrderList;