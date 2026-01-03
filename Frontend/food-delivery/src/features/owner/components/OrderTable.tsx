import React, { useEffect, useState, useMemo, useRef } from 'react';
import type { Order, OrderStatus } from '../../../types/order';
import AcceptRejectButtons from './AcceptRejectButtons';
import StatusUpdateControls from './StatusUpdateControls';
import { getUser, type UserResponse } from '../../../features/profile/api';
import { toast } from 'react-toastify';
import { confirmPayment, getPaymentById, getPaymentByOrder, type Payment } from '../../payment/api';

interface Props {
    orders: Order[];
    onUpdateStatus: (id: string, status: OrderStatus) => void;
    onRefresh?: () => Promise<void> | void;
}

const OrderTable: React.FC<Props> = ({ orders, onUpdateStatus, onRefresh }) => {
    const [userMap, setUserMap] = useState<Map<string, UserResponse>>(new Map());
    const [loadingUserIds, setLoadingUserIds] = useState<Set<string>>(new Set());
    const fetchedUserIdsRef = useRef<Set<string>>(new Set());

    const [paymentMap, setPaymentMap] = useState<Map<string, Payment>>(new Map());
    const [loadingPaymentIds, setLoadingPaymentIds] = useState<Set<string>>(new Set());
    const fetchedPaymentIdsRef = useRef<Set<string>>(new Set());

    const [paymentByOrderIdMap, setPaymentByOrderIdMap] = useState<Map<string, Payment>>(new Map());
    const [loadingPaymentOrderIds, setLoadingPaymentOrderIds] = useState<Set<string>>(new Set());
    const fetchedPaymentOrderIdsRef = useRef<Set<string>>(new Set());

    // Get unique userIds from orders - use useMemo to prevent unnecessary recalculations
    const uniqueUserIds = useMemo(() => {
        const userIds = orders
            .map(order => order.userId)
            .filter((id): id is string => typeof id === 'string' && id.trim() !== '');
        return Array.from(new Set(userIds));
    }, [orders]);

    const uniquePaymentIds = useMemo(() => {
        const paymentIds = orders
            .map(order => order.paymentId)
            .filter((id): id is string => typeof id === 'string' && id.trim() !== '');
        return Array.from(new Set(paymentIds));
    }, [orders]);

    const uniqueBankTransferOrderIds = useMemo(() => {
        const orderIds = orders
            .filter(o => o.paymentMethod === 'BANK_TRANSFER')
            .map(o => o._id)
            .filter((id): id is string => typeof id === 'string' && id.trim() !== '');
        return Array.from(new Set(orderIds));
    }, [orders]);

    // Fetch user data for all unique userIds - only when new userIds appear
    useEffect(() => {
        if (uniqueUserIds.length === 0) return;

        const fetchUsers = async () => {
            // Filter out userIds that are already loaded or being loaded
            const userIdsToFetch = uniqueUserIds.filter(
                id => !fetchedUserIdsRef.current.has(id) && !loadingUserIds.has(id)
            );

            if (userIdsToFetch.length === 0) return;

            // Mark as loading
            setLoadingUserIds(prev => new Set([...prev, ...userIdsToFetch]));

            try {
                // Fetch all users in parallel
                const userPromises = userIdsToFetch.map(async (userId) => {
                    try {
                        const user = await getUser(userId);
                        return { userId, user };
                    } catch (error) {
                        console.error(`Error fetching user ${userId}:`, error);
                        return { userId, user: null };
                    }
                });

                const results = await Promise.all(userPromises);

                // Update userMap with fetched users
                setUserMap(prev => {
                    const newMap = new Map(prev);
                    results.forEach(({ userId, user }) => {
                        if (user) {
                            newMap.set(userId, user);
                            fetchedUserIdsRef.current.add(userId);
                        }
                    });
                    return newMap;
                });
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                // Remove from loading set
                setLoadingUserIds(prev => {
                    const newSet = new Set(prev);
                    userIdsToFetch.forEach(id => newSet.delete(id));
                    return newSet;
                });
            }
        };

        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uniqueUserIds.join(',')]); // Only re-fetch when uniqueUserIds actually change (by comparing string)

    // Fetch payment data for all unique paymentIds - only when new paymentIds appear
    useEffect(() => {
        if (uniquePaymentIds.length === 0) return;

        const fetchPayments = async () => {
            const paymentIdsToFetch = uniquePaymentIds.filter(
                id => !fetchedPaymentIdsRef.current.has(id) && !loadingPaymentIds.has(id)
            );

            if (paymentIdsToFetch.length === 0) return;

            setLoadingPaymentIds(prev => new Set([...prev, ...paymentIdsToFetch]));

            try {
                const paymentPromises = paymentIdsToFetch.map(async (paymentId) => {
                    try {
                        const payment = await getPaymentById(paymentId);
                        return { paymentId, payment };
                    } catch (error) {
                        console.error(`Error fetching payment ${paymentId}:`, error);
                        return { paymentId, payment: null };
                    }
                });

                const results = await Promise.all(paymentPromises);

                setPaymentMap(prev => {
                    const newMap = new Map(prev);
                    results.forEach(({ paymentId, payment }) => {
                        if (payment) {
                            newMap.set(paymentId, payment);
                            fetchedPaymentIdsRef.current.add(paymentId);
                        }
                    });
                    return newMap;
                });
            } finally {
                setLoadingPaymentIds(prev => {
                    const newSet = new Set(prev);
                    paymentIdsToFetch.forEach(id => newSet.delete(id));
                    return newSet;
                });
            }
        };

        fetchPayments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uniquePaymentIds.join(',')]);

    // Fetch payment by orderId for BANK_TRANSFER orders (covers cases where order.paymentId is not set yet)
    useEffect(() => {
        if (uniqueBankTransferOrderIds.length === 0) return;

        const fetchPaymentsByOrder = async () => {
            const orderIdsToFetch = uniqueBankTransferOrderIds.filter(
                id => !fetchedPaymentOrderIdsRef.current.has(id) && !loadingPaymentOrderIds.has(id)
            );
            if (orderIdsToFetch.length === 0) return;

            setLoadingPaymentOrderIds(prev => new Set([...prev, ...orderIdsToFetch]));

            try {
                const paymentPromises = orderIdsToFetch.map(async (orderId) => {
                    try {
                        const payment = await getPaymentByOrder(orderId);
                        return { orderId, payment };
                    } catch (error) {
                        console.error(`Error fetching payment by order ${orderId}:`, error);
                        return { orderId, payment: null };
                    }
                });

                const results = await Promise.all(paymentPromises);

                setPaymentByOrderIdMap(prev => {
                    const next = new Map(prev);
                    results.forEach(({ orderId, payment }) => {
                        if (payment) {
                            next.set(orderId, payment);
                            fetchedPaymentOrderIdsRef.current.add(orderId);
                        }
                    });
                    return next;
                });
            } finally {
                setLoadingPaymentOrderIds(prev => {
                    const next = new Set(prev);
                    orderIdsToFetch.forEach(id => next.delete(id));
                    return next;
                });
            }
        };

        fetchPaymentsByOrder();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uniqueBankTransferOrderIds.join(',')]);

    const getCustomerName = (userId: string): string => {
        if (!userId || typeof userId !== 'string') {
            return 'Khách vãng lai';
        }
        const user = userMap.get(userId);
        if (!user) {
            return loadingUserIds.has(userId) ? 'Đang tải...' : 'Khách vãng lai';
        }
        const name = `${user.firstname || ''} ${user.lastname || ''}`.trim();
        return name || 'Khách vãng lai';
    };

    const getPaymentLabel = (order: Order): string => {
        const method = order.paymentMethod || 'COD';
        if (method !== 'BANK_TRANSFER') return 'COD';

        const paymentId = order.paymentId;
        const payment =
            (typeof paymentId === 'string' && paymentId ? paymentMap.get(paymentId) : undefined) ||
            paymentByOrderIdMap.get(order._id);

        if (!payment) {
            const isLoading = (typeof paymentId === 'string' && paymentId && loadingPaymentIds.has(paymentId)) ||
                loadingPaymentOrderIds.has(order._id);
            return isLoading ? 'BANK_TRANSFER (đang tải...)' : 'BANK_TRANSFER (chờ xác nhận)';
        }

        const statusText = payment.status === 'success'
            ? 'thành công'
            : payment.status === 'failed'
                ? 'thất bại'
                : 'chờ xác nhận';
        return `BANK_TRANSFER (${statusText})`;
    };

    const handleConfirmPayment = async (paymentId: string) => {
        if (!confirm('Xác nhận khách đã thanh toán chuyển khoản?')) return;

        try {
            await confirmPayment(paymentId);
            toast.success('Đã xác nhận thanh toán thành công');

            // Update local cache immediately
            setPaymentMap(prev => {
                const next = new Map(prev);
                const existing = next.get(paymentId);
                if (existing) {
                    next.set(paymentId, { ...existing, status: 'success' });
                }
                return next;
            });

            // Also update by-order map (if present)
            setPaymentByOrderIdMap(prev => {
                const next = new Map(prev);
                for (const [orderId, payment] of next.entries()) {
                    if (payment?._id === paymentId) {
                        next.set(orderId, { ...payment, status: 'success' });
                    }
                }
                return next;
            });

            await onRefresh?.();
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Không thể xác nhận thanh toán';
            toast.error(errorMessage);
        }
    };

    const isBankTransferPaid = (order: Order): boolean => {
        if (order.paymentMethod !== 'BANK_TRANSFER') return true;
        if (order.isPaid) return true;

        const paymentId = typeof order.paymentId === 'string' ? order.paymentId : '';
        const payment = (paymentId ? paymentMap.get(paymentId) : undefined) || paymentByOrderIdMap.get(order._id);
        return payment?.status === 'success';
    };

    const getConfirmablePayment = (order: Order): Payment | null => {
        if (order.paymentMethod !== 'BANK_TRANSFER') return null;
        const paymentId = typeof order.paymentId === 'string' ? order.paymentId : '';
        const payment = (paymentId ? paymentMap.get(paymentId) : undefined) || paymentByOrderIdMap.get(order._id);
        return payment || null;
    };

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
                <thead className="bg-gray-50 text-left font-semibold text-gray-900">
                    <tr>
                        <th className="px-4 py-3">Mã đơn</th>
                        <th className="px-4 py-3">Khách hàng</th>
                        <th className="px-4 py-3">Món ăn</th>
                        <th className="px-4 py-3">Tổng tiền</th>
                        <th className="px-4 py-3">Thanh toán</th>
                        <th className="px-4 py-3">Hành động</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50 transition">
                            <td className="px-4 py-3 font-medium text-gray-900">
                                #{order._id.slice(-6)}
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                                {getCustomerName(order.userId as string)}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="whitespace-nowrap">
                                        <span className="font-bold">{item.quantity}x</span> {item.name}
                                    </div>
                                ))}
                            </td>
                            <td className="px-4 py-3 font-bold text-gray-900">
                                {((order.totalFoodPrice || 0) + (order.shippingFee || 0) - (order.discountAmount || 0)).toLocaleString()}đ
                            </td>
                            <td className="px-4 py-3 text-gray-500">
                                {getPaymentLabel(order)}
                            </td>
                            <td className="px-4 py-3">
                                {order.paymentMethod === 'BANK_TRANSFER' && (
                                    (() => {
                                        const payment = getConfirmablePayment(order);
                                        const canConfirm = Boolean(payment && !order.isPaid && payment.status === 'pending');
                                        const isLoading = loadingPaymentOrderIds.has(order._id) ||
                                            (typeof order.paymentId === 'string' && order.paymentId && loadingPaymentIds.has(order.paymentId));

                                        return (
                                            <div className="mb-2">
                                                <button
                                                    type="button"
                                                    disabled={!canConfirm || isLoading}
                                                    onClick={() => {
                                                        if (!payment?._id) {
                                                            toast.error('Không tìm thấy thông tin thanh toán của đơn này');
                                                            return;
                                                        }
                                                        handleConfirmPayment(payment._id);
                                                    }}
                                                    className="px-3 py-2 text-xs rounded-md border border-emerald-600 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isLoading ? 'Đang tải...' : 'Xác nhận thanh toán'}
                                                </button>
                                            </div>
                                        );
                                    })()
                                )}
                                {order.status === 'pending' ? (
                                    isBankTransferPaid(order) ? (
                                        <AcceptRejectButtons
                                            onAccept={() => {
                                                onUpdateStatus(order._id, 'confirmed');
                                            }}
                                            onReject={() => {
                                                onUpdateStatus(order._id, 'cancelled');
                                            }}
                                        />
                                    ) : (
                                        <div className="text-xs text-gray-500">
                                            Chờ xác nhận thanh toán để xử lý đơn.
                                        </div>
                                    )
                                ) : (
                                    <StatusUpdateControls
                                        currentStatus={order.status}
                                        onChangeStatus={(newStatus) => onUpdateStatus(order._id, newStatus)}
                                    />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderTable;
