import React from 'react';
import type { OrderStatus } from '../../../types/order';

interface Props {
    currentStatus: OrderStatus;
    onChangeStatus: (newStatus: OrderStatus) => void;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
    confirmed: { label: 'Đã nhận đơn', color: 'bg-blue-100 text-blue-800' },
    preparing: { label: 'Đang chế biến', color: 'bg-orange-100 text-orange-800' },
    delivering: { label: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
    completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
    refunded: { label: 'Đã hoàn tiền', color: 'bg-gray-100 text-gray-800' },
};

const StatusUpdateControls: React.FC<Props> = ({ currentStatus, onChangeStatus }) => {
        if ( currentStatus === 'completed' || currentStatus === 'cancelled') {
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
            className={`block w-full max-w-[160px] rounded-md border-gray-300 py-1.5 pl-3 pr-8 text-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm bg-gray-50 border`}
        >
            <option value="confirmed">Đã nhận đơn</option>
            <option value="preparing">Đang chế biến</option>
            <option value="delivering">Đang giao</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Hủy đơn</option>
        </select>
    );
};

export default StatusUpdateControls;