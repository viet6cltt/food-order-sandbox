import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { adminOrderApi } from '../../api';
import { toast } from 'react-toastify';

type CategoryData = Record<string, string | number> & {
    name: string;
    value: number;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const TopFoodsChart: React.FC = () => {
    const [data, setData] = useState<CategoryData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTopCategories = async () => {
            try {
                setIsLoading(true);
                const result = await adminOrderApi.getTopCategories();
                setData(result);
            } catch (error) {
                console.error("Error fetching top categories:", error);
                toast.error("Không thể tải dữ liệu top thể loại");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTopCategories();
    }, []);

    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center h-[396px]">
                <div className="text-gray-400 animate-pulse text-sm">Đang tải dữ liệu món ăn...</div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center h-[396px]">
                <div className="text-gray-400 text-sm">Chưa có dữ liệu bán hàng.</div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Top Thể Loại (SL món - đơn hoàn thành)</h3>
                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full uppercase font-bold">
                    Số lượng
                </span>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70} // Tăng innerRadius để trông thanh thoát hơn
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ value }) => `${value}`} // Hiện số lượng trực tiếp
                        >
                            {data.map((_, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]} 
                                    stroke="none"
                                />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend 
                            verticalAlign="bottom" 
                            height={36} 
                            iconType="circle"
                            formatter={(value) => <span className="text-xs text-gray-600 font-medium">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TopFoodsChart;