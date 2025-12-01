// src/features/owner/components/TopSellingItems.tsx
import React from 'react';
import { FireIcon } from '@heroicons/react/24/solid';

const MOCK_TOP_ITEMS = [
    { id: 1, name: 'Phở Bò Đặc Biệt', sales: 120, revenue: 7800000 },
    { id: 2, name: 'Cơm Tấm Sườn Bì', sales: 95, revenue: 4275000 },
    { id: 3, name: 'Trà Chanh Giã Tay', sales: 80, revenue: 1200000 },
    { id: 4, name: 'Bún Chả Hà Nội', sales: 65, revenue: 3575000 },
];

const TopSellingItems: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <FireIcon className="w-5 h-5 text-orange-500 mr-2" />
                Món Bán Chạy Nhất
            </h2>
            <div className="space-y-5">
                {MOCK_TOP_ITEMS.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                            {/* Số thứ tự: Top 1 màu Vàng, còn lại màu Xám */}
                            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold mr-3 
                                ${index === 0 ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                {index + 1}
                            </span>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                                <p className="text-xs text-gray-500">{item.sales} đã bán</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-green-600">{item.revenue.toLocaleString()}đ</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopSellingItems;