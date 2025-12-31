import api from "../../services/apiClient";
import type { Order } from "../../types/order";

export interface Category {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface RestaurantRequestPayload {
  restaurantName: string;
  description?: string;
  address: {
    full: string;
    street?: string;
    ward?: string;
    district?: string;
    city?: string;
  };
  phone: string;
  categoriesId: string[];
}

export interface RestaurantRequestResponse {
  _id: string;
  userId: string;
  restaurantName: string;
  description?: string;
  address: {
    full: string;
    street?: string;
    ward?: string;
    district?: string;
    city?: string;
  };
  phone: string;
  categoriesId: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface NormalizedCategory {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

export async function getCategories(page = 1, limit = 100): Promise<NormalizedCategory[]> {
  try {
    const res = await api.get('/categories', { params: { page, limit } });
    // Handle both direct array response and wrapped response
    let data = res.data?.data;
    if (!data && Array.isArray(res.data)) {
      data = res.data;
    }
    if (!Array.isArray(data)) {
      data = [];
    }
    // Normalize _id to id - ensure id is always present
    return data.map((category: Category) => ({
      ...category,
      id: category.id || category._id || '',
      name: category.name,
      description: category.description,
      isActive: category.isActive,
    })).filter((cat: NormalizedCategory): cat is NormalizedCategory => !!cat.id);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export async function getMyRestaurantRequest(): Promise<RestaurantRequestResponse | null> {
  try {
    const res = await api.get('/users/restaurant-requests/me');
    return res.data?.data || null;
  } catch (error) {
    console.error('Error fetching restaurant request:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 404) {
        return null;
      }
    }
    throw error;
  }
}

export async function submitRestaurantRequest(payload: RestaurantRequestPayload): Promise<RestaurantRequestResponse> {
  try {
    const res = await api.post('/users/restaurant-requests', payload);
    return res.data?.data;
  } catch (error) {
    console.error('Error submitting restaurant request:', error);
    throw error;
  }
}

export interface Restaurant {
  _id: string;
  id?: string;
  name: string;
  ownerId: string;
  description?: string;
  address: {
    full: string;
    street?: string;
    ward?: string;
    district?: string;
    city?: string;
  };
  phone: string;
  bannerUrl?: string;
  isAcceptingOrders?: boolean;
  opening_time?: string;
  closing_time?: string;
  openingHours?: Array<{ day: number; open: string; close: string; isClosed: boolean }>;
  paymentInfo?: {
    bankName?: string | null;
    bankAccountNumber?: string | null;
    bankAccountName?: string | null;
    qrImageUrl?: string | null;
  };
  isActive?: boolean;
  rating?: number;
  reviewCount?: number;
  categoriesId?: string[];
  shippingPolicy?: string;
  baseShippingFee?: number;
  shippingPerKm?: number;
  estimatedDeliveryTime?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RestaurantOrdersResponse {
  orders: Order[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetRestaurantOrdersOptions {
  page?: number;
  limit?: number;
  status?: string;
  from?: string;
  to?: string;
}

export async function getMyRestaurant(): Promise<Restaurant | null> {
  try {
    const res = await api.get('/users/owner/restaurant');
    const restaurant = res.data?.data || res.data;
    if (!restaurant) {
      return null;
    }
    // Normalize id field
    return {
      ...restaurant,
      id: restaurant.id || restaurant._id || '',
    };
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 404) {
        return null;
      }
    }
    console.error('Error fetching my restaurant:', error);
    throw error;
  }
}

export type UpdateMyRestaurantPayload = {
  name?: string;
  description?: string;
  phone?: string;
  address?: {
    full?: string;
    street?: string;
    ward?: string;
    district?: string;
    city?: string;
  };
  categoriesId?: string[];
  opening_time?: string;
  closing_time?: string;
  openingHours?: Array<{ day: number; open: string; close: string; isClosed: boolean }>;
  paymentInfo?: {
    bankName?: string | null;
    bankAccountNumber?: string | null;
    bankAccountName?: string | null;
    qrImageUrl?: string | null;
  };
};

export async function updateMyRestaurant(payload: UpdateMyRestaurantPayload): Promise<Restaurant> {
  const res = await api.patch('/users/owner/restaurant', payload);
  const restaurant = res.data?.data || res.data;
  return {
    ...restaurant,
    id: restaurant.id || restaurant._id || '',
  };
}

export async function uploadRestaurantBanner(restaurantId: string, file: File): Promise<Restaurant> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await api.patch(`/restaurants/${restaurantId}/banner`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  const restaurant = res.data?.data || res.data;
  return {
    ...restaurant,
    id: restaurant.id || restaurant._id || '',
  };
}

export async function uploadMyRestaurantPaymentQr(file: File): Promise<Restaurant> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await api.patch('/users/owner/restaurant/payment-qr', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  const restaurant = res.data?.data || res.data;
  return {
    ...restaurant,
    id: restaurant.id || restaurant._id || '',
  };
}

export async function getRestaurantOrders(
  restaurantId: string,
  options: GetRestaurantOrdersOptions = {}
): Promise<RestaurantOrdersResponse> {
  try {
    const { page = 1, limit = 10, status, from, to } = options;
    const res = await api.get(`/restaurants/${restaurantId}/orders`, {
      params: { page, limit, status, from, to },
    });
    const data = res.data?.data || {};
    const ordersData = data.orders || {};
    
    const ordersArray = Array.isArray(ordersData.orders) 
      ? ordersData.orders 
      : Array.isArray(ordersData) 
        ? ordersData 
        : [];
    
    return {
      orders: ordersArray,
      pagination: ordersData.pagination || data.pagination,
    };
  } catch (error) {
    console.error('Error fetching restaurant orders:', error);
    throw error;
  }
}

export interface OrderResponse {
  order: {
    _id: string;
    status: string;
    [key: string]: unknown;
  };
}

export async function confirmOrder(restaurantId: string, orderId: string): Promise<OrderResponse> {
  try {
    const res = await api.patch(`/restaurants/${restaurantId}/orders/${orderId}/confirm`);
    return res.data?.data || res.data;
  } catch (error) {
    console.error('Error confirming order:', error);
    throw error;
  }
}

export async function prepareOrder(restaurantId: string, orderId: string): Promise<OrderResponse> {
  try {
    const res = await api.patch(`/restaurants/${restaurantId}/orders/${orderId}/prepare`);
    return res.data?.data || res.data;
  } catch (error) {
    console.error('Error preparing order:', error);
    throw error;
  }
}

export async function deliverOrder(restaurantId: string, orderId: string): Promise<OrderResponse> {
  try {
    const res = await api.patch(`/restaurants/${restaurantId}/orders/${orderId}/deliver`);
    return res.data?.data || res.data;
  } catch (error) {
    console.error('Error delivering order:', error);
    throw error;
  }
}

export async function cancelOrderByRestaurant(restaurantId: string, orderId: string): Promise<OrderResponse> {
  try {
    const res = await api.patch(`/restaurants/${restaurantId}/orders/${orderId}/cancel`);
    return res.data?.data || res.data;
  } catch (error) {
    console.error('Error canceling order:', error);
    throw error;
  }
}

export async function completeOrder(restaurantId: string, orderId: string): Promise<OrderResponse> {
  try {
    const res = await api.patch(`/restaurants/${restaurantId}/orders/${orderId}/complete`);
    return res.data?.data || res.data;
  } catch (error) {
    console.error('Error completing order:', error);
    throw error;
  }
}

export interface DayRevenueResponse {
  data: {
    totalRevenue?: number;
    orderCount?: number;
  }[];
}

function normalizeDataArray<T>(payload: unknown): T[] {
  // Supports:
  // - { success: true, data: [...] }
  // - { success: true, data: { data: [...] } }
  // - { data: [...] }
  // - [...]
  const maybe = (payload as { data?: unknown })?.data ?? payload;
  if (Array.isArray(maybe)) return maybe as T[];
  if (Array.isArray((maybe as { data?: unknown })?.data)) return (maybe as { data: T[] }).data;
  return [];
}

export async function getDayRevenue(restaurantId: string, date?: string): Promise<DayRevenueResponse> {
  try {
    const params = date ? { date } : {};
    const res = await api.get(`/restaurants/${restaurantId}/revenue/day`, { params });
    return { data: normalizeDataArray<DayRevenueResponse['data'][number]>(res.data) };
  } catch (error) {
    console.error('Error fetching day revenue:', error);
    throw error;
  }
}

export interface TotalRevenueResponse {
  data: {
    totalRevenue?: number;
    totalOrders?: number;
  }[];
}

export async function getTotalRevenue(restaurantId: string): Promise<TotalRevenueResponse> {
  try {
    const res = await api.get(`/restaurants/${restaurantId}/revenue/total`);
    return { data: normalizeDataArray<TotalRevenueResponse['data'][number]>(res.data) };
  } catch (error) {
    console.error('Error fetching total revenue:', error);
    throw error;
  }
}

export interface WeekRevenueDay {
  _id: number; // day of week (1-7, where 1 is Sunday in MongoDB)
  dailyRevenue: number;
  orderCount: number;
}

export interface WeekRevenueResponse {
  data: WeekRevenueDay[];
}

export async function getWeekRevenue(restaurantId: string, weekStart: string): Promise<WeekRevenueResponse> {
  try {
    const res = await api.get(`/restaurants/${restaurantId}/revenue/week`, {
      params: { weekStart },
    });
    return { data: normalizeDataArray<WeekRevenueDay>(res.data) };
  } catch (error) {
    console.error('Error fetching week revenue:', error);
    throw error;
  }
}


