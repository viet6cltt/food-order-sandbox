import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartData {
    date: string;
    success: number;
    cancelled: number;
    total: number;
}

interface Props {
    data: ChartData[];
}

const OrderChartDetail: React.FC<Props> = ({ data }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Biểu đồ biến động Đơn hàng</h3>
            <p className="text-sm text-gray-500 mb-6">So sánh số lượng đơn thành công và đơn hủy theo thời gian thực.</p>

            <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorCancel" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend verticalAlign="top" height={36} />

                        <Area
                            type="monotone"
                            dataKey="success"
                            name="Đơn thành công"
                            stroke="#16a34a"
                            fillOpacity={1}
                            fill="url(#colorSuccess)"
                            strokeWidth={2}
                        />
                        <Area
                            type="monotone"
                            dataKey="cancelled"
                            name="Đơn hủy"
                            stroke="#ef4444"
                            fillOpacity={1}
                            fill="url(#colorCancel)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default OrderChartDetail;