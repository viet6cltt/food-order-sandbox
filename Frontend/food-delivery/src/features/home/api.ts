import api from "../../services/apiClient"

export async function getRestaurants(page = 1, limit = 16) {
  const res = await api.get('/restaurants', { params: { page, limit } })
  // backend trả: { success, data, meta }
  const items = Array.isArray(res.data?.data) ? res.data.data : []
  const meta = res.data?.meta ?? { page, limit, total: items.length }
  return { items, meta }
}