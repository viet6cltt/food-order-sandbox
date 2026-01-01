// src/features/owner/components/OrderList.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getMyRestaurant, getRestaurantOrders, confirmOrder, prepareOrder, deliverOrder, cancelOrderByRestaurant, completeOrder } from '../api';
import type { Order, OrderStatus } from '../../../types/order';
import OrderTable from './OrderTable';

const OrderList: React.FC = () => {
    const [restaurantId, setRestaurantId] = useState<string | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch restaurant when component mounts
    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                setLoading(true);
                const restaurant = await getMyRestaurant();
                if (restaurant) {
                    setRestaurantId(restaurant._id || restaurant.id || null);
                } else {
                    setError('Bạn chưa có nhà hàng. Vui lòng đăng ký nhà hàng trước.');
                }
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || err.message || 'Không thể tải thông tin nhà hàng.';
                setError(errorMessage);
                console.error('Error fetching restaurant:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurant();
    }, []);

    // Fetch orders when restaurantId is available
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
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || err.message || 'Không thể tải danh sách đơn hàng.';
                setError(errorMessage);
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [restaurantId]);

    const refreshOrders = async () => {
        if (!restaurantId) return;
        const result = await getRestaurantOrders(restaurantId, {
            page: 1,
            limit: 50,
        });
        setOrders(result.orders || []);
    };


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
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Không thể cập nhật trạng thái đơn hàng.';
            toast.error(errorMessage);
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
};

export default OrderList;