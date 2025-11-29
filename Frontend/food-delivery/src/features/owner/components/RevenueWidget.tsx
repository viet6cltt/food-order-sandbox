// src/features/owner/components/RevenueWidget.tsx
import React from 'react';
import { BanknotesIcon } from '@heroicons/react/24/solid';

const RevenueWidget: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">Doanh thu hôm nay</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">1,500,000₫</p>
                <p className="text-xs text-gray-400 mt-2">
                    Tổng doanh thu tháng: <span className="font-semibold text-gray-700">45,000,000₫</span>
                </p>
            </div>
            <div className="p-4 bg-green-50 rounded-full">
                <BanknotesIcon className="w-8 h-8 text-green-600" />
            </div>
        </div>
    );
};

export default RevenueWidget;