import React from 'react';
import type { Order, OrderStatus } from '../../../types/order';
import AcceptRejectButtons from './AcceptRejectButtons';
import StatusUpdateControls from './StatusUpdateControls';

interface Props {
    orders: Order[];
    onUpdateStatus: (id: string, status: OrderStatus) => void;
}

const OrderTable: React.FC<Props> = ({ orders, onUpdateStatus }) => {
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
                                {order.customerName || 'Khách vãng lai'}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="whitespace-nowrap">
                                        <span className="font-bold">{item.quantity}x</span> {item.name}
                                    </div>
                                ))}
                            </td>
                            <td className="px-4 py-3 font-bold text-gray-900">
                                {order.totalPrice.toLocaleString()}đ
                            </td>
                            <td className="px-4 py-3 text-gray-500">
                                {order.paymentMethod || 'Tiền mặt'}
                            </td>
                            <td className="px-4 py-3">
                                {order.status === 'pending' ? (
                                    <AcceptRejectButtons
                                        onAccept={() => {
                                            console.log("-> Gửi lệnh CONFIRMED");
                                            onUpdateStatus(order._id, 'confirmed');
                                        }}
                                        onReject={() => {
                                            console.log("-> Gửi lệnh CANCELED");
                                            // Đảm bảo ở đây là 'canceled' (1 chữ l theo order.ts của bạn)
                                            onUpdateStatus(order._id, 'canceled');
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