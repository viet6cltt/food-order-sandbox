import type React from 'react'
import { useState } from 'react'
import type { Order } from '../../../types/order'

interface OrderItemProps {
  order: Order
}

const OrderItem: React.FC<OrderItemProps> = ({ order }) => {
  const [loading, setLoading] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  const statusLabels: Record<string, string> = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    delivering: 'Đang vận chuyển',
    completed: 'Đã hoàn thành',
    canceled: 'Đã hủy',
    refunded: 'Đã hoàn tiền',
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    delivering: 'bg-emerald-100 text-emerald-700',
    completed: 'bg-emerald-100 text-emerald-700',
    canceled: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-700',
  }

  const handleCancel = async () => {
    if (!window.confirm('Bạn chắc chắn muốn hủy đơn hàng này?')) return
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert('Hủy đơn hàng thành công')
    } catch {
      alert('Lỗi: Hủy đơn hàng thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleRefund = async () => {
    if (!window.confirm('Bạn muốn hoàn tiền cho đơn hàng này?')) return
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert('Yêu cầu hoàn tiền đã được gửi')
    } catch {
      alert('Lỗi: Hoàn tiền thất bại')
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

  const renderButtons = () => {
    const baseButtonClass =
      'px-4 py-2 rounded-md text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed'
    const emeraldButton = `${baseButtonClass} bg-emerald-600 text-white hover:bg-emerald-700`
    const redButton = `${baseButtonClass} bg-red-600 text-white hover:bg-red-700`
    const grayButton = `${baseButtonClass} bg-gray-200 text-gray-700 hover:bg-gray-300`

    switch (order.status) {
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
      case 'canceled':
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
            <p className="text-lg font-semibold text-gray-800">{order.restaurantName}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
            {statusLabels[order.status] || order.status}
          </span>
        </div>

        <div className="p-4">
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-md object-cover bg-gray-100"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <div className="flex justify-between items-end mt-1">
                    <p className="text-sm text-gray-600">SL: {item.quantity}</p>
                    <p className="font-semibold text-emerald-600">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-gray-300 my-4" />

          <div className="flex justify-between items-start mb-4">
            <div>
              {order.deliveryAddress && (
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Địa chỉ:</span> {order.deliveryAddress}
                </p>
              )}
              {order.paymentMethod && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Thanh toán:</span> {order.paymentMethod}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Tổng cộng</p>
              <p className="text-2xl font-bold text-emerald-600">
                {order.totalPrice.toLocaleString('vi-VN')}₫
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">{renderButtons()}</div>
        </div>

        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
          Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}
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