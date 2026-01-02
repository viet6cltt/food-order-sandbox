// src/features/owner/components/OrdersTodayWidget.tsx
import React from 'react';
import { ShoppingBagIcon } from '@heroicons/react/24/solid';

const OrdersTodayWidget: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">Đơn hàng hôm nay</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">25</p>
                <p className="text-xs text-green-600 mt-2 flex items-center font-medium">
                    <span className="bg-green-100 px-1.5 py-0.5 rounded mr-1">+12%</span>
                    so với hôm qua
                </p>
            </div>
            <div className="p-4 bg-green-50 rounded-full">
                <ShoppingBagIcon className="w-8 h-8 text-green-600" />
            </div>
        </div>
    );
};

export default OrdersTodayWidget;