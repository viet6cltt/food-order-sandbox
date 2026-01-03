// src/features/owner/components/RevenueWidget.tsx
import React, { useEffect, useState } from 'react';
import { BanknotesIcon } from '@heroicons/react/24/solid';
import { getDayRevenue, getTotalRevenue, getWeekRevenue, type Restaurant } from '../api';

interface RevenueWidgetProps {
  restaurant: Restaurant | null;
  reloadKey?: number;
}

// Format date to YYYY-MM-DD (local)
const formatDate = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// Monday as week start (vi-VN common)
const getWeekStartMonday = (today: Date): string => {
  const d = new Date(today);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0=Sun..6=Sat
  const diff = (day + 6) % 7; // 0 for Monday
  d.setDate(d.getDate() - diff);
  return formatDate(d);
};

const RevenueWidget: React.FC<RevenueWidgetProps> = ({ restaurant, reloadKey }) => {
  const [dayRevenue, setDayRevenue] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [weekRevenue, setWeekRevenue] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurant) {
      setLoading(false);
      return;
    }

    const restaurantId = restaurant._id || restaurant.id;
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        setLoading(true);
        const today = new Date();
        const weekStart = getWeekStartMonday(today);

        const [dayRes, weekRes, totalRes] = await Promise.all([
          getDayRevenue(restaurantId),
          getWeekRevenue(restaurantId, weekStart),
          getTotalRevenue(restaurantId),
        ]);

        const dayData = dayRes.data?.[0];
        setDayRevenue(dayData?.totalRevenue || 0);

        const weekData = weekRes.data ?? [];
        const totalWeekRev = weekData.reduce((sum: number, day: { dailyRevenue: number }) => sum + (day.dailyRevenue || 0), 0);
        setWeekRevenue(totalWeekRev);

        const totalData = totalRes.data?.[0];
        setTotalRevenue(totalData?.totalRevenue || 0);
      } catch (error) {
        console.error('Error fetching revenue:', error);
        setDayRevenue(0);
        setWeekRevenue(0);
        setTotalRevenue(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [restaurant, reloadKey]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">Doanh thu</p>
          {loading ? (
            <p className="text-3xl font-bold text-gray-900 mt-1">...</p>
          ) : (
            <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(dayRevenue)}</p>
          )}
          <p className="text-xs text-gray-400 mt-2">Hôm nay</p>
        </div>
        <div className="p-4 bg-green-50 rounded-full">
          <BanknotesIcon className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <p className="text-sm font-medium text-gray-600">Doanh thu tuần</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{loading ? '...' : formatCurrency(weekRevenue)}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{loading ? '...' : formatCurrency(totalRevenue)}</p>
        </div>
      </div>
    </div>
  );
};

export default RevenueWidget;