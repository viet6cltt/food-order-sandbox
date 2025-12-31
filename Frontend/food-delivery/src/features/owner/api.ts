import api from "../../services/apiClient";

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
    // Backend trả về null nếu không có pending request
    return res.data?.data || null;
  } catch (error) {
    console.error('Error fetching restaurant request:', error);
    // Nếu lỗi 404 hoặc không có request, trả về null
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

