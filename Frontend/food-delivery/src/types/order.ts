export type OrderStatus = 'pending' | 'confirmed' | 'delivering' | 'completed' | 'canceled' | 'refunded' | 'cooking';

export interface OrderItem {
  menuItemId: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface Order {
  _id: string
  restaurantId: string
  restaurantName: string
  items: OrderItem[]
  totalPrice: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
  deliveryAddress?: string
  paymentMethod?: string

  customerName?: string;
}

export interface OrdersResponse {
  orders: Order[]
  total: number
  page: number
  pageSize: number
}