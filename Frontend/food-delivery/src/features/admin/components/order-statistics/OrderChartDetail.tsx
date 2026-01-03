import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { TimeRange } from './OrderFilter';

interface Props {
    data: any[];
    timeRange: TimeRange;
}

const OrderChartDetail: React.FC<Props> = ({ data, timeRange }) => {
    
    if (!data || !Array.isArray(data) || data.length === 0) {
        return (
            <div className="bg-white p-10 rounded-xl border border-dashed border-gray-300 text-center text-gray-400 mt-6 min-h-[400px] flex items-center justify-center">
                Không có dữ liệu biến động cho khoảng thời gian này.
            </div>
        );
    }

    const formatDate = (str: string) => {
        if (!str) return '';
        const date = new Date(str);
        // Kiểm tra xem date có hợp lệ không trước khi format
        if (isNaN(date.getTime())) return str; 
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    };

    const getRangeText = () => {
        switch (timeRange) {
            case '7days': return '7 ngày gần nhất';
            case '30days': return '30 ngày gần nhất';
            case 'this_month': return 'tháng này';
            default: return '';
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800">Biểu đồ xu hướng Đơn hàng</h3>
                <p className="text-sm text-gray-400 italic">
                    Dữ liệu biến động trong <span className="font-semibold text-gray-600">{getRangeText()}</span>
                </p>
            </div>

            {/* 2. Đảm bảo container cha có min-height */}
            <div className="h-[400px] w-full min-h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart 
                        data={data} 
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorCancel" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        
                        <XAxis 
                            dataKey="date" 
                            tickFormatter={formatDate}
                            tick={{ fontSize: 12, fill: '#94a3b8' }}
                            axisLine={false}
                            interval="preserveStartEnd" // Tự cân đối tick cho nhiều điểm dữ liệu
                        />
                        
                        <YAxis 
                            tick={{ fontSize: 12, fill: '#94a3b8' }} 
                            axisLine={false} 
                            allowDecimals={false} // 4. Không hiện số thập phân nếu đơn hàng là số nguyên
                        />

                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            labelFormatter={(label) => {
                                const d = new Date(label);
                                return isNaN(d.getTime()) ? label : `Ngày ${d.toLocaleDateString('vi-VN')}`;
                            }}
                        />
                        <Legend verticalAlign="top" align="right" height={40} iconType="circle" />

                        {/* 5. Thêm connectNulls={true} để tránh biểu đồ bị đứt đoạn nếu có ngày thiếu data */}
                        <Area 
                            type="monotone" 
                            dataKey="completed" 
                            name="Đơn thành công" 
                            stroke="#10B981" 
                            fill="url(#colorSuccess)" 
                            strokeWidth={3} 
                            connectNulls={true}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="cancelled" 
                            name="Đơn hủy" 
                            stroke="#EF4444" 
                            fill="url(#colorCancel)" 
                            strokeWidth={2} 
                            strokeDasharray="5 5" 
                            connectNulls={true}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default OrderChartDetail;