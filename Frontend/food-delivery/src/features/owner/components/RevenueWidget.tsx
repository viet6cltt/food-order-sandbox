// src/features/owner/components/RevenueWidget.tsx
import React, { useEffect, useState } from 'react';
import { BanknotesIcon } from '@heroicons/react/24/solid';
import { getTotalRevenue, getWeekRevenue, type Restaurant } from '../api';

interface RevenueWidgetProps {
  restaurant: Restaurant | null;
}

// Format date to YYYY-MM-DD
const formatDate = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// Calculate end date (start + 7 days)
const getWeekEndDate = (weekStart: string): string => {
  const start = new Date(weekStart);
  const end = new Date(start);
  // Display an inclusive 7-day range: start .. start+6
  end.setDate(end.getDate() + 6);
  return formatDate(end);
};

const RevenueWidget: React.FC<RevenueWidgetProps> = ({ restaurant }) => {
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [weekRevenue, setWeekRevenue] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [currentWeekStart, setCurrentWeekStart] = useState<string>(formatDate(new Date()));
  const [loadingWeek, setLoadingWeek] = useState(false);

  // Fetch total revenue on mount
  useEffect(() => {
    if (!restaurant) {
      return;
    }

    const restaurantId = restaurant._id || restaurant.id;
    if (!restaurantId) {
      return;
    }

    const fetchTotalRevenue = async () => {
      try {
        const totalRevenueRes = await getTotalRevenue(restaurantId);

        // Parse total revenue response
        const totalData = totalRevenueRes.data?.[0];
        const totalRev = totalData?.totalRevenue || 0;
        setTotalRevenue(totalRev);
      } catch (error) {
        console.error('Error fetching total revenue:', error);
        setTotalRevenue(0);
      }
    };

    fetchTotalRevenue();
  }, [restaurant]);

  // Fetch week revenue on mount with today's date as weekStart
  useEffect(() => {
    if (!restaurant) return;

    const restaurantId = restaurant._id || restaurant.id;
    if (!restaurantId) return;

    const fetchWeekRevenue = async () => {
      try {
        setLoadingWeek(true);
        const weekStart = currentWeekStart;
        const weekRevenueRes = await getWeekRevenue(restaurantId, weekStart);
        
        // Calculate total week revenue from daily data
        const weekData = weekRevenueRes.data ?? [];
        const totalWeekRev = weekData.reduce((sum: number, day: { dailyRevenue: number }) => {
          return sum + (day.dailyRevenue || 0);
        }, 0);
        
        setWeekRevenue(totalWeekRev);
      } catch (error) {
        console.error('Error fetching week revenue:', error);
        setWeekRevenue(0);
      } finally {
        setLoadingWeek(false);
      }
    };

    fetchWeekRevenue();
  }, [restaurant, currentWeekStart]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleApplyDate = () => {
    // Use selected date directly as weekStart (no calculation needed)
    setCurrentWeekStart(selectedDate);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">Doanh thu tuần</p>
          {loadingWeek ? (
            <p className="text-3xl font-bold text-gray-900 mt-1">...</p>
          ) : (
            <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(weekRevenue)}</p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            Tổng doanh thu: <span className="font-semibold text-gray-700">{formatCurrency(totalRevenue)}</span>
          </p>
        </div>
        <div className="p-4 bg-green-50 rounded-full">
          <BanknotesIcon className="w-8 h-8 text-green-600" />
        </div>
      </div>

      {/* Date picker and apply button */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="mb-3">
          <label htmlFor="revenue-date" className="block text-sm font-medium text-gray-700 mb-2">
            Chọn ngày bắt đầu
          </label>
          <div className="flex gap-2">
            <input
              id="revenue-date"
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <button
              onClick={handleApplyDate}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
            >
              Áp dụng
            </button>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 mt-2">
            Tuần: {currentWeekStart} đến {getWeekEndDate(currentWeekStart)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevenueWidget;