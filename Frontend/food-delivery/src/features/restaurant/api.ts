import apiClient from '../../services/apiClient'

import type { MenuItemDto } from './components/FoodItem'
import type { Restaurant } from '../home/components/RestaurantCard'

export async function getMenuItemsByRestaurant(restaurantId: string) {
  const res = await apiClient.get(`/restaurants/${restaurantId}/menu-items`)
  // backend wraps data in { success: true, message: '...', data: { menuItems } }
  const menuItems = res.data?.data?.menuItems ?? res.data?.menuItems ?? res.data
  if (!Array.isArray(menuItems)) {
    return []
  }
  return menuItems as MenuItemDto[]
}

export async function getRestaurantById(restaurantId: string): Promise<Restaurant> {
  const res = await apiClient.get(`/restaurants/${restaurantId}`)
  const restaurant = res.data
  if (!restaurant) {
    throw new Error('Restaurant not found')
  }
  const normalized: Restaurant = {
    ...restaurant,
    id: restaurant.id || (restaurant._id ? String(restaurant._id) : restaurantId)
  }
  return normalized
}

export default { getMenuItemsByRestaurant, getRestaurantById }
