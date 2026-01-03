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
    geo?: {
      type: 'Point';
      coordinates: [number, number];
    };
  };
  phone: string;
  categoriesId: string[];
  banner?: File | null;
  documents?: File[];
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
    geo?: {
      type: 'Point';
      coordinates: [number, number];
    };
  };
  phone: string;
  bannerUrl: string;
  documents: string[];
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

    // BE trả về: { success, message, data: { categories, pagination } }
    // Một số endpoint/phiên bản cũ có thể trả mảng trực tiếp.
    const data =
      (Array.isArray(res.data?.data?.categories) && res.data.data.categories) ||
      (Array.isArray(res.data?.data) && res.data.data) ||
      (Array.isArray(res.data) && res.data) ||
      [];

    // Normalize _id to id - ensure id is always present
    return data.map((category: Category) => ({
      ...category,
      id: category.id || category._id || '',
      name: category.name,
      description: category.description,
      isActive: category.isActive,
    })).filter((cat: NormalizedCategory): cat is NormalizedCategory => !!cat.id && cat.isActive !== false);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export async function getMyRestaurantRequest(): Promise<RestaurantRequestResponse[]> {
  try {
    const res = await api.get('/users/restaurant-requests/me');
    return Array.isArray(res.data?.data) ? res.data.data : [];
  } catch (error) {
    console.error('Error fetching restaurant request:', error);
    return [];
  }
}

export async function submitRestaurantRequest(
  payload: RestaurantRequestPayload,
  banner?: File | null,
  documents?: File[]
) : Promise<RestaurantRequestResponse> {
  const formData = new FormData();

  // 1. Tạo một bản copy của payload nhưng LOẠI BỎ các trường File
  const { banner: _banner, documents: _documents, ...textData } = payload;
  void _banner;
  void _documents;
  formData.append('data', JSON.stringify(textData));

  // 2. lấy file từ parameters
  if (banner) {
    formData.append('banner', banner);
  }

  if (documents && documents.length > 0) {
    documents.forEach((file) => {
      formData.append('documents', file);
    });
  }

  const res = await api.post('/users/restaurant-requests', formData);

  return res.data?.data;
}

export interface Restaurant {
  _id: string;
  id?: string;
  name: string;
  ownerId: string;
  description?: string;
  bannerUrl?: string;
  address: {
    full: string;
    street?: string;
    ward?: string;
    district?: string;
    city?: string;
    geo?: {
      type: 'Point';
      coordinates: [number, number]; // [longitude, latitude]
    };
  };
  phone: string;
  isAcceptingOrders?: boolean;
  opening_time?: string;
  closing_time?: string;
  isActive?: boolean;
  status?: 'ACTIVE' | 'BLOCKED';
  rating?: number;
  reviewCount?: number;
  categoriesId?: string[];
  shippingPolicy?: 'SELF_SHIP' | 'PARTNER_SHIP' | 'HYBRID';
  baseShippingFee?: number;
  shippingPerKm?: number;
  estimatedDeliveryTime?: number;
  paymentInfo?: {
    bankName?: string | null;
    bankAccountNumber?: string | null;
    bankAccountName?: string | null;
    qrImageUrl?: string | null;
  };
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

export async function getMyRestaurants(): Promise<Restaurant[] | null> {
  try {
    const res = await api.get('/users/me/restaurants');
    const data = res.data?.data || [];
    if (!Array.isArray(data)) return [];

    // Normalize id field
    return data.map((itemRaw: unknown) => {
      const item =
        itemRaw && typeof itemRaw === 'object'
          ? (itemRaw as Partial<Restaurant> & Record<string, unknown>)
          : ({} as Partial<Restaurant> & Record<string, unknown>);

      const normalizedId =
        typeof item.id === 'string' && item.id
          ? item.id
          : typeof item._id === 'string' && item._id
            ? item._id
            : '';

      return {
        ...(item as Restaurant),
        _id: typeof item._id === 'string' && item._id ? item._id : normalizedId,
        id: normalizedId,
      };
    });
  } catch (error: unknown) {
    console.error('Error fetching my restaurants:', error);
    return [];
  }
}

export async function getMyRestaurant(restaurantId: string | null): Promise<Restaurant | null> {
  try {
    if (!restaurantId || restaurantId === 'null' || restaurantId === 'undefined') return null;
    const res = await api.get(`/users/me/restaurants/${restaurantId}`);
    const data = res.data?.data || res.data;

    if (!data) return null;

    return {
      ...data,
      id: data.id || data._id || '',
    };
  } catch (error: unknown) {
    console.error(`Error fetching restaurant with ID ${restaurantId}:`, error);
    return null;
  }
}

export type UpdateMyRestaurantPayload = {
  name?: string;
  description?: string;
  phone?: string;
  isAcceptingOrders?: boolean;
  isActive?: boolean;
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

export async function updateMyRestaurant(restaurantId: string, payload: UpdateMyRestaurantPayload): Promise<Restaurant> {
  const res = await api.patch(`/users/me/restaurants/${restaurantId}`, payload);
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

export async function uploadMyRestaurantPaymentQr(restaurantId: string, file: File): Promise<Restaurant> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await api.patch(`/users/me/restaurant/${restaurantId}/payment-qr`, formData, {
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

    console.log(data);
    
    const ordersArray = Array.isArray(ordersData.orders) 
      ? ordersData.orders 
      : Array.isArray(ordersData) 
        ? ordersData 
        : [];
    
    console.log('Fetched orders:', res);

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


