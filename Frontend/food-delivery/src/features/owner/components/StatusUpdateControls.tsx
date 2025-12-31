import React from 'react';
import type { OrderStatus } from '../../../types/order';

interface Props {
    currentStatus: OrderStatus;
    onChangeStatus: (newStatus: OrderStatus) => void;
}

// Map trạng thái sang tiếng Việt và màu sắc
// QUAN TRỌNG: Key ở đây phải khớp 100% với file types/order.ts
const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
    pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Đã nhận đơn', color: 'bg-blue-100 text-blue-800' },
    cooking: { label: 'Đang chế biến', color: 'bg-orange-100 text-orange-800' },
    delivering: { label: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
    completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
    // SỬA Ở ĐÂY: Dùng 'canceled' (1 chữ l)
    canceled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
    refunded: { label: 'Đã hoàn tiền', color: 'bg-gray-100 text-gray-800' },
};

const StatusUpdateControls: React.FC<Props> = ({ currentStatus, onChangeStatus }) => {
    // Nếu đơn đã xong hoặc hủy thì chỉ hiển thị badge (nhãn), không cho sửa nữa
    if (currentStatus === 'completed' || currentStatus === 'canceled' || currentStatus === 'refunded') {
        const config = STATUS_CONFIG[currentStatus] || { label: currentStatus, color: 'bg-gray-100' };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${config.color}`}>
                {config.label}
            </span>
        );
    }

    return (
        <select
            value={currentStatus}
            onChange={(e) => onChangeStatus(e.target.value as OrderStatus)}
            className={`block w-full max-w-[140px] rounded-md border-gray-300 py-1.5 pl-3 pr-8 text-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm bg-gray-50 border`}
        >
            <option value="confirmed">Đã nhận đơn</option>
            <option value="cooking">Đang nấu</option>
            <option value="delivering">Đang giao</option>
            <option value="completed">Hoàn thành</option>
            {/* SỬA Ở ĐÂY: Value phải là 'canceled' */}
            <option value="canceled">Hủy đơn</option>
        </select>
    );
};

export default StatusUpdateControls;