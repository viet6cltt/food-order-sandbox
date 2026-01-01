import React, { useEffect, useState, useRef } from 'react';
import RestaurantCard, { type Restaurant } from './RestaurantCard';
import { getRecommendRestaurants } from '../api';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const RecommendList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchRecommend = async () => {
    setLoading(true);
    try {
      const items = await getRecommendRestaurants();
      setRestaurants(items);
    } catch {
      setError('Không thể tải danh sách gợi ý.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommend();
  }, []);

  // Hàm scroll tay cho mượt
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (loading) return <RecommendSkeleton />;

  if (error) return <div className="py-10 text-center text-red-500 font-medium">{error}</div>;

  return (
    <div className="group relative w-full py-4">
      {/* Nút điều hướng Trái - Chỉ hiện khi hover vào vùng list */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"
      >
        <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
      </button>

      {/* Container cuộn */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-6 pb-6 px-1 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {restaurants.map((res) => (
          <div
            key={res.id}
            className="w-64 h-72 flex-shrink-0 snap-start transform transition-transform hover:scale-[1.02]"
          >
            <RestaurantCard restaurant={res} className="h-full" />
          </div>
        ))}
      </div>

      {/* Nút điều hướng Phải */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"
      >
        <ChevronRightIcon className="h-6 w-6 text-gray-700" />
      </button>
    </div>
  );
};

// --- Component Skeleton để hiển thị lúc đang load ---
const RecommendSkeleton = () => (
  <div className="flex space-x-6 overflow-hidden py-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="w-64 h-72 flex-shrink-0 animate-pulse">
        <div className="bg-gray-200 h-40 rounded-2xl mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    ))}
  </div>
);

export default RecommendList;