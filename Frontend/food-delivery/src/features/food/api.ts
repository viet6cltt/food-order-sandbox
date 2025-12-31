import apiClient from '../../services/apiClient'
import type { MenuItemDto } from '../restaurant/components/FoodItem'

export async function getMenuItemById(menuItemId: string): Promise<MenuItemDto> {
  const res = await apiClient.get(`/menu-items/${menuItemId}`)
  const menuItem = res.data?.data?.menuItem ?? res.data?.menuItem ?? res.data
  if (!menuItem) {
    throw new Error('Menu item not found')
  }
  return menuItem as MenuItemDto
}

export type Review = {
  _id: string
  userId: string
  userName?: string
  menuItemId: string
  rating: number
  comment?: string
  createdAt?: string
  updatedAt?: string
}

export type CreateReviewPayload = {
  menuItemId: string
  rating: number
  comment?: string
}

export async function getReviews(menuItemId: string): Promise<Review[]> {
  const res = await apiClient.get(`/menu-items/${menuItemId}/reviews`)
  const reviews = res.data?.data?.reviews ?? res.data?.reviews ?? res.data
  if (!Array.isArray(reviews)) {
    return []
  }
  return reviews as Review[]
}

export async function createReview(payload: CreateReviewPayload): Promise<Review> {
  const res = await apiClient.post(`/menu-items/${payload.menuItemId}/reviews`, payload)
  return res.data?.data?.review ?? res.data?.review ?? res.data
}

