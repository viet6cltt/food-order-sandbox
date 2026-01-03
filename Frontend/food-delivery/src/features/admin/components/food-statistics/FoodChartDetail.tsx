import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface FoodData {
    name: string;
    sold: number;
}

interface Props {
    data: FoodData[];
}

const FoodChartDetail: React.FC<Props> = ({ data }) => {
    const colors = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0'];

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Top 5 Món ăn bán chạy nhất</h3>
            <p className="text-sm text-gray-500 mb-6">Thống kê dựa trên số lượng đơn hàng đã hoàn thành.</p>

            <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={data}
                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            width={120}
                            tick={{ fontSize: 12, fill: '#374151', fontWeight: 600 }}
                        />
                        <Tooltip
                            cursor={{ fill: '#f0fdf4' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            // ✅ Fix lỗi: Bỏ định nghĩa type :number để TS tự suy luận (hoặc nhận any)
                            formatter={(value) => [`${value} phần`, 'Đã bán']}
                        />
                        <Bar dataKey="sold" name="Đã bán" radius={[0, 4, 4, 0]} barSize={40}>
                            {data.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default FoodChartDetail;