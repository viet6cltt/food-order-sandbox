import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppLayout from '../../layouts/AppLayout'
import FoodInfo from './components/FoodInfo'
import ReviewList from './components/ReviewList'
import AddToCartBar from './components/AddToCartBar'
import * as foodApi from './api'
import * as cartApi from '../cart/api'
import type { MenuItemDto } from '../restaurant/components/FoodItem'
import useAuth from '../../hooks/useAuth'
import { toast } from 'react-toastify'

const FoodDetailScreen: React.FC<{ className?: string }> = ({ className = '' }) => {
  const params = useParams<{ foodId?: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { foodId } = params

  const [food, setFood] = useState<MenuItemDto | null>(null)
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
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Không thể tải thông tin món ăn'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFoodDetails()
  }, [foodId])

  async function handleAddToCart(payload: { itemId?: string; qty: number }) {
    if (!food || !payload.itemId) return
    if (!isAuthenticated) {
      navigate('/auth/login')
      return
    }

    try {
      setCartLoading(true)
      await cartApi.addItem({
        restaurantId: food.restaurantId || '',
        menuItemId: payload.itemId,
        name: food.name,
        imageUrl: food.imageUrl,
        basePrice: food.price,
        qty: payload.qty,
        selectedOptions: [],
      })
      toast.success('Đã thêm vào giỏ hàng thành công!')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể thêm vào giỏ hàng')
    } finally {
      setCartLoading(false)
    }
  }

  if (loading) {
    return (
      <AppLayout className={className}>
        <div className="max-w-5xl mx-auto px-4 py-12 text-center text-gray-500 animate-pulse font-medium">
          Đang tải thông tin món ăn...
        </div>
      </AppLayout>
    )
  }

  if (error || !food) {
    return (
      <AppLayout className={className}>
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <p className="text-red-500 mb-4">{error || 'Không tìm thấy món ăn'}</p>
          <button onClick={() => navigate(-1)} className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold">
            Quay lại
          </button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout className={className}>
      <div className="max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-emerald-600 hover:text-emerald-700 font-bold mb-6 inline-flex items-center transition-colors"
        >
          ← Quay lại
        </button>

        <FoodInfo food={food} className="mb-6" />

        {food.isAvailable !== false && (
          <div className="fixed bottom-0 left-0 right-0 md:relative md:mt-8 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:shadow-none">
            <AddToCartBar
              itemId={food._id}
              price={food.price}
              onAdd={handleAddToCart}
              loading={cartLoading}
              className="md:rounded-2xl"
            />
          </div>
        )}

        <div className="mt-12 space-y-8">
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex gap-3 items-center">
            <div className="bg-emerald-500 text-white rounded-full p-1.5 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-emerald-800 font-medium">
              Bạn chỉ có thể đánh giá món ăn sau khi đã mua và nhận hàng thành công.
            </p>
          </div>

          {/* Component tự fetch review theo ID món ăn */}
          <ReviewList menuItemId={food._id} />
        </div>
      </div>
    </AppLayout>
  )
}

export default FoodDetailScreen