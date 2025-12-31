import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../layouts/AppLayout'
import useAuth from '../../hooks/useAuth'
import CartList from './components/CartList'
import CheckoutSummary from './components/CheckoutSummary'
import * as cartApi from './api'
import type { Cart, CartItem } from './api'

// Mock data tạm thời
const MOCK_CART_ITEMS: CartItem[] = [
  {
    _id: 'cart-item-1',
    menuItemId: '6750abc123f9ab0012345678',
    name: 'Cơm Tấm Sườn Bì Chả',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    basePrice: 85000,
    qty: 2,
    selectedOptions: [
      {
        groupName: 'Size',
        optionName: 'Lớn',
        price: 10000,
      },
    ],
    finalPrice: 190000, // (85000 + 10000) * 2
  },
  {
    _id: 'cart-item-2',
    menuItemId: '6750abc123f9ab0012345679',
    name: 'Bánh Mì Thịt Nướng',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
    basePrice: 35000,
    qty: 1,
    selectedOptions: [],
    finalPrice: 35000,
  },
  {
    _id: 'cart-item-3',
    menuItemId: '6750abc123f9ab0012345680',
    name: 'Phở Bò Tái',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
    basePrice: 65000,
    qty: 1,
    selectedOptions: [
      {
        groupName: 'Thêm',
        optionName: 'Thêm bò viên',
        price: 15000,
      },
    ],
    finalPrice: 80000,
  },
]

const MOCK_CART: Cart = {
  _id: 'cart-123',
  userId: 'user-123',
  restaurantId: '6918b712a1dcc94af903df9d',
  items: MOCK_CART_ITEMS,
  totalItems: 4, // 2 + 1 + 1
  totalPrice: 305000, // 190000 + 35000 + 80000
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
}

// Flag để bật/tắt mock mode
// Đặt USE_MOCK_DATA = false khi đã có API thật từ backend
const USE_MOCK_DATA = true

const CartScreen: React.FC<{ className?: string }> = ({ className = '' }) => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    loadCart()
  }, [isAuthenticated, navigate])

  function calculateCartTotals(items: CartItem[]) {
    const totalItems = items.reduce((sum, item) => sum + item.qty, 0)
    const totalPrice = items.reduce((sum, item) => sum + item.finalPrice, 0)
    return { totalItems, totalPrice }
  }

  async function loadCart() {
    if (USE_MOCK_DATA) {
      // Sử dụng mock data
      setLoading(true)
      setTimeout(() => {
        setCart({ ...MOCK_CART })
        setLoading(false)
      }, 500) // Simulate API delay
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await cartApi.getCart()
      setCart(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải giỏ hàng')
      setCart(null)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateQty(itemId: string, qty: number) {
    if (qty < 1) return

    if (USE_MOCK_DATA) {
      // Mock: cập nhật số lượng trong cart
      if (!cart) return

      const updatedItems = cart.items.map((item) => {
        if (item._id === itemId) {
          const newFinalPrice = ((item.basePrice + item.selectedOptions.reduce((sum, opt) => sum + opt.price, 0)) * qty)
          return {
            ...item,
            qty,
            finalPrice: newFinalPrice,
          }
        }
        return item
      })

      const { totalItems, totalPrice } = calculateCartTotals(updatedItems)

      setCart({
        ...cart,
        items: updatedItems,
        totalItems,
        totalPrice,
        updatedAt: new Date().toISOString(),
      })
      return
    }

    try {
      const updatedCart = await cartApi.updateItem(itemId, { qty })
      setCart(updatedCart)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể cập nhật số lượng')
    }
  }

  async function handleRemove(itemId: string) {
    if (!confirm('Bạn có chắc muốn xóa món này khỏi giỏ hàng?')) {
      return
    }

    if (USE_MOCK_DATA) {
      // Mock: xóa item khỏi cart
      if (!cart) return

      const updatedItems = cart.items.filter((item) => item._id !== itemId)
      const { totalItems, totalPrice } = calculateCartTotals(updatedItems)

      setCart({
        ...cart,
        items: updatedItems,
        totalItems,
        totalPrice,
        updatedAt: new Date().toISOString(),
      })
      return
    }

    try {
      const updatedCart = await cartApi.deleteItem(itemId)
      setCart(updatedCart)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xóa món')
    }
  }

  async function handleCheckout() {
    if (!cart || cart.items.length === 0) return

    if (USE_MOCK_DATA) {
      // Mock: simulate checkout process
      try {
        setCheckoutLoading(true)
        setError(null)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Redirect to order list
        navigate('/payment')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể đặt hàng')
      } finally {
        setCheckoutLoading(false)
      }
      return
    }

    try {
      setCheckoutLoading(true)
      setError(null)
      await cartApi.checkout()
      // Redirect to order detail or order list
      navigate('/orders')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể đặt hàng')
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <AppLayout className={className}>
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Đang tải giỏ hàng...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout className={className}>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {!cart || cart.items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Giỏ hàng của bạn đang trống</p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CartList
                items={cart.items}
                onUpdateQty={handleUpdateQty}
                onRemove={handleRemove}
              />
            </div>

            <div className="lg:col-span-1">
              <CheckoutSummary
                totalItems={cart.totalItems}
                totalPrice={cart.totalPrice}
                onCheckout={handleCheckout}
                isLoading={checkoutLoading}
              />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default CartScreen