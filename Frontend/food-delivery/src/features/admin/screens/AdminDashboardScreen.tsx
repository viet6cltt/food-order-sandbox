import React from 'react';
// Import Layout
import AdminLayout from '../../../layouts/AdminLayout';

// Import các Components Biểu đồ (Đảm bảo đường dẫn đúng với nơi bạn tạo file)
import UserChart from '../components/dashboard/UserChart';
import RevenueChart from '../components/dashboard/RevenueChart';
import OrderChart from '../components/dashboard/OrderChart';
import TopFoodsChart from '../components/dashboard/TopFoodsChart';

// Icon trang trí
import { ChartBarIcon } from '@heroicons/react/24/outline';

const AdminDashboardScreen: React.FC = () => {
    return (
        // className giúp nội dung cách lề ra cho đẹp
        <AdminLayout className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">

            {/* 1. Header Dashboard */}
            <div className="mb-8 flex items-center">
                <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                    <ChartBarIcon className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Tổng Quan</h1>
                    <p className="text-gray-500 text-sm mt-1">Chào mừng quay trở lại, Admin!</p>
                </div>
            </div>

            {/* 2. Grid Layout chứa các biểu đồ */}
            <div className="space-y-6">

                {/* Dòng 1: Doanh thu & Order (Hai cái quan trọng nhất) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RevenueChart />
                    <OrderChart />
                </div>

                {/* Dòng 2: Người dùng & Top Món ăn */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* UserChart chiếm 2 phần chiều rộng */}
                    <div className="lg:col-span-2">
                        <UserChart />
                    </div>
                    {/* TopFoodsChart chiếm 1 phần chiều rộng */}
                    <div className="lg:col-span-1">
                        <TopFoodsChart />
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
};

export default AdminDashboardScreen;

