import api from "../../services/apiClient"
import type { Restaurant } from "./components/RestaurantCard"

export interface Category {
  _id: string;
  id?: string;
  name: string;
  imageUrl?: string;
  description?: string;
  isActive?: boolean;
}

export interface NormalizedCategory {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
  isActive?: boolean;
}

// export async function getCategories(page = 1, limit = 100): Promise<NormalizedCategory[]> {
//   try {
//     const res = await api.get('/categories', { params: { page, limit } });
//     let data = res.data?.data;
//     if (!data && Array.isArray(res.data)) {
//       data = res.data;
//     }
//     if (!Array.isArray(data)) {
//       data = [];
//     }
//     return data.map((category: Category) => ({
//       ...category,
//       id: category.id || category._id || '',
//       name: category.name,
//       description: category.description,
//       isActive: category.isActive,
//     })).filter((cat: NormalizedCategory): cat is NormalizedCategory => !!cat.id && cat.isActive !== false);
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     throw error;
//   }
// }

export async function getRestaurants(page = 1, limit = 16) {
  const res = await api.get('/restaurants', { params: { page, limit } })
  // backend hiện trả: { success: true, message, data: { items, meta } }
  // nhưng vẫn support shape cũ: { success: true, data: items, meta }
  const items = Array.isArray(res.data?.data?.items)
    ? res.data.data.items
    : Array.isArray(res.data?.data)
      ? res.data.data
      : []

  const meta = res.data?.data?.meta ?? res.data?.meta ?? { page, limit, total: items.length }
  // Repository đã map _id thành id, nhưng đảm bảo normalize để an toàn
  const normalizedItems = items.map((item: unknown) => {
    const restaurant = item as Partial<Restaurant> & { _id?: string | { $oid?: string } }
    return {
      ...restaurant,
      id: restaurant.id || (restaurant._id ? String(restaurant._id) : undefined)
    }
  })
  return { items: normalizedItems, meta }
}

export async function getRestaurantsByCategory(categoryId: string, page = 1, limit = 16) {
  // Gửi categoryId như một query parameter
  const res = await api.get('/restaurants', { 
    params: { 
      categoryId, 
      page, 
      limit,
      sortBy: 'rating' 
    } 
  });

  const items: unknown[] = Array.isArray(res.data?.data?.items) ? res.data.data.items : [];
  const meta = res.data?.data?.meta ?? { page, limit, total: items.length };
  
  const normalizedItems = items.map((item: unknown) => {
    const restaurant = item as Partial<Restaurant> & { _id?: string | { $oid?: string } }
    return {
      ...restaurant,
      id: restaurant.id || (restaurant._id ? String(restaurant._id) : undefined),
    }
  })

  return { items: normalizedItems, meta };
}

export async function getRecommendRestaurants() {
  const res = await api.get('/restaurants/recommend'); // BE trả về 5 item
  const items: unknown[] = Array.isArray(res.data?.data) ? res.data.data : [];
  const normalizedItems = items.map((item: unknown) => {
    const restaurant = item as Partial<Restaurant> & { _id?: string | { $oid?: string } }
    return {
      ...restaurant,
      id: restaurant.id || (restaurant._id ? String(restaurant._id) : undefined),
    }
  })
  return normalizedItems;
}

export async function getCategories(page = 1, limit = 12): Promise<NormalizedCategory[]> {
  const res = await api.get('/categories/', { params: { page, limit } });

  const raw =
    (Array.isArray(res.data?.data?.categories) && res.data.data.categories) ||
    (Array.isArray(res.data?.data) && res.data.data) ||
    (Array.isArray(res.data) && res.data) ||
    [];

  const normalized = raw
    .map((category: Category) => {
      const c = category as Category & { _id?: unknown; id?: unknown } & { _id?: { $oid?: string } };
      const normalizedId =
        typeof c.id === 'string' && c.id
          ? c.id
          : typeof c._id === 'string' && c._id
            ? c._id
            : typeof (c as { _id?: { $oid?: string } })._id?.$oid === 'string'
              ? String((c as { _id?: { $oid?: string } })._id?.$oid)
              : '';

      return {
        ...category,
        id: normalizedId,
        name: category.name,
        imageUrl: category.imageUrl,
        description: category.description,
        isActive: category.isActive,
      };
    })
    .filter((cat: NormalizedCategory) => !!cat.id && cat.isActive === true);

  return normalized;
}

export async function searchRestaurants(keyword: string, options?: { lat?: number; lng?: number; page?: number; limit?: number }): Promise<Restaurant[]> {
  if (!keyword || !keyword.trim()) {
    return []
  }

  const params: Record<string, string | number> = {
    keyword: keyword.trim(),
  }


  if (options?.lat !== undefined && !isNaN(options.lat)) {
    params.lat = options.lat
  }
  if (options?.lng !== undefined && !isNaN(options.lng)) {
    params.lng = options.lng
  }
  
  if (options?.page) params.page = options.page
  if (options?.limit) params.limit = options.limit

  try {
    const res = await api.get('/restaurants/search', { params })
    

    const data = res.data?.data ?? []
    
    if (!Array.isArray(data)) {
      return []
    }

    // Normalize restaurant data
    const normalizedItems: Restaurant[] = data.map((item: unknown) => {
      const restaurant = item as Partial<Restaurant> & { _id?: string | { $oid?: string }; address?: { full?: string } | string }
      return {
        ...restaurant,
        id: restaurant.id || (restaurant._id ? String(restaurant._id) : undefined),
        address: typeof restaurant.address === 'object' && restaurant.address !== null && 'full' in restaurant.address
          ? restaurant.address.full || ''
          : typeof restaurant.address === 'string' ? restaurant.address : '',
        rating: restaurant.rating ?? 0,
      } as Restaurant
    })

    return normalizedItems
  } catch (error) {
    console.error('Error searching restaurants:', error)
    return []
  }
}
