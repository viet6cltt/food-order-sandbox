import api from "../../services/apiClient"

export async function getRestaurants(page = 1, limit = 16) {
  // Nếu apiClient đã có baseURL = '/api' thì path '/restaurants' là đủ.
  // Nếu không, đổi thành '/api/restaurants'.
  const res = await api.get('/restaurants', { params: { page, limit } })
  // backend trả: { success, data, meta }
  const items = Array.isArray(res.data?.data) ? res.data.data : []
  const meta = res.data?.meta ?? { page, limit, total: items.length }
  return { items, meta }
}