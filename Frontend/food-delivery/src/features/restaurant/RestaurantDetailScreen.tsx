import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import FoodList from './components/FoodList'
import { type MenuItemDto } from './components/FoodItem'
import * as foodApi from './api'
import AppLayout from '../../layouts/AppLayout'
import useRestaurant from '../../hooks/useRestaurant'
import RestaurantHeader from './components/RestaurantHeader'
import RestaurantInfo from './components/RestaurantInfo'

const RestaurantDetailScreen: React.FC = () => {
    const params = useParams<{ restaurantId?: string}>()
    const navigate = useNavigate()
    const { restaurantId } = params
    const { restaurant, loading: restaurantLoading, error: restaurantError } = useRestaurant(restaurantId)
  const [foods, setFoods] = useState<MenuItemDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [menuError, setMenuError] = useState<Error | null>(null);

  function handleFoodSelect(item: MenuItemDto) {
    navigate(`/food/${item._id}`)
  }

  useEffect(() => {
    if (!restaurantId) return;

    async function load() {
      setLoading(true);
      setMenuError(null);
      try {
        const menu = await foodApi.getMenuItemsByRestaurant(restaurantId!);
        setFoods(Array.isArray(menu) ? menu : []);
      } catch (err) {
        setMenuError(err instanceof Error ? err : new Error('Failed to load menu items'));
        setFoods([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [restaurantId]);

  if (restaurantLoading) {
    return (
      <AppLayout>
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Đang tải thông tin nhà hàng...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (restaurantError || !restaurant) {
    return (
      <AppLayout>
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <p className="text-red-500">
              {restaurantError?.message || 'Không tìm thấy nhà hàng'}
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <div className='flex flex-row gap-4'>
          <RestaurantHeader data={restaurant} />
          <RestaurantInfo data={restaurant} />
        </div>

        <section className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Menu</h3>
          {loading ? (
            <p className="text-gray-500">Đang tải menu...</p>
          ) : menuError ? (
            <div className="py-6 text-center">
              <p className="text-red-500 mb-2">
                {menuError.message || 'Không thể tải menu'}
              </p>
              {menuError.message?.includes('timeout') && (
                <p className="text-sm text-gray-500">
                  Vui lòng kiểm tra kết nối hoặc thử lại sau
                </p>
              )}
            </div>
          ) : (
            <FoodList items={foods} onSelect={handleFoodSelect} />
          )}
        </section>
      </div>
    </AppLayout>
  );
};

export default RestaurantDetailScreen;