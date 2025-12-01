// src/features/owner/components/OrdersTodayWidget.tsx
import React, { useState } from 'react';
import { ShoppingBagIcon } from '@heroicons/react/24/solid';

interface OrdersTodayWidgetProps {
    className?: string;
}

const OrdersTodayWidget: React.FC<OrdersTodayWidgetProps> = ({ className = '' }) => {
    const [ordersToday] = useState(25);

    return (
        <div className={`p-4 bg-white rounded-xl shadow-md flex items-center justify-between ${className}`}>
            <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-full">
                    <ShoppingBagIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Đơn hàng mới hôm nay</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{ordersToday.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default OrdersTodayWidget;