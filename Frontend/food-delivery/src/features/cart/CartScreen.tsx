import React, { useEffect, useState, useCallback } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import AppLayout from '../../layouts/AppLayout'
import useAuth from '../../hooks/useAuth'
import CartList from './components/CartList'
import CheckoutSummary from './components/CheckoutSummary'
import * as cartApi from './api'
import type { Cart } from './api'

const CartScreen: React.FC<{ className?: string }> = ({ className = '' }) => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadCart = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await cartApi.getCart()
      setCart(data)
    } catch (err: unknown) {
      let errorMessage = 'Không thể tải giỏ hàng'
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string; error?: string }; status?: number } }
        if (axiosError.response?.status === 401) {
          navigate('/login')
          return
        } else if (axiosError.response?.status === 404) {
          // Cart not found - this is OK, means empty cart
          setCart(null)
          setLoading(false)
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
      setCart(null)
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    loadCart()
  }, [isAuthenticated, loadCart])

  async function handleUpdateQty(itemId: string, qty: number) {
    if (qty < 1 || !cart) return

    try {
      setError(null)
      const updatedCart = await cartApi.updateItem(itemId, { qty })
      setCart(updatedCart)
    } catch (err: unknown) {
      let errorMessage = 'Không thể cập nhật số lượng'
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string; error?: string } } }
        errorMessage = axiosError.response?.data?.message || 
                       axiosError.response?.data?.error || 
                       errorMessage
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      setError(errorMessage)
      // Reload cart on error to sync state
      await loadCart()
    }
  }

  async function handleRemove(itemId: string) {
    if (!confirm('Bạn có chắc muốn xóa món này khỏi giỏ hàng?')) {
      return
    }

    try {
      setError(null)
      const updatedCart = await cartApi.deleteItem(itemId)
      setCart(updatedCart)
    } catch (err: unknown) {
      let errorMessage = 'Không thể xóa món'
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string; error?: string } } }
        errorMessage = axiosError.response?.data?.message || 
                       axiosError.response?.data?.error || 
                       errorMessage
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      setError(errorMessage)
      // Reload cart on error to sync state
      await loadCart()
    }
  }

  async function handleCheckout() {
    if (!cart || cart.items.length === 0) return

    try {
      setCheckoutLoading(true)
      setError(null)
      const order = await cartApi.checkout()
      // Navigate to order detail or order list
      navigate(`/orders/${order._id}`)
    } catch (err: unknown) {
      let errorMessage = 'Không thể đặt hàng'
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string; error?: string }; status?: number } }
        if (axiosError.response?.status === 401) {
          navigate('/login')
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
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (loading) {
    return (
      <AppLayout className={className}>
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải giỏ hàng...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout className={className}>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Giỏ hàng</h1>
          {cart && cart.items.length > 0 && (
            <button
              type="button"
              onClick={loadCart}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Làm mới
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p>{error}</p>
              <button
                type="button"
                onClick={loadCart}
                className="mt-2 text-sm underline hover:no-underline"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}

        {!cart || !cart.items || cart.items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-500 text-lg mb-2">Giỏ hàng của bạn đang trống</p>
            <p className="text-gray-400 text-sm mb-6">Thêm món ăn vào giỏ hàng để tiếp tục</p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold"
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
                totalItems={cart.totalItems || 0}
                totalPrice={cart.totalPrice || 0}
                onCheckout={handleCheckout}
                isLoading={checkoutLoading}
                disabled={!cart || cart.items.length === 0}
              />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default CartScreen