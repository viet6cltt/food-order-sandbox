// src/features/owner/screens/OwnerDashboardScreen.tsx
import React from 'react';
import OrderList from '../components/OrderList';
import OwnerDashboardLayout from '../OwnerDashboardLayout';
import OrdersTodayWidget from '../components/OrdersTodayWidget'; // Import Widget mới
import { ChartBarIcon } from '@heroicons/react/24/outline'; // Icon cho Widget Doanh thu

// Widget Doanh thu (Placeholder tĩnh)
const RevenueWidget: React.FC = () => (
    <div className="p-4 bg-white rounded-xl shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-full">
                <ChartBarIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">Tổng Doanh Thu (Hôm Nay)</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">1,500,000₫</p>
            </div>
        </div>
    </div>
);


const OwnerDashboardScreen: React.FC = () => {
    return (
        <OwnerDashboardLayout>
            <div className="p-4 pt-8 max-w-4xl mx-auto pb-20 md:pb-4">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
                    <ChartBarIcon className="w-8 h-8 mr-2 text-orange-500" />
                    Bảng Điều Khiển Nhà Hàng
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <OrdersTodayWidget />
                    <RevenueWidget />
                </div>

                <OrderList />
            </div>
        </OwnerDashboardLayout>
    );
};

export default OwnerDashboardScreen;