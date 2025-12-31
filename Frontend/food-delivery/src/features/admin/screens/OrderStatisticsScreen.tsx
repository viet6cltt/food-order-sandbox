import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../layouts/AdminLayout'; // Layout chuẩn
import OrderFilter, { type TimeRange, type OrderStatus } from '../components/order-statistics/OrderFilter';
import OrderChartDetail from '../components/order-statistics/OrderChartDetail';
import { ArrowTrendingUpIcon, ClipboardDocumentCheckIcon, XCircleIcon } from '@heroicons/react/24/outline';

// --- MOCK DATA GENERATOR ---
// Hàm tạo dữ liệu giả dựa trên thời gian
const generateData = (range: TimeRange) => {
    const data = [];
    let days = range === '7days' ? 7 : 30;

    for (let i = 1; i <= days; i++) {
        const success = Math.floor(Math.random() * 50) + 20; // 20-70 đơn
        const cancelled = Math.floor(Math.random() * 10);    // 0-10 đơn
        data.push({
            date: `Ngày ${i}`,
            success: success,
            cancelled: cancelled,
            total: success + cancelled
        });
    }
    return data;
};

const OrderStatisticsScreen: React.FC = () => {
    const [timeRange, setTimeRange] = useState<TimeRange>('7days');
    const [statusFilter, setStatusFilter] = useState<OrderStatus>('all');
    const [chartData, setChartData] = useState(generateData('7days'));

    // Giả lập call API khi đổi filter
    useEffect(() => {
        // Tạo dữ liệu mới ngẫu nhiên để thấy biểu đồ thay đổi
        const newData = generateData(timeRange);
        setChartData(newData);
    }, [timeRange, statusFilter]);

    // Tính toán số liệu tổng quan
    const totalSuccess = chartData.reduce((acc, curr) => acc + curr.success, 0);
    const totalCancel = chartData.reduce((acc, curr) => acc + curr.cancelled, 0);
    const totalOrders = totalSuccess + totalCancel;
    const cancelRate = totalOrders > 0 ? ((totalCancel / totalOrders) * 100).toFixed(1) : '0';

    return (
        <AdminLayout className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Chi tiết Thống kê Đơn hàng</h1>
                <p className="text-gray-500 text-sm mt-1">Phân tích hiệu suất giao hàng và tỷ lệ hủy đơn.</p>
            </div>

            {/* 1. Bộ lọc */}
            <OrderFilter
                timeRange={timeRange}
                onTimeChange={setTimeRange}
                status={statusFilter}
                onStatusChange={setStatusFilter}
            />

            {/* 2. Thẻ Summary (Tóm tắt nhanh) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-white p-5 rounded-xl border border-green-100 shadow-sm flex items-center">
                    <div className="p-3 bg-green-100 text-green-600 rounded-full mr-4">
                        <ClipboardDocumentCheckIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Đơn thành công</p>
                        <p className="text-2xl font-bold text-gray-900">{totalSuccess}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-red-100 shadow-sm flex items-center">
                    <div className="p-3 bg-red-100 text-red-600 rounded-full mr-4">
                        <XCircleIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Đơn hủy</p>
                        <p className="text-2xl font-bold text-gray-900">{totalCancel}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm flex items-center">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full mr-4">
                        <ArrowTrendingUpIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Tỷ lệ hoàn thành</p>
                        <p className="text-2xl font-bold text-gray-900">{100 - Number(cancelRate)}%</p>
                    </div>
                </div>
            </div>

            {/* 3. Biểu đồ chi tiết */}
            <OrderChartDetail data={chartData} />

        </AdminLayout>
    );
};

export default OrderStatisticsScreen;

