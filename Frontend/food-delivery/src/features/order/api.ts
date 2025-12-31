import apiClient from '../../services/apiClient';
import type { Order } from '../../types/order';

export type UpdateOrderInfoPayload = {
  deliveryAddress: {
    full: string;
    lat: number;
    lng: number;
  };
  paymentMethod: 'COD' | 'BANK_TRANSFER';
};

/**
 * Get order by ID
 */
export async function getOrder(orderId: string): Promise<Order> {
  const res = await apiClient.get(`/orders/${orderId}`);
  const order = res.data?.data?.order ?? res.data?.order;
  
  // Normalize _id field
  if (order) {
    order._id = order._id || order.id || orderId;
  }
  
  return order as Order;
}

/**
 * Update order info (delivery address and payment method)
 */
export async function updateOrderInfo(orderId: string, payload: UpdateOrderInfoPayload): Promise<Order> {
  const res = await apiClient.patch(`/orders/${orderId}`, payload);
  const order = res.data?.data?.order ?? res.data?.order;
  
  // Normalize _id field
  if (order) {
    order._id = order._id || order.id || orderId;
  }
  
  return order as Order;
}

/**
 * Get all orders of current user
 */
export async function getOrdersOfUser(): Promise<Order[]> {
  const res = await apiClient.get('/orders');
  const orders = res.data?.data?.orders ?? res.data?.orders ?? [];
  
  // Normalize _id fields
  return orders.map((order: Order & { id?: string }) => ({
    ...order,
    _id: order._id || order.id || '',
  })) as Order[];
}

/**
 * Cancel order
 */
export async function cancelOrder(orderId: string): Promise<Order> {
  const res = await apiClient.post(`/orders/${orderId}/cancel`);
  const order = res.data?.data?.order ?? res.data?.order;
  
  if (order) {
    order._id = order._id || order.id || orderId;
  }
  
  return order as Order;
}

