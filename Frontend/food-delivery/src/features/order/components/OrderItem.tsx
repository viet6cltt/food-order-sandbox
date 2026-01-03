import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
// Thêm icon CheckBadgeIcon để hiển thị trạng thái đã đánh giá
import { CameraIcon, XMarkIcon, StarIcon, CheckBadgeIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutline } from '@heroicons/react/24/outline'
import type { Order } from '../../../types/order'
import * as orderApi from '../api'
import * as reviewApi from '../../review/api'

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
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  const totalPrice = order.totalFoodPrice + (order.shippingFee || 0) - (order.discountAmount || 0)
  const deliveryAddressText = order.deliveryAddress?.full || ''
  const paymentMethodText = order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản'

  const statusLabels: Record<string, string> = {
    draft: 'Chưa hoàn thiện', pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận',
    delivering: 'Đang giao', completed: 'Hoàn thành', cancelled: 'Đã hủy', refunded: 'Hoàn tiền',
  }

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700', pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700', delivering: 'bg-emerald-100 text-emerald-700',
    completed: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-red-100 text-red-700',
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      if (images.length + selectedFiles.length > 5) {
        toast.warning('Bạn chỉ được tải lên tối đa 5 hình ảnh')
        return
      }
      setImages(prev => [...prev, ...selectedFiles])
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file))
      setPreviews(prev => [...prev, ...newPreviews])
    }
  }

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index])
    setImages(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const closeReviewModal = () => {
    setShowReviewModal(false)
    setComment('')
    setRating(5)
    previews.forEach(url => URL.revokeObjectURL(url))
    setImages([])
    setPreviews([])
  }

  const handleCancel = async () => {
    if (!window.confirm('Bạn chắc chắn muốn hủy đơn hàng này?')) return
    setLoading(true)
    try {
      await orderApi.cancelOrder(order._id)
      toast.success('Hủy đơn hàng thành công')
      onOrderCanceled?.()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể hủy đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async () => {
    if (rating === 0) return toast.error('Vui lòng chọn số sao')
    setLoading(true)
    try {
      const payload: reviewApi.CreateReviewPayload = {
        orderId: order._id,
        restaurantId: order.restaurantId,
        rating,
        comment: comment.trim(),
        reviewImages: images
      }
      await reviewApi.createReview(payload)
      toast.success('Cảm ơn đánh giá của bạn!')
      closeReviewModal()
      onOrderCanceled?.()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể gửi đánh giá')
    } finally {
      setLoading(false)
    }
  }

  // --- Chỉnh sửa logic render nút tại đây ---
  const renderButtons = () => {
    const baseBtn = 'px-4 py-2 rounded-md text-sm font-medium transition disabled:opacity-50'
    
    if (order.status === 'completed') {
      return (
        <div className="flex items-center gap-3">
          {/* Nếu chưa đánh giá thì hiện nút, nếu rồi thì hiện nhãn trạng thái */}
          {!order.isReviewed ? (
            <button 
              className={`${baseBtn} bg-emerald-600 text-white hover:bg-emerald-700`} 
              onClick={() => setShowReviewModal(true)}
            >
              Đánh giá
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-600 px-3 py-2 bg-emerald-50 rounded-md">
              <CheckBadgeIcon className="w-5 h-5" />
              <span className="text-sm font-bold">Đã đánh giá</span>
            </div>
          )}
          
          <button className={`${baseBtn} bg-gray-200 text-gray-700 hover:bg-gray-300`} onClick={() => toast.info('Chức năng đang phát triển')}>
            Liên hệ
          </button>
        </div>
      )
    }

    if (['pending', 'confirmed', 'delivering', 'draft'].includes(order.status)) {
      return (
        <div className="flex gap-2">
          {order.status === 'draft' && (
            <button className={`${baseBtn} bg-emerald-600 text-white`} onClick={() => navigate(`/payment?orderId=${order._id}`)}>
              Thanh toán
            </button>
          )}
          <button className={`${baseBtn} bg-red-600 text-white hover:bg-red-700`} onClick={handleCancel} disabled={loading}>
            Hủy đơn
          </button>
        </div>
      )
    }
    return null
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4 hover:shadow-md transition">
        {/* Header - Giữ nguyên */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <div>
            <p className="text-xs text-gray-500 font-mono">#{order._id.slice(-8).toUpperCase()}</p>
            <p className="font-bold text-gray-800">{restaurantName}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status]}`}>
            {statusLabels[order.status]}
          </span>
        </div>

        {/* Nội dung món ăn - Giữ nguyên */}
        <div className="p-4">
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <img src={item.imageUrl} className="w-14 h-14 rounded-lg object-cover bg-gray-100 border" alt={item.name} />
                <div className="flex-1 text-sm">
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-gray-500 italic">Số lượng: {item.quantity}</p>
                </div>
                <p className="font-bold text-gray-900">{(item.finalPrice * item.quantity).toLocaleString()}₫</p>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed my-4 border-gray-200" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="text-xs text-gray-500 space-y-1">
              <p><span className="font-semibold text-gray-700">Địa chỉ:</span> {deliveryAddressText}</p>
              <p><span className="font-semibold text-gray-700">Thanh toán:</span> {paymentMethodText}</p>
              <p><span className="font-semibold text-gray-700">Ngày đặt:</span> {new Date(order.updatedAt).toLocaleString('vi-VN')}</p>
            </div>
            <div className="text-right w-full md:w-auto">
              <p className="text-xs text-gray-500 font-medium">Tổng thanh toán</p>
              <p className="text-2xl font-black text-emerald-600 leading-none">{totalPrice.toLocaleString()}₫</p>
            </div>
          </div>

          <div className="mt-5 flex justify-end border-t pt-4 border-gray-50">{renderButtons()}</div>
        </div>
      </div>

      {/* Modal Đánh giá - Giữ nguyên */}
      {showReviewModal && (
        // ... (phần code modal đánh giá không thay đổi)
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-gray-800">Đánh giá dịch vụ</h2>
              <p className="text-sm text-gray-500">{restaurantName}</p>
            </div>
            
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} className="transition-all transform hover:scale-125 active:scale-95">
                  {rating >= star ? (
                    <StarIcon className="w-10 h-10 text-yellow-400 drop-shadow-sm" />
                  ) : (
                    <StarOutline className="w-10 h-10 text-gray-300" />
                  )}
                </button>
              ))}
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Bình luận của bạn</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Hãy chia sẻ cảm nhận của bạn về món ăn nhé..."
                  className="w-full border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none h-28 text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Hình ảnh thực tế ({images.length}/5)</label>
                <div className="flex flex-wrap gap-3">
                  {previews.map((url, index) => (
                    <div key={index} className="relative w-20 h-20 animate-in fade-in zoom-in duration-200">
                      <img src={url} className="w-full h-full object-cover rounded-xl border-2 border-gray-100 shadow-sm" alt="preview" />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
                      >
                        <XMarkIcon className="w-3 h-3 stroke-[3]" />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition-all group">
                      <CameraIcon className="w-7 h-7 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button className="flex-1 py-3.5 bg-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors" onClick={closeReviewModal}>
                Hủy bỏ
              </button>
              <button 
                className="flex-1 py-3.5 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-[0.98]"
                onClick={handleReview}
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Gửi ngay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default OrderItem