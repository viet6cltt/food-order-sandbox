export type OrderStatus = 'draft' | 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'completed' | 'cancelled' | 'refunded' | 'cooking';

export interface OrderItem {
  menuItemId: string
  name: string
  imageUrl?: string
  quantity: number
  finalPrice: number
  selectedOptions?: Array<{
    groupName: string
    optionName: string
    price: number
  }>
}

export interface Order {
  _id: string
  userId: string
  restaurantId: string
  items: OrderItem[]
  totalFoodPrice: number
  shippingFee?: number
  discountAmount?: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
  deliveryAddress?: {
    full: string
    lat: number
    lng: number
  }
  paymentMethod?: 'COD' | 'BANK_TRANSFER'
  paymentId?: string
  isPaid?: boolean
  paidAt?: string
  note?: string
}

export interface OrdersResponse {
  orders: Order[]
  total: number
  page: number
  pageSize: number
}