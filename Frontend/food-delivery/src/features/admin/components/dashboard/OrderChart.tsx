// src/features/admin/components/dashboard/OrderChart.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DATA = [
    { name: 'T2', orders: 120, cancel: 5 }, { name: 'T3', orders: 132, cancel: 8 },
    { name: 'T4', orders: 101, cancel: 2 }, { name: 'T5', orders: 154, cancel: 10 },
    { name: 'T6', orders: 190, cancel: 15 }, { name: 'T7', orders: 230, cancel: 20 },
    { name: 'CN', orders: 210, cancel: 18 },
];

const OrderChart: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Số lượng Đơn hàng (Tuần qua)</h3>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="orders" name="Thành công" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={30} />
                        <Bar dataKey="cancel" name="Bị hủy" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
export default OrderChart;