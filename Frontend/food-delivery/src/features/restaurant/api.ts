import apiClient from '../../services/apiClient'

import type { MenuItemDto } from './components/FoodItem'
import type { Restaurant } from '../home/components/RestaurantCard'

export async function getMenuItemsByRestaurant(restaurantId: string) {
  const res = await apiClient.get(`/restaurants/${restaurantId}/menu-items`)
  // backend wraps data in { success, message, data: { menuItems } }
  const menuItems = res.data?.data?.menuItems ?? res.data?.menuItems ?? res.data
  return menuItems as MenuItemDto[]
}

export async function getRestaurantById(restaurantId: string): Promise<Restaurant> {
  const res = await apiClient.get(`/restaurants/${restaurantId}`)
  // backend trả về restaurant object trực tiếp hoặc trong data
  const restaurant = res.data?.data ?? res.data
  return restaurant as Restaurant
}

export default { getMenuItemsByRestaurant, getRestaurantById }
