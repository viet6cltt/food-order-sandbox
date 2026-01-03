import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { adminOrderApi } from '../../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { formatLocalDateYYYYMMDD } from '../../utils/date';

// Interface cho dữ liệu biểu đồ
interface ChartData {
  date: string;
  completed: number;
  cancelled: number;
}

const OrderChart: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true);
        
        // Tạo dải ngày mặc định: 7 ngày gần nhất
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 7);

        const startDateStr = formatLocalDateYYYYMMDD(start);
        const endDateStr = formatLocalDateYYYYMMDD(end);

        // Sử dụng chung API getReport để đảm bảo tính nhất quán dữ liệu
        const response = await adminOrderApi.getReport(startDateStr, endDateStr);
        
        // BE trả về object { trend, ... }, chúng ta lấy mảng trend để vẽ biểu đồ
        setData(response.trend || []);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        toast.error("Không thể tải dữ liệu biểu đồ");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, []);

  // Format hiển thị ngày trên trục X (VD: 2026-01-02 -> 02/01)
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[380px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm animate-pulse">Đang tải biểu đồ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 tracking-tight">Số lượng Đơn hàng</h3>
          <p className="text-xs text-gray-500 mt-1 italic">7 ngày gần nhất</p>
        </div>
        
        <button 
          onClick={() => navigate('/admin/orders/statistics')} // Điều hướng tới trang thống kê chi tiết
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-all border border-green-100 active:scale-95"
        >
          Xem chi tiết
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="h-[300px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate} 
                tick={{fontSize: 12, fill: '#9CA3AF'}}
                axisLine={false}
                tickLine={false}
                minTickGap={10}
              />
              <YAxis 
                tick={{fontSize: 12, fill: '#9CA3AF'}}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: '#f9fafb' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                labelFormatter={(label) => `Ngày: ${new Date(label).toLocaleDateString('vi-VN')}`}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
              
              <Bar 
                dataKey="completed" 
                name="Thành công" 
                fill="#10B981" 
                radius={[4, 4, 0, 0]} 
                barSize={24} 
              />
              <Bar 
                dataKey="cancelled" 
                name="Bị hủy" 
                fill="#EF4444" 
                radius={[4, 4, 0, 0]} 
                barSize={24} 
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">
            Không có dữ liệu trong 7 ngày qua
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderChart;