import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import FoodList from './components/FoodList'
import { type MenuItemDto } from './components/FoodItem'
import * as foodApi from './api'
import * as cartApi from '../cart/api'
import AppLayout from '../../layouts/AppLayout'
import useRestaurant from '../../hooks/useRestaurant'
import RestaurantHeader from './components/RestaurantHeader'
import RestaurantInfo from './components/RestaurantInfo'
import useAuth from '../../hooks/useAuth'
import { toast } from 'react-toastify'
import { FlagIcon } from '@heroicons/react/24/outline'
import { reportRestaurant } from '../report/api'

function isTrueLike(v: unknown) {
  return v === true || v === 1 || v === '1'
}

function isFalseLike(v: unknown) {
  return v === false || v === 0 || v === '0'
}

const RestaurantDetailScreen: React.FC = () => {
    const params = useParams<{ restaurantId?: string}>()
    const navigate = useNavigate()
    const { restaurantId } = params
    const { restaurant, loading: restaurantLoading, error: restaurantError } = useRestaurant(restaurantId)
  const { isAuthenticated } = useAuth()
  const [foods, setFoods] = useState<MenuItemDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [menuError, setMenuError] = useState<Error | null>(null);

  const isBlocked =
    restaurant?.status?.toString().toUpperCase() === 'BLOCKED' || isTrueLike((restaurant as any)?.isBlock)

  const isOperational =
    !isBlocked && !isFalseLike((restaurant as any)?.isActive) && !isFalseLike((restaurant as any)?.isAcceptingOrders)

  const [isReportOpen, setIsReportOpen] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [isReporting, setIsReporting] = useState(false)

  function handleFoodSelect(item: MenuItemDto) {
    navigate(`/food/${item._id}`)
  }

  useEffect(() => {
    if (!restaurantId) return;
    if (restaurantLoading) return;
    if (!restaurant) return;

    if (!isOperational) {
      setLoading(false)
      setMenuError(null)
      setFoods([])
      return
    }

    async function load() {
      setLoading(true);
      setMenuError(null);
      try {
        const menu = await foodApi.getMenuItemsByRestaurant(restaurantId!);
        setFoods(Array.isArray(menu) ? menu : []);
      } catch (err) {
        setMenuError(err instanceof Error ? err : new Error('Failed to load menu items'));
        setFoods([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [restaurantId, restaurantLoading, restaurant, isOperational]);

  async function handleAddToCart(payload: { itemId?: string; qty: number }) {
    if (!restaurantId || !payload.itemId) return

    if (!isAuthenticated) {
      navigate('/auth/login')
      return
    }

    const item = foods.find((f) => f._id === payload.itemId)
    if (!item) return

    try {
      const cart = await cartApi.addItem({
        restaurantId,
        menuItemId: payload.itemId,
        name: item.name,
        imageUrl: item.imageUrl,
        basePrice: item.price,
        qty: payload.qty,
        selectedOptions: [],
      })

      const totalItems = cart?.totalItems ?? cart?.items?.reduce((sum, it) => sum + (it?.qty ?? 0), 0) ?? 0
      window.dispatchEvent(new CustomEvent('cart:updated', { detail: { totalItems } }))

      toast.success('Đã thêm vào giỏ hàng!')
    } catch (err: unknown) {
      let errorMessage = 'Không thể thêm vào giỏ hàng'
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string; error?: string }; status?: number } }
        if (axiosError.response?.status === 401) {
          errorMessage = 'Vui lòng đăng nhập để thêm vào giỏ hàng'
          navigate('/auth/login')
        } else {
          errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.error || errorMessage
        }
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      toast.error(errorMessage)
    }
  }

  async function handleSubmitReport() {
    if (!restaurantId) return
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để báo cáo nhà hàng')
      navigate('/auth/login')
      return
    }

    const reason = reportReason.trim()
    if (!reason) {
      toast.error('Vui lòng nhập lý do báo cáo')
      return
    }

    setIsReporting(true)
    try {
      await reportRestaurant(restaurantId, {
        reason,
        description: `Báo cáo nhà hàng từ trang chi tiết: ${restaurantId}`,
      })
      toast.success('Đã gửi báo cáo. Admin sẽ sớm xử lý!')
      setIsReportOpen(false)
      setReportReason('')
    } catch (err: any) {
      if (err?.response?.status === 409 || err?.response?.data?.message?.includes('duplicate')) {
        toast.warning('Bạn đã báo cáo nhà hàng này trước đó rồi.')
      } else {
        toast.error(err?.response?.data?.message || 'Không thể gửi báo cáo')
      }
    } finally {
      setIsReporting(false)
    }
  }

  if (restaurantLoading) {
    return (
      <AppLayout>
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Đang tải thông tin nhà hàng...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (restaurantError || !restaurant) {
    return (
      <AppLayout>
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <p className="text-red-500">
              {restaurantError?.message || 'Không tìm thấy nhà hàng'}
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <div className="flex items-center justify-end mb-3">
          <button
            type="button"
            onClick={() => {
              if (!restaurantId) return
              if (!isAuthenticated) {
                toast.error('Vui lòng đăng nhập để báo cáo nhà hàng')
                navigate('/auth/login')
                return
              }
              setIsReportOpen(true)
            }}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FlagIcon className="w-5 h-5" />
            Báo cáo nhà hàng
          </button>
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:gap-4">
          <RestaurantHeader data={restaurant} />
          <RestaurantInfo data={restaurant} />
        </div>

        <section className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Menu</h3>
          {!isOperational ? (
            <p className="text-gray-600">Nhà hàng này đang không hoạt động</p>
          ) : loading ? (
            <p className="text-gray-500">Đang tải menu...</p>
          ) : menuError ? (
            <div className="py-6 text-center">
              <p className="text-red-500 mb-2">
                {menuError.message || 'Không thể tải menu'}
              </p>
              {menuError.message?.includes('timeout') && (
                <p className="text-sm text-gray-500">
                  Vui lòng kiểm tra kết nối hoặc thử lại sau
                </p>
              )}
            </div>
          ) : (
            <FoodList items={foods} onSelect={handleFoodSelect} onAdd={handleAddToCart} />
          )}
        </section>
      </div>

      {isReportOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Báo cáo nhà hàng</h2>
            <p className="text-sm text-gray-500 mb-6 font-medium">Nhà hàng này vi phạm chính sách của chúng tôi?</p>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Nhập lý do..."
              className="w-full px-4 py-4 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none h-32 transition-all bg-gray-50"
            />
            <div className="flex gap-3 mt-8">
              <button
                disabled={isReporting}
                onClick={() => {
                  setIsReportOpen(false)
                  setReportReason('')
                }}
                className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all"
              >
                Đóng
              </button>
              <button
                onClick={handleSubmitReport}
                disabled={isReporting || !reportReason.trim()}
                className="flex-1 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 disabled:opacity-50 transition-all shadow-lg shadow-red-200"
              >
                {isReporting ? 'Đang gửi...' : 'Gửi báo cáo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default RestaurantDetailScreen;