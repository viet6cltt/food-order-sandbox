import React from 'react';
import { CalendarDaysIcon, FunnelIcon } from '@heroicons/react/24/outline';

export type TimeRange = '7days' | '30days' | 'this_month';
export type OrderStatus = 'all' | 'completed' | 'cancelled';

interface Props {
    timeRange: TimeRange;
    onTimeChange: (range: TimeRange) => void;
    status: OrderStatus;
    onStatusChange: (status: OrderStatus) => void;
}

const OrderFilter: React.FC<Props> = ({ timeRange, onTimeChange, status, onStatusChange }) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">

            {/* 1. Bộ lọc Thời gian */}
            <div className="flex items-center space-x-2">
                <CalendarDaysIcon className="w-5 h-5 text-gray-500" />
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {[
                        { id: '7days', label: '7 ngày qua' },
                        { id: '30days', label: '30 ngày qua' },
                        { id: 'this_month', label: 'Tháng này' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onTimeChange(item.id as TimeRange)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all
                                ${timeRange === item.id
                                    ? 'bg-white text-green-700 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-900'}
                            `}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. Bộ lọc Trạng thái */}
            <div className="flex items-center space-x-2">
                <FunnelIcon className="w-5 h-5 text-gray-500" />
                <select
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value as OrderStatus)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5 outline-none"
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="completed">Đơn thành công</option>
                    <option value="cancelled">Đơn đã hủy</option>
                </select>
            </div>

        </div>
    );
};

export default OrderFilter;