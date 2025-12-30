import apiClient from '../../services/apiClient'
import type { Order } from '../../types/order'

// Re-export Order type for convenience
export type { Order }

export type CartItem = {
  _id: string
  menuItemId: string
  name: string
  imageUrl?: string
  basePrice: number
  qty: number
  selectedOptions: Array<{
    groupName: string
    optionName: string
    price: number
  }>
  finalPrice: number
}

export type Cart = {
  _id: string
  userId: string
  restaurantId: string
  items: CartItem[]
  totalItems: number
  totalPrice: number
  createdAt?: string
  updatedAt?: string
}

export type AddItemPayload = {
  restaurantId: string
  menuItemId: string
  name: string
  imageUrl?: string
  basePrice: number
  qty: number
  selectedOptions?: Array<{
    groupName: string
    optionName: string
    price: number
  }>
}

export type UpdateItemPayload = {
  qty?: number
  selectedOptions?: Array<{
    groupName: string
    optionName: string
    price: number
  }>
}

export async function getCart(): Promise<Cart | null> {
  const res = await apiClient.get('/carts')
  return res.data?.data?.cart ?? res.data?.cart ?? null
}

export async function addItem(payload: AddItemPayload): Promise<Cart> {
  const res = await apiClient.post('/carts/items', payload)
  const cart = res.data?.data?.cart ?? res.data?.cart
  if (!cart) {
    throw new Error('Failed to add item to cart')
  }
  return cart
}

export async function updateItem(itemId: string, payload: UpdateItemPayload): Promise<Cart> {
  const res = await apiClient.put(`/carts/items/${itemId}`, payload)
  const cart = res.data?.data?.cart ?? res.data?.cart
  if (!cart) {
    throw new Error('Failed to update cart item')
  }
  return cart
}

export async function deleteItem(itemId: string): Promise<Cart> {
  const res = await apiClient.delete(`/carts/items/${itemId}`)
  const cart = res.data?.data?.cart ?? res.data?.cart
  if (!cart) {
    throw new Error('Failed to delete cart item')
  }
  return cart
}

export async function checkout(): Promise<Order> {
  const res = await apiClient.post('/carts/checkout')
  const order = res.data?.data?.order ?? res.data?.order
  if (!order) {
    throw new Error('Failed to checkout')
  }
  return order as Order
}

