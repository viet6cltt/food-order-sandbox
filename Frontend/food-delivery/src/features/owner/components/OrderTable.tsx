import React, { useEffect, useState, useMemo, useRef } from 'react';
import type { Order, OrderStatus } from '../../../types/order';
import AcceptRejectButtons from './AcceptRejectButtons';
import StatusUpdateControls from './StatusUpdateControls';
import { getUser, type UserResponse } from '../../../features/profile/api';

interface Props {
    orders: Order[];
    onUpdateStatus: (id: string, status: OrderStatus) => void;
}

const OrderTable: React.FC<Props> = ({ orders, onUpdateStatus }) => {
    const [userMap, setUserMap] = useState<Map<string, UserResponse>>(new Map());
    const [loadingUserIds, setLoadingUserIds] = useState<Set<string>>(new Set());
    const fetchedUserIdsRef = useRef<Set<string>>(new Set());

    // Get unique userIds from orders - use useMemo to prevent unnecessary recalculations
    const uniqueUserIds = useMemo(() => {
        const userIds = orders
            .map(order => order.userId)
            .filter((id): id is string => typeof id === 'string' && id.trim() !== '');
        return Array.from(new Set(userIds));
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
                                {order.paymentMethod || 'Tiền mặt'}
                            </td>
                            <td className="px-4 py-3">
                                {order.status === 'pending' ? (
                                    <AcceptRejectButtons
                                        onAccept={() => {
                                            onUpdateStatus(order._id, 'confirmed');
                                        }}
                                        onReject={() => {
                                            onUpdateStatus(order._id, 'cancelled');
                                        }}
                                    />
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
