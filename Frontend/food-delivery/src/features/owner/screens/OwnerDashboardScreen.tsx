// src/features/owner/screens/OwnerDashboardScreen.tsx
import React from 'react';
import OrderList from '../components/OrderList';
import OrdersTodayWidget from '../components/OrdersTodayWidget';
import RevenueWidget from '../components/RevenueWidget';
import TopSellingItems from '../components/TopSellingItems';
import { ChartBarIcon } from '@heroicons/react/24/outline';

const OwnerDashboardScreen: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">

                {/* Header Dashboard */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <ChartBarIcon className="w-8 h-8 mr-3 text-green-600" />
                        Tổng Quan Nhà Hàng
                    </h1>
                    <p className="text-gray-500 mt-1 ml-11">Chào mừng trở lại! Đây là tình hình kinh doanh hôm nay.</p>
                </div>

                {/* PHẦN 1: Thống kê (2 Widget lớn) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <RevenueWidget />
                    <OrdersTodayWidget />
                </div>

                {/* PHẦN 2: Nội dung chính (Chia cột lệch 2/3 - 1/3) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Bên trái: Danh sách đơn hàng cần làm (Chiếm 2 phần) */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Đơn hàng cần xử lý</h2>
                            <OrderList />
                        </div>
                    </div>

                    {/* Bên phải: Top món ăn (Chiếm 1 phần) */}
                    <div className="lg:col-span-1">
                        <TopSellingItems />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OwnerDashboardScreen;