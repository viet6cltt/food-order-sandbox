import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Restaurant } from '../api';

interface RestaurantListProps {
  restaurants: Restaurant[];
  isLoading?: boolean;
}

const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants, isLoading = false }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Đang tải nhà hàng...</div>
      </div>
    );
  }

  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-500 mb-4">Chưa có nhà hàng nào</p>
        <button
          onClick={() => navigate('/owner/register')}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Đăng ký nhà hàng
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant) => (
        <div
          key={restaurant._id || restaurant.id}
          className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow clickable"
          onClick={() => navigate(`/owner/${restaurant._id || restaurant.id}/dashboard`)}
        >
          {/* Banner */}
          <div className="relative h-40 bg-gray-200">
            {restaurant.bannerUrl ? (
              <img
                src={restaurant.bannerUrl}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-50">
                <span className="text-emerald-400 text-4xl font-bold">
                  {restaurant.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {restaurant.status && (
              <div className="absolute top-2 right-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                    restaurant.status === 'ACTIVE'
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                >
                  {restaurant.status === 'ACTIVE' ? 'Hoạt động' : 'Bị khóa'}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Name */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
              {restaurant.name}
            </h3>

            {/* Rating */}
            {restaurant.rating !== undefined && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900">
                    {restaurant.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({restaurant.reviewCount || 0} đánh giá)
                </span>
              </div>
            )}

            {/* Address */}
            {restaurant.address && (
              <div className="flex gap-2 mb-2">
                
                <p className="text-sm text-gray-600 line-clamp-2">
                  {restaurant.address.full}
                </p>
              </div>
            )}

            {/* Phone */}
            {restaurant.phone && (
              <div className="flex gap-2 mb-4">
                
                <p className="text-sm text-gray-600">{restaurant.phone}</p>
              </div>
            )}

            {/* Description */}
            {restaurant.description && (
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {restaurant.description}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <button
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors font-medium text-sm"
              >
                
                Thiết lập
              </button>
              <button
                onClick={() => navigate(`/owner/menu-list?restaurantId=${restaurant._id || restaurant.id}`)}
                className="flex-1 px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                Menu
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RestaurantList;
