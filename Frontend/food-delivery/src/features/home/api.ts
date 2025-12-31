import api from "../../services/apiClient"
import type { Restaurant } from "./components/RestaurantCard"

export interface Category {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  isActive?: boolean;
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
    let data = res.data?.data;
    if (!data && Array.isArray(res.data)) {
      data = res.data;
    }
    if (!Array.isArray(data)) {
      data = [];
    }
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

export async function getRestaurants(page = 1, limit = 16) {
  const res = await api.get('/restaurants', { params: { page, limit } })
  // backend trả: { success: true, data: items, meta }
  const items = Array.isArray(res.data?.data) ? res.data.data : []
  const meta = res.data?.meta ?? { page, limit, total: items.length }
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
  const res = await api.get('/restaurants', { params: { page, limit } })
  const items = Array.isArray(res.data?.data) ? res.data.data : []
  const meta = res.data?.meta ?? { page, limit, total: items.length }
  
  // Filter restaurants by categoryId
  const filteredItems = items.filter((item: unknown) => {
    const restaurant = item as { categoriesId?: (string | { _id?: string })[] }
    const categoriesId = restaurant.categoriesId || []
    return categoriesId.some((catId: string | { _id?: string }) => {
      if (typeof catId === 'string') {
        return String(catId) === String(categoryId)
      }
      if (typeof catId === 'object' && catId !== null && '_id' in catId) {
        return String(catId._id) === String(categoryId)
      }
      return false
    })
  })
  
  const normalizedItems = filteredItems.map((item: unknown) => {
    const restaurant = item as Partial<Restaurant> & { _id?: string | { $oid?: string } }
    return {
      ...restaurant,
      id: restaurant.id || (restaurant._id ? String(restaurant._id) : undefined)
    }
  })
  return { items: normalizedItems, meta: { ...meta, total: filteredItems.length } }
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
