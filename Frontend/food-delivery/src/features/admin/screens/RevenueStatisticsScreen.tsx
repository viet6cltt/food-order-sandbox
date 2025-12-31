import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout'; // ✅ Bật lại Layout
import RevenueChartDetail from '../components/revenue-statistics/RevenueChartDetail';
import ExportButton from '../components/revenue-statistics/ExportButton';
import { CurrencyDollarIcon, BanknotesIcon } from '@heroicons/react/24/outline';

// --- MOCK DATA ---
const generateRevenueData = () => {
    const data = [];
    for (let i = 1; i <= 7; i++) {
        const revenue = Math.floor(Math.random() * 5000000) + 2000000;
        data.push({
            date: `Ngày ${i}`,
            revenue: revenue,
            profit: Math.floor(revenue * 0.2)
        });
    }
    return data;
};

const RevenueStatisticsScreen: React.FC = () => {
    const [data] = useState(generateRevenueData());
    const [isExporting, setIsExporting] = useState(false);

    const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
    const totalProfit = data.reduce((acc, curr) => acc + curr.profit, 0);

    const formatVND = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            alert('Đã tải xuống báo cáo doanh thu thành công!');
        }, 1500);
    };

    return (
        <AdminLayout className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Báo cáo Doanh thu</h1>
                    <p className="text-gray-500 text-sm mt-1">Tổng hợp doanh thu và lợi nhuận hệ thống.</p>
                </div>
                <ExportButton onExport={handleExport} isLoading={isExporting} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center">
                    <div className="p-4 bg-green-50 text-green-600 rounded-full mr-5">
                        <CurrencyDollarIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium">Tổng Doanh Thu (GMV)</p>
                        <h2 className="text-3xl font-bold text-gray-900 mt-1">{formatVND(totalRevenue)}</h2>
                        <p className="text-xs text-green-600 font-bold mt-1 flex items-center">
                            ↑ 12.5% <span className="text-gray-400 font-normal ml-1">so với tuần trước</span>
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-full mr-5">
                        <BanknotesIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium">Lợi Nhuận Ròng (20%)</p>
                        <h2 className="text-3xl font-bold text-gray-900 mt-1">{formatVND(totalProfit)}</h2>
                        <p className="text-xs text-green-600 font-bold mt-1 flex items-center">
                            ↑ 8.2% <span className="text-gray-400 font-normal ml-1">so với tuần trước</span>
                        </p>
                    </div>
                </div>
            </div>

            <RevenueChartDetail data={data} />
        </AdminLayout>
    );
};

export default RevenueStatisticsScreen;