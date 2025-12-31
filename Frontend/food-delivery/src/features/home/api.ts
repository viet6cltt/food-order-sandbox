import api from "../../services/apiClient"
import type { Restaurant } from "./components/RestaurantCard"

export async function getRestaurants(page = 1, limit = 16) {
  const res = await api.get('/restaurants', { params: { page, limit } })
  // backend trả: { success: true, data: items, meta }
  const items = Array.isArray(res.data?.data) ? res.data.data : []
  const meta = res.data?.meta ?? { page, limit, total: items.length }
  // Repository đã map _id thành id, nhưng đảm bảo normalize để an toàn
  const normalizedItems = items.map(item => ({
    ...item,
    id: item.id || (item._id ? String(item._id) : undefined)
  }))
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

  const items = Array.isArray(res.data?.data?.items) ? res.data.data.items : [];
  const meta = res.data?.data?.meta ?? { page, limit, total: items.length };
  
  const normalizedItems = items.map((item: any) => ({
    ...item,
    id: item.id || (item._id ? String(item._id) : undefined)
  }));

  return { items: normalizedItems, meta };
}

export async function getRecommendRestaurants() {
  const res = await api.get('/restaurants/recommend'); // BE trả về 5 item
  const items = Array.isArray(res.data?.data) ? res.data.data : [];
  const normalizedItems = items.map(item => ({
    ...item,
    id: item.id || (item._id ? String(item._id) : undefined),
  }));
  return normalizedItems;
}

export async function getCategories() {
  const res = await api.get('/categories');

  const categories = res.data.data || [];

  console.log(categories);
  
  return categories.filter((category: any) => category.isActive === true);
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