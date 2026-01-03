import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OwnerLayout from '../../../layouts/OwnerLayout';
import RestaurantList from '../components/RestaurantList';
import { getMyRestaurants, type Restaurant } from '../api';
import { toast } from 'react-toastify';

const OwnerRestaurantListScreen: React.FC = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setLoading(true);
        const data = await getMyRestaurants();
        setRestaurants(data || []);
      } catch (error) {
        console.error('Error loading restaurants:', error);
        toast.error('Lỗi khi tải danh sách nhà hàng');
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  return (
    <OwnerLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quán của tôi</h1>
              <p className="text-gray-500 mt-1">Quản lý thông tin và menu của nhà hàng</p>
            </div>

            <button
              onClick={() => navigate('/owner/register')}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              + Đăng ký quán mới
            </button>
          </div>

          {/* Restaurant List */}
          <RestaurantList restaurants={restaurants} isLoading={loading} />
        </div>
      </div>
    </OwnerLayout>
  );
};

export default OwnerRestaurantListScreen;
