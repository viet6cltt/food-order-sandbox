import type React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import type { Order } from '../../../types/order'
import * as orderApi from '../api'

interface OrderItemProps {
  order: Order
  restaurantName?: string
  onOrderCanceled?: () => void
}

const OrderItem: React.FC<OrderItemProps> = ({ order, restaurantName = 'Nhà hàng không xác định', onOrderCanceled }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  // Calculate total price
  const totalPrice = order.totalFoodPrice + (order.shippingFee || 0) - (order.discountAmount || 0)
  
  // Get delivery address text
  const deliveryAddressText = order.deliveryAddress?.full || ''
  
  // Get payment method text
  const paymentMethodText = order.paymentMethod === 'COD' 
    ? 'Thanh toán khi nhận hàng' 
    : order.paymentMethod === 'BANK_TRANSFER'
    ? 'Thanh toán bằng ngân hàng'
    : order.paymentMethod || ''

  const statusLabels: Record<string, string> = {
    draft: 'Chưa hoàn thiện',
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    delivering: 'Đang vận chuyển',
    completed: 'Đã hoàn thành',
    cancelled: 'Đã hủy',
    refunded: 'Đã hoàn tiền',
  }

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    delivering: 'bg-emerald-100 text-emerald-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700', 
    refunded: 'bg-gray-100 text-gray-700',
  }

  const handleCancel = async () => {
    if (!window.confirm('Bạn chắc chắn muốn hủy đơn hàng này?')) return
    setLoading(true)
    try {
      await orderApi.cancelOrder(order._id)
      toast.success('Hủy đơn hàng thành công')
      if (onOrderCanceled) {
        onOrderCanceled()
      }
    } catch (err: unknown) {
      let errorMessage = 'Không thể hủy đơn hàng'
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string; error?: string }; status?: number } }
        if (axiosError.response?.status === 401) {
          errorMessage = 'Vui lòng đăng nhập lại'
        } else if (axiosError.response?.status === 404) {
          errorMessage = 'Không tìm thấy đơn hàng'
        } else if (axiosError.response?.status === 400) {
          errorMessage = axiosError.response?.data?.message || 'Không thể hủy đơn hàng ở trạng thái này'
        } else {
          errorMessage = axiosError.response?.data?.message || 
                        axiosError.response?.data?.error || 
                        errorMessage
        }
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async () => {
    if (!comment.trim()) {
      alert('Vui lòng nhập bình luận')
      return
    }
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert('Cảm ơn đánh giá của bạn!')
      setShowReviewModal(false)
      setComment('')
      setRating(5)
    } catch {
      alert('Lỗi: Gửi đánh giá thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleContactSeller = () => {
    alert('Chức năng liên hệ nhà hàng đang phát triển')
  }

  const handleContinuePayment = () => {
    navigate(`/payment?orderId=${order._id}`)
  }

  const renderButtons = () => {
    const baseButtonClass =
      'px-4 py-2 rounded-md text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed'
    const emeraldButton = `${baseButtonClass} bg-emerald-600 text-white hover:bg-emerald-700`
    const redButton = `${baseButtonClass} bg-red-600 text-white hover:bg-red-700`
    const grayButton = `${baseButtonClass} bg-gray-200 text-gray-700 hover:bg-gray-300`

    switch (order.status) {
      case 'draft':
        return (
          <div className="flex gap-2">
            <button className={`${emeraldButton}`} onClick={handleContinuePayment} disabled={loading}>
              Tiếp tục thanh toán
            </button>
            <button className={`${redButton}`} onClick={handleCancel} disabled={loading}>
              Hủy đơn
            </button>
          </div>
        )
      case 'pending':
      case 'confirmed':
        return (
          <div className="flex gap-2">
            <button className={`${emeraldButton}`} onClick={handleContactSeller} disabled={loading}>
              Liên hệ nhà hàng
            </button>
            <button className={`${redButton}`} onClick={handleCancel} disabled={loading}>
              Hủy đơn
            </button>
          </div>
        )
      case 'delivering':
        return (
          <div className="flex gap-2">
            <button className={`${emeraldButton}`} onClick={handleContactSeller} disabled={loading}>
              Liên hệ nhà hàng
            </button>
            <button className={`${redButton}`} onClick={handleCancel} disabled={loading}>
              Hủy đơn
            </button>
          </div>
        )
      case 'completed':
        return (
          <div className="flex gap-2">
            <button className={`${emeraldButton}`} onClick={() => setShowReviewModal(true)} disabled={loading}>
              Đánh giá
            </button>
            <button className={`${grayButton}`} onClick={handleContactSeller} disabled={loading}>
              Liên hệ nhà hàng
            </button>
          </div>
        )
      case 'cancelled': 
      case 'refunded':
        return (
          <div className="flex gap-2">
            <button className={`${grayButton}`} onClick={handleContactSeller} disabled={loading}>
              Liên hệ nhà hàng
            </button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <div>
            <p className="text-sm text-gray-500">Đơn hàng #{order._id.slice(-8)}</p>
            <p className="text-lg font-semibold text-gray-800">{restaurantName}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
            {statusLabels[order.status] || order.status}
          </span>
        </div>

        <div className="p-4">
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-md object-cover bg-gray-100"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <div className="flex justify-between items-end mt-1">
                    <p className="text-sm text-gray-600">SL: {item.quantity}</p>
                    <p className="font-semibold text-emerald-600">
                      {(item.finalPrice * item.quantity).toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-gray-300 my-4" />

          <div className="flex justify-between items-start mb-4">
            <div>
              {deliveryAddressText && (
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Địa chỉ:</span> {deliveryAddressText}
                </p>
              )}
              {paymentMethodText && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Thanh toán:</span> {paymentMethodText}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="space-y-1 mb-2">
                <div className="flex justify-between gap-4 text-sm text-gray-600">
                  <span>Tổng tiền món:</span>
                  <span>{order.totalFoodPrice.toLocaleString('vi-VN')}₫</span>
                </div>
                {order.shippingFee !== undefined && order.shippingFee > 0 && (
                  <div className="flex justify-between gap-4 text-sm text-gray-600">
                    <span>Phí ship:</span>
                    <span>{order.shippingFee.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}
                {order.discountAmount !== undefined && order.discountAmount > 0 && (
                  <div className="flex justify-between gap-4 text-sm text-emerald-600">
                    <span>Giảm giá:</span>
                    <span>-{order.discountAmount.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}
              </div>
              <div className="border-t border-gray-300 pt-2 mt-2">
                <p className="text-sm text-gray-600 mb-1">Tổng cộng</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {totalPrice.toLocaleString('vi-VN')}₫
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">{renderButtons()}</div>
        </div>

        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
          Ngày đặt: {new Date(order.updatedAt).toLocaleString('vi-VN')}
        </div>
      </div>

      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Đánh giá đơn hàng</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Xếp hạng</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl transition ${rating >= star ? 'text-emerald-500' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Bình luận</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Nhập bình luận của bạn..."
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleReview}
                disabled={loading}
                className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default OrderItem