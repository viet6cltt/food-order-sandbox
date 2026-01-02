import type React from 'react'
import { useState, useMemo, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../layouts/AppLayout'
import OrderItem from './components/OrderItem'
import * as orderApi from './api'
import * as restaurantApi from '../restaurant/api'
import type { OrderStatus, Order } from '../../types/order'
import { toast } from 'react-toastify'

type Status = 'all' | 'delivering' | 'completed' | 'cancelled' | 'pending' | 'confirmed'

const OrderListScreen: React.FC<{ className?: string }> = ({ className = '' }) => {
  const navigate = useNavigate()
  const [status, setStatus] = useState<Status>('all')
  const [page, setPage] = useState(1)
  const [orders, setOrders] = useState<Order[]>([])
  const [restaurantNames, setRestaurantNames] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pageSize = 10

  // Load orders and restaurant names
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch orders
      const ordersData = await orderApi.getOrdersOfUser()
      // Sort by updatedAt descending (newest first) to ensure correct order
      const sortedOrders = [...ordersData].sort((a, b) => {
        const dateA = new Date(a.updatedAt).getTime()
        const dateB = new Date(b.updatedAt).getTime()
        return dateB - dateA // Descending order (newest first)
      })
      setOrders(sortedOrders)

      // Extract unique restaurant IDs
      const uniqueRestaurantIds = Array.from(
        new Set(ordersData.map((order) => order.restaurantId).filter(Boolean))
      )

      // Fetch restaurant names in parallel
      const restaurantNamePromises = uniqueRestaurantIds.map(async (restaurantId) => {
        try {
          const restaurant = await restaurantApi.getRestaurantById(restaurantId)
          return { restaurantId, name: restaurant.name }
        } catch (err) {
          console.error(`Failed to load restaurant ${restaurantId}:`, err)
          return { restaurantId, name: 'Nhà hàng không xác định' }
        }
      })

      const restaurantNameResults = await Promise.all(restaurantNamePromises)
      const restaurantNameMap: Record<string, string> = {}
      restaurantNameResults.forEach(({ restaurantId, name }) => {
        restaurantNameMap[restaurantId] = name
      })
      setRestaurantNames(restaurantNameMap)
    } catch (err: unknown) {
      let errorMessage = 'Không thể tải danh sách đơn hàng'
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string; error?: string }; status?: number } }
        if (axiosError.response?.status === 401) {
          navigate('/auth/login')
          return
        } else {
          errorMessage = axiosError.response?.data?.message || 
                        axiosError.response?.data?.error || 
                        errorMessage
        }
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  // Filter orders based on status
  const filteredOrders = useMemo(() => {
    if (status === 'all') return orders
    return orders.filter((o) => o.status === (status as OrderStatus))
  }, [status, orders])

  const total = filteredOrders.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const paginatedOrders = filteredOrders.slice((page - 1) * pageSize, page * pageSize)

  const handleStatusChange = (newStatus: Status) => {
    setStatus(newStatus)
    setPage(1)
  }

  const handleOrderCanceled = useCallback(() => {
    // Refresh orders after cancel
    loadOrders()
  }, [loadOrders])

  return (
    <AppLayout>
      <div className={`${className} bg-gray-50 min-h-screen py-4`}>
        <div className="flex justify-center">
          <div className="w-full max-w-7xl px-4">
            {/* Filter Tabs */}
            <div className="flex gap-1 bg-white rounded-lg shadow-sm p-4 mb-6 border-b-2 border-gray-200 overflow-x-auto">
              <button
                className={`px-4 py-2 rounded-md font-medium transition whitespace-nowrap ${
                  status === 'all'
                    ? 'bg-emerald-100 text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-gray-600 hover:text-emerald-600'
                }`}
                onClick={() => handleStatusChange('all')}
              >
                Tất cả
              </button>
              <button
                className={`px-4 py-2 rounded-md font-medium transition whitespace-nowrap ${
                  status === 'pending'
                    ? 'bg-emerald-100 text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-gray-600 hover:text-emerald-600'
                }`}
                onClick={() => handleStatusChange('pending')}
              >
                Chờ xác nhận
              </button>
              <button
                className={`px-4 py-2 rounded-md font-medium transition whitespace-nowrap ${
                  status === 'delivering'
                    ? 'bg-emerald-100 text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-gray-600 hover:text-emerald-600'
                }`}
                onClick={() => handleStatusChange('delivering')}
              >
                Đang vận chuyển
              </button>
              <button
                className={`px-4 py-2 rounded-md font-medium transition whitespace-nowrap ${
                  status === 'completed'
                    ? 'bg-emerald-100 text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-gray-600 hover:text-emerald-600'
                }`}
                onClick={() => handleStatusChange('completed')}
              >
                Đã hoàn thành
              </button>
              <button
                className={`px-4 py-2 rounded-md font-medium transition whitespace-nowrap ${
                  status === 'cancelled'
                    ? 'bg-emerald-100 text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-gray-600 hover:text-emerald-600'
                }`}
                onClick={() => handleStatusChange('cancelled')}
              >
                Đã hủy
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Đang tải danh sách đơn hàng...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={loadOrders}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Thử lại
                </button>
              </div>
            )}

            {/* Orders List */}
            {!loading && !error && paginatedOrders.length === 0 && (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <p className="text-gray-500">Không có đơn hàng nào</p>
              </div>
            )}
            {!loading && !error && paginatedOrders.length > 0 && (
              <div className="space-y-4">
                {paginatedOrders.map((order) => (
                  <OrderItem
                    key={order._id}
                    order={order}
                    restaurantName={restaurantNames[order.restaurantId] || 'Nhà hàng không xác định'}
                    onOrderCanceled={handleOrderCanceled}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-2 rounded-md border border-gray-300 text-gray-600 disabled:opacity-50 hover:bg-gray-100"
                >
                  Trước
                </button>
                <span className="text-gray-600 text-sm">
                  Trang {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-2 rounded-md border border-gray-300 text-gray-600 disabled:opacity-50 hover:bg-gray-100"
                >
                  Tiếp
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default OrderListScreen
