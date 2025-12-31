// src/features/admin/components/dashboard/RevenueChart.tsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DATA = [
    { name: 'Tuần 1', revenue: 15000000 }, { name: 'Tuần 2', revenue: 22000000 },
    { name: 'Tuần 3', revenue: 18000000 }, { name: 'Tuần 4', revenue: 32000000 },
];

const RevenueChart: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Tổng Doanh thu (VNĐ)</h3>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={DATA}>
                        <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                        <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value))} />            <Area type="monotone" dataKey="revenue" stroke="#059669" fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
export default RevenueChart;