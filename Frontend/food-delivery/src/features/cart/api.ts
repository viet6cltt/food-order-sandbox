import apiClient from '../../services/apiClient'

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
  const res = await apiClient.get('/cart')
  return res.data?.data?.cart ?? res.data?.cart ?? null
}

export async function addItem(payload: AddItemPayload): Promise<Cart> {
  const res = await apiClient.post('/cart/items', payload)
  return res.data?.data?.cart ?? res.data?.cart
}

export async function updateItem(itemId: string, payload: UpdateItemPayload): Promise<Cart> {
  const res = await apiClient.put(`/cart/items/${itemId}`, payload)
  return res.data?.data?.cart ?? res.data?.cart
}

export async function deleteItem(itemId: string): Promise<Cart> {
  const res = await apiClient.delete(`/cart/items/${itemId}`)
  return res.data?.data?.cart ?? res.data?.cart
}

export async function checkout(): Promise<{ order: any }> {
  const res = await apiClient.post('/cart/checkout')
  return res.data?.data ?? res.data
}

