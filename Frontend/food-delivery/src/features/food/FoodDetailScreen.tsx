import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppLayout from '../../layouts/AppLayout'
import FoodInfo from './components/FoodInfo'
import ReviewList from './components/ReviewList'
import AddToCartBar from './components/AddToCartBar'
import * as foodApi from './api'
import * as cartApi from '../cart/api'
import type { MenuItemDto } from '../restaurant/components/FoodItem'
import type { Review } from './api'
import useAuth from '../../hooks/useAuth'
import { toast } from 'react-toastify'

const FoodDetailScreen: React.FC<{ className?: string }> = ({ className = '' }) => {
  const params = useParams<{ foodId?: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { foodId } = params

  const [food, setFood] = useState<MenuItemDto | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cartLoading, setCartLoading] = useState(false)

  async function loadFoodDetails() {
    if (!foodId) return

    try {
      setLoading(true)
      setError(null)
      const data = await foodApi.getMenuItemById(foodId)
      setFood(data)
    } catch (err: unknown) {
      let errorMessage = 'Không thể tải thông tin món ăn'
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string; error?: string }; status?: number } }
        if (axiosError.response?.status === 404) {
          errorMessage = 'Không tìm thấy món ăn'
        } else {
          errorMessage = axiosError.response?.data?.message || 
                         axiosError.response?.data?.error || 
                         errorMessage
        }
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      setError(errorMessage)
      setFood(null)
    } finally {
      setLoading(false)
    }
  }

  async function loadReviews() {
    if (!foodId) return

    try {
      const data = await foodApi.getReviews(foodId)
      setReviews(data)
    } catch (err) {
      console.error('Failed to load reviews:', err)
      setReviews([])
    }
  }

  useEffect(() => {
    if (!foodId) {
      setError('Không tìm thấy mã món ăn')
      setLoading(false)
      return
    }

    loadFoodDetails()
    loadReviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foodId])

  async function handleAddToCart(payload: { itemId?: string; qty: number }) {
    if (!food || !payload.itemId) return

    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    try {
      setCartLoading(true)
      setError(null)

      await cartApi.addItem({
        restaurantId: food.restaurantId || '',
        menuItemId: payload.itemId,
        name: food.name,
        imageUrl: food.imageUrl,
        basePrice: food.price,
        qty: payload.qty,
        selectedOptions: [], // TODO: Add option selection UI later
      })

      toast.success('Đã thêm vào giỏ hàng thành công!')
    } catch (err: unknown) {
      let errorMessage = 'Không thể thêm vào giỏ hàng'
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string; error?: string }; status?: number } }
        if (axiosError.response?.status === 401) {
          errorMessage = 'Vui lòng đăng nhập để thêm vào giỏ hàng'
          navigate('/login')
        } else if (axiosError.response?.status === 400) {
          errorMessage = axiosError.response?.data?.message || 
                         axiosError.response?.data?.error || 
                         'Dữ liệu không hợp lệ'
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
      setCartLoading(false)
    }
  }

  async function handleReviewSubmit(payload: { rating: number; comment?: string }) {
    if (!foodId) return

    await foodApi.createReview({
      menuItemId: foodId,
      rating: payload.rating,
      comment: payload.comment,
    })

    await loadReviews()
  }

  if (loading) {
    return (
      <AppLayout className={className}>
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Đang tải thông tin món ăn...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (error && !food) {
    return (
      <AppLayout className={className}>
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Quay lại
            </button>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!food) {
    return (
      <AppLayout className={className}>
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Không tìm thấy món ăn</p>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Quay lại
            </button>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout className={className}>
      <div className="max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-emerald-600 hover:text-emerald-700 font-medium mb-4 inline-flex items-center"
          >
            ← Quay lại
          </button>
        </div>

        <FoodInfo food={food} className="mb-6" />

        {food.isAvailable !== false && (
          <div className="fixed bottom-0 left-0 right-0 md:relative md:mt-6 z-10">
            <AddToCartBar
              itemId={food._id}
              price={food.price}
              onAdd={handleAddToCart}
              loading={cartLoading}
              className="md:rounded-lg"
            />
          </div>
        )}

        <div className="mt-8 space-y-6">
          <ReviewForm
            onSubmit={handleReviewSubmit}
            className="mb-6"
          />

          <ReviewList reviews={reviews} />
        </div>
      </div>
    </AppLayout>
  )
}

export default FoodDetailScreen

