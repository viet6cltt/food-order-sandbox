import api from "../../services/apiClient"

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