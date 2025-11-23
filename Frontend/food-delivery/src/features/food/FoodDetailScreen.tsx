import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppLayout from '../../layouts/AppLayout'
import FoodInfo from './components/FoodInfo'
import ReviewList from './components/ReviewList'
import ReviewForm from './components/ReviewForm'
import AddToCartBar from './components/AddToCartBar'
import * as foodApi from './api'
import * as cartApi from '../cart/api'
import type { MenuItemDto } from '../restaurant/components/FoodItem'
import type { Review } from './api'
import useAuth from '../../hooks/useAuth'

// Mock data tạm thời
const MOCK_FOOD: MenuItemDto = {
  _id: '6750abc123f9ab0012345678',
  name: 'Cơm Tấm Sườn Bì Chả',
  description: 'Cơm tấm với sườn nướng thơm lừng, bì giòn tan và chả trứng đậm đà. Món ăn đặc trưng của miền Nam Việt Nam, kèm theo nước mắm pha chua ngọt và rau sống tươi ngon.',
  price: 85000,
  imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
  isAvailable: true,
  rating: 4.7,
  restaurantId: '6918b712a1dcc94af903df9d',
}

const MOCK_REVIEWS: Review[] = [
  {
    _id: 'rev1',
    userId: 'user1',
    userName: 'Nguyễn Văn A',
    menuItemId: '6750abc123f9ab0012345678',
    rating: 5,
    comment: 'Món ăn rất ngon, sườn nướng thơm lừng, bì giòn tan. Nhà hàng phục vụ nhanh và nhiệt tình. Sẽ quay lại!',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    _id: 'rev2',
    userId: 'user2',
    userName: 'Trần Thị B',
    menuItemId: '6750abc123f9ab0012345678',
    rating: 4,
    comment: 'Cơm tấm ngon, giá cả hợp lý. Phần ăn đủ no. Điểm trừ là hơi đợi lâu một chút.',
    createdAt: '2024-01-14T14:20:00Z',
  },
  {
    _id: 'rev3',
    userId: 'user3',
    userName: 'Lê Văn C',
    menuItemId: '6750abc123f9ab0012345678',
    rating: 5,
    comment: 'Tuyệt vời! Món ăn đúng như mô tả, rất đậm đà và thơm ngon.',
    createdAt: '2024-01-13T18:45:00Z',
  },
  {
    _id: 'rev4',
    userId: 'user4',
    userName: 'Phạm Thị D',
    menuItemId: '6750abc123f9ab0012345678',
    rating: 4,
    comment: '',
    createdAt: '2024-01-12T12:00:00Z',
  },
]

// Flag để bật/tắt mock mode
// Đặt USE_MOCK_DATA = false khi đã có API thật từ backend
const USE_MOCK_DATA = true

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

    if (USE_MOCK_DATA) {
      // Sử dụng mock data
      setLoading(true)
      setTimeout(() => {
        setFood(MOCK_FOOD)
        setLoading(false)
      }, 500) // Simulate API delay
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await foodApi.getMenuItemById(foodId)
      setFood(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải thông tin món ăn')
      setFood(null)
    } finally {
      setLoading(false)
    }
  }

  async function loadReviews() {
    if (!foodId) return

    if (USE_MOCK_DATA) {
      // Sử dụng mock data
      setTimeout(() => {
        setReviews(MOCK_REVIEWS)
      }, 600) // Simulate API delay
      return
    }

    try {
      const data = await foodApi.getReviews(foodId)
      setReviews(data)
    } catch (err) {
      // Silently fail for reviews - they're optional
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
      })

      // Optionally show success message or navigate to cart
      // For now, just clear the loading state
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể thêm vào giỏ hàng')
    } finally {
      setCartLoading(false)
    }
  }

  async function handleReviewSubmit(payload: { rating: number; comment?: string }) {
    if (!foodId) return

    if (USE_MOCK_DATA) {
      // Mock: thêm review mới vào danh sách
      const newReview: Review = {
        _id: `rev${Date.now()}`,
        userId: 'currentUser',
        userName: 'Bạn',
        menuItemId: foodId,
        rating: payload.rating,
        comment: payload.comment,
        createdAt: new Date().toISOString(),
      }
      setReviews((prev) => [newReview, ...prev])
      return
    }

    await foodApi.createReview({
      menuItemId: foodId,
      rating: payload.rating,
      comment: payload.comment,
    })

    // Reload reviews after submission
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
              className="md:rounded-lg"
            />
            {cartLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                <p className="text-sm text-gray-600">Đang thêm vào giỏ hàng...</p>
              </div>
            )}
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

