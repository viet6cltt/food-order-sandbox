import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout'; // ✅ Bật lại Layout
import FoodChartDetail from '../components/food-statistics/FoodChartDetail';
import ExportCSV from '../components/food-statistics/ExportCSV';
import { FireIcon, TrophyIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/solid';

// --- MOCK DATA ---
const MOCK_FOOD_DATA = [
    { id: '1', name: 'Cơm Tấm Sườn', sold: 1250, revenue: 62500000 },
    { id: '2', name: 'Trà Sữa TC', sold: 980, revenue: 49000000 },
    { id: '3', name: 'Bún Bò Huế', sold: 850, revenue: 42500000 },
    { id: '4', name: 'Gà Rán', sold: 720, revenue: 25200000 },
    { id: '5', name: 'Phở Bò', sold: 640, revenue: 32000000 },
];

const FoodStatisticScreen: React.FC = () => {
    const [data] = useState(MOCK_FOOD_DATA);
    const [isExporting, setIsExporting] = useState(false);

    // --- LOGIC XUẤT CSV ---
    const handleExportCSV = () => {
        setIsExporting(true);
        setTimeout(() => {
            const headers = ['ID,Ten Mon,So Luong Ban,Doanh Thu'];
            const rows = data.map(item => `${item.id},${item.name},${item.sold},${item.revenue}`);
            const csvContent = headers.concat(rows).join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', 'thong_ke_mon_an.csv');
            document.body.appendChild(link);

            link.click();
            document.body.removeChild(link);

            setIsExporting(false);
        }, 1000);
    };

    const bestSeller = data.reduce((prev, current) => (prev.sold > current.sold) ? prev : current);

    return (
        <AdminLayout className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Thống kê Món ăn</h1>
                    <p className="text-gray-500 text-sm mt-1">Phân tích xu hướng ẩm thực và món ăn yêu thích.</p>
                </div>
                <ExportCSV onExport={handleExportCSV} isLoading={isExporting} />
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Card 1 */}
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                    <TrophyIcon className="w-24 h-24 absolute -right-4 -bottom-4 opacity-20" />
                    <p className="text-orange-100 font-bold mb-1">Món Bán Chạy Nhất</p>
                    <h2 className="text-3xl font-extrabold">{bestSeller.name}</h2>
                    <p className="mt-2 text-sm bg-white/20 inline-block px-2 py-1 rounded">
                        Đã bán: {bestSeller.sold} phần
                    </p>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center">
                    <div className="p-4 bg-green-50 text-green-600 rounded-full mr-5">
                        <FireIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium">Tổng món phục vụ</p>
                        <h2 className="text-3xl font-bold text-gray-900 mt-1">
                            {data.reduce((acc, curr) => acc + curr.sold, 0).toLocaleString()}
                        </h2>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-full mr-5">
                        <ArrowTrendingUpIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium">Doanh thu món ăn</p>
                        <h2 className="text-3xl font-bold text-gray-900 mt-1">
                            {(data.reduce((acc, curr) => acc + curr.revenue, 0) / 1000000).toFixed(1)}M
                        </h2>
                        <p className="text-xs text-gray-400">VNĐ</p>
                    </div>
                </div>
            </div>

            <FoodChartDetail data={data} />
        </AdminLayout>
    );
};

export default FoodStatisticScreen;