import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import AdminLayout from '../../../layouts/AdminLayout';
import OrderFilter, { type TimeRange } from '../components/order-statistics/OrderFilter';
import OrderChartDetail from '../components/order-statistics/OrderChartDetail';
import { adminOrderApi } from '../api';
import {
  TruckIcon,
  ClipboardDocumentCheckIcon,
  XCircleIcon,
  BanknotesIcon,
  CheckBadgeIcon,
  ClipboardDocumentIcon,
  ArrowTrendingUpIcon,
  StopIcon
} from '@heroicons/react/24/outline';
import { formatLocalDateYYYYMMDD } from '../utils/date';

// --- Types ---
interface StatusBreakdown {
  _id: string;
  count: number;
}

type TrendPoint = {
  date: string;
  completed?: number;
  cancelled?: number;
} & Record<string, unknown>;

interface StatsState {
  statusBreakdown: StatusBreakdown[];
  totalRevenue: number;
  trend: TrendPoint[];
}

const OrderStatisticsScreen: React.FC = () => {
  // --- States ---
  const [timeRange, setTimeRange] = useState<TimeRange>('7days');
  const [isLoading, setIsLoading] = useState(false);
  const [statsData, setStatsData] = useState<StatsState>({
    statusBreakdown: [],
    totalRevenue: 0,
    trend: [],
  });

  // --- Helpers ---
  const getStatusConfig = (id: string) => {
    const map: Record<string, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
      pending: { 
        label: 'Chờ xác nhận', 
        color: 'text-amber-600', 
        bgColor: 'bg-amber-50', 
        icon: <ClipboardDocumentIcon className="w-5 h-5" /> 
      },
      confirmed: { 
        label: 'Đã xác nhận', 
        color: 'text-blue-600', 
        bgColor: 'bg-blue-50', 
        icon: <CheckBadgeIcon className="w-5 h-5" /> 
      },
      delivering: { 
        label: 'Đang vận chuyển', 
        color: 'text-indigo-600', 
        bgColor: 'bg-indigo-50', 
        icon: <TruckIcon className="w-5 h-5" /> 
      },
      completed: { 
        label: 'Thành công', 
        color: 'text-green-600', 
        bgColor: 'bg-green-50', 
        icon: <ClipboardDocumentCheckIcon className="w-5 h-5" /> 
      },
      cancelled: { 
        label: 'Đã hủy', 
        color: 'text-red-600', 
        bgColor: 'bg-red-50', 
        icon: <XCircleIcon className="w-5 h-5" /> 
      },
    };
    return map[id] || { 
      label: id, 
      color: 'text-gray-600', 
      bgColor: 'bg-gray-50', 
      icon: <StopIcon className="w-5 h-5" /> 
    };
  };

  const getCount = (status: string) => 
    statsData.statusBreakdown.find((s) => s._id === status)?.count || 0;

  const totalOrders = statsData.statusBreakdown.reduce((acc, curr) => acc + curr.count, 0);
  
  const successRate = totalOrders > 0 
    ? ((getCount('completed') / totalOrders) * 100).toFixed(1) 
    : '0';

  // --- Data Fetching ---
  const fetchStatistics = useCallback(async () => {
    setIsLoading(true);
    try {
      const end = new Date();
      const start = new Date();

      if (timeRange === '7days') start.setDate(end.getDate() - 7);
      else if (timeRange === '30days') start.setDate(end.getDate() - 30);
      else if (timeRange === 'this_month') start.setDate(1);

      const startDateStr = formatLocalDateYYYYMMDD(start);
      const endDateStr = formatLocalDateYYYYMMDD(end);

      // Gọi duy nhất API chứa cả trend và statistics
      const data = await adminOrderApi.getReport(startDateStr, endDateStr);

      setStatsData({
        statusBreakdown: data.statusBreakdown || [],
        totalRevenue: data.totalRevenue || 0,
        trend: data.trend || [],
      });
    } catch {
      toast.error("Không thể tải thống kê");
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // --- Render ---
  return (
    <AdminLayout className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Phân tích Hệ thống Đơn hàng</h1>
          <p className="text-gray-500 text-sm mt-1">Theo dõi hiệu suất vận hành thời gian thực.</p>
        </div>

        <div className="flex gap-4">
          {/* Success Rate Card */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center min-w-[200px]">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mr-3">
              <ArrowTrendingUpIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-tight">Tỷ lệ thành công</p>
              <p className="text-xl font-bold text-gray-900">{successRate}%</p>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="bg-emerald-600 p-4 rounded-xl shadow-md flex items-center min-w-[240px]">
            <div className="p-2 bg-emerald-500 text-white rounded-lg mr-3">
              <BanknotesIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-tight">Tổng doanh thu</p>
              <p className="text-xl font-bold text-white">
                {statsData.totalRevenue.toLocaleString('vi-VN')}đ
              </p>
            </div>
          </div>
        </div>
      </div>

      <OrderFilter timeRange={timeRange} onTimeChange={setTimeRange} />

      {isLoading ? (
        <div className="h-96 flex flex-col items-center justify-center text-gray-400">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mb-4" />
          <p className="font-medium">Đang xử lý dữ liệu báo cáo...</p>
        </div>
      ) : (
        <div className="space-y-6 mt-6 animate-fade-in">
          {/* Status Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {['pending', 'confirmed', 'delivering', 'completed', 'cancelled'].map((statusId) => {
              const count = getCount(statusId);
              const config = getStatusConfig(statusId);
              return (
                <div
                  key={statusId}
                  className="p-5 rounded-2xl border border-gray-100 shadow-sm bg-white hover:shadow-md transition-shadow cursor-default"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-xl ${config.bgColor} ${config.color}`}>
                      {config.icon}
                    </div>
                    <span className="text-[11px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                      {totalOrders > 0 ? ((count / totalOrders) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs font-semibold">{config.label}</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">{count.toLocaleString()}</p>
                </div>
              );
            })}
          </div>

          {/* Chart Detail Section */}
          <OrderChartDetail data={statsData.trend} timeRange={timeRange} />
        </div>
      )}
    </AdminLayout>
  );
};

export default OrderStatisticsScreen;