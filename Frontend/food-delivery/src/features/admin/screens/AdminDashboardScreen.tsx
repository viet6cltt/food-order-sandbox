import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout';

// Import Components
import OrderChart from '../components/dashboard/OrderChart';
import TopFoodsChart from '../components/dashboard/TopFoodsChart';

// Icons
import { 
  ChartBarIcon, 
  UsersIcon, 
  ClipboardDocumentCheckIcon, 
  ExclamationTriangleIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const AdminDashboardScreen: React.FC = () => {
    const navigate = useNavigate();

    return (
        <AdminLayout className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">

            {/* 1. Header Dashboard */}
            <div className="mb-8 flex items-center">
                <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                    <ChartBarIcon className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản Trị Hệ Thống</h1>
                    <p className="text-gray-500 text-sm mt-1">Lối tắt quản lý và thống kê quan trọng</p>
                </div>
            </div>

            {/* 2. Quick Actions - Các nút điều hướng nhanh */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <button 
                    onClick={() => navigate('/admin/categories')}
                    className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-indigo-500 hover:shadow-md transition-all group"
                >
                    <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 mr-4">
                        <TagIcon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <span className="font-semibold text-gray-700">Danh mục</span>
                </button>
                <button 
                    onClick={() => navigate('/admin/users')}
                    className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-indigo-500 hover:shadow-md transition-all group"
                >
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 mr-4">
                        <UsersIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="font-semibold text-gray-700">Người dùng</span>
                </button>

                <button 
                    onClick={() => navigate('/admin/restaurant-requests')}
                    className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-green-500 hover:shadow-md transition-all group"
                >
                    <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 mr-4">
                        <ClipboardDocumentCheckIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="font-semibold text-gray-700">Yêu cầu mở quán</span>
                </button>

                <button 
                    onClick={() => navigate('/admin/reports')}
                    className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-red-500 hover:shadow-md transition-all group"
                >
                    <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 mr-4">
                        <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                    </div>
                    <span className="font-semibold text-gray-700">Báo cáo vi phạm</span>
                </button>
            </div>

            {/* 3. Biểu đồ thống kê */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Biểu đồ đơn hàng (Tuần qua) - Chiếm 2 phần */}
                <div className="lg:col-span-2">
                    <OrderChart />
                    <p className="mt-2 text-xs text-center text-gray-400 italic">
                        * Thống kê số lượng đơn hàng trong 7 ngày gần nhất
                    </p>
                </div>

                {/* Top món bán chạy - Chiếm 1 phần */}
                <div className="lg:col-span-1">
                    <TopFoodsChart />
                </div>
            </div>

        </AdminLayout>
    );
};

export default AdminDashboardScreen;