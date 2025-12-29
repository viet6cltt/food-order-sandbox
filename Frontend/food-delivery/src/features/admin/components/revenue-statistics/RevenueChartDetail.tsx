import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface RevenueData {
    date: string;
    revenue: number;
    profit: number;
}

interface Props {
    data: RevenueData[];
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const RevenueChartDetail: React.FC<Props> = ({ data }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Biểu đồ Tăng trưởng Doanh thu</h3>
            <p className="text-sm text-gray-500 mb-6">Theo dõi tổng doanh thu (GMV) và lợi nhuận thực tế.</p>

            <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                        <Tooltip
                            // ✅ Fix lỗi type: ép kiểu value as number
                            formatter={(value) => formatCurrency(value as number)}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{ fill: '#f0fdf4' }}
                        />
                        <Legend verticalAlign="top" height={36} />

                        <Bar
                            dataKey="revenue"
                            name="Tổng Doanh thu"
                            fill="#4ade80"
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                        />
                        <Bar
                            dataKey="profit"
                            name="Lợi nhuận ròng"
                            fill="#16a34a"
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueChartDetail;