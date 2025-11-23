import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import FoodList from './components/FoodList'
import { type MenuItemDto } from './components/FoodItem'
import * as foodApi from './api'
import AppLayout from '../../layouts/AppLayout'
import useRestaurant from '../../hooks/useRestaurant'
import RestaurantHeader from './components/RestaurantHeader'
import RestaurantInfo from './components/RestaurantInfo'

const RestaurantDetailScreen: React.FC = () => {
    const params = useParams<{ restaurantId?: string}>()
    const { restaurantId } = params
    const { restaurant, loading: restaurantLoading, error: restaurantError } = useRestaurant(restaurantId)
    const [foods, setFoods] = useState<MenuItemDto[]>([]);
    const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!restaurantId) return;

    async function load() {
      setLoading(true);
      try {
        const menu = await foodApi.getMenuItemsByRestaurant(restaurantId!);
        setFoods(menu);
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
      <div className="max-w-5xl mx-auto px-4 py-6">
        <RestaurantHeader data={restaurant} />
        <RestaurantInfo data={restaurant} />

        <section className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Menu</h3>
          {loading ? (
            <p className="text-gray-500">Đang tải menu...</p>
          ) : (
            <FoodList items={foods} />
          )}
        </section>
      </div>
    </AppLayout>
  );
};

export default RestaurantDetailScreen;