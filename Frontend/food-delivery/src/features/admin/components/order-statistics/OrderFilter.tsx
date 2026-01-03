import React from 'react';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

export type TimeRange = '7days' | '30days' | 'this_month';

interface Props {
    timeRange: TimeRange;
    onTimeChange: (range: TimeRange) => void;
}

const OrderFilter: React.FC<Props> = ({ timeRange, onTimeChange }) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">

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
        </div>
    );
};

export default OrderFilter;