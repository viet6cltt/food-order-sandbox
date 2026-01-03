import React, { useState, useEffect, useCallback } from 'react'
import { StarIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon, FlagIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline'
import type { Review } from '../../review/api'
import { getReviewsByMenuItem } from '../../review/api';
import { reportReview } from '../../report/api'; 
import { toast } from 'react-toastify'
import useAuth from '../../../hooks/useAuth'

interface ReviewListProps {
  menuItemId: string
  className?: string
}

const ReviewList: React.FC<ReviewListProps> = ({ menuItemId, className = '' }) => {
  const { isAuthenticated } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  
  const [reportingReviewId, setReportingReviewId] = useState<string | null>(null)
  const [reportReason, setReportReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await getReviewsByMenuItem(menuItemId, 1, 20)
      setReviews(data.items)
      setTotal(data.total)
    } catch (err) {
      console.error('Fetch reviews error:', err)
      toast.error('Không thể tải danh sách đánh giá')
    } finally {
      setIsLoading(false)
    }
  }, [menuItemId])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  const handleReport = async (reviewId: string) => {
    if (!reportReason.trim()) return toast.error('Vui lòng nhập lý do')
    
    setIsSubmitting(true)
    try {
      await reportReview(reviewId, { 
        reason: reportReason.trim(),
        description: `Báo cáo đánh giá từ trang chi tiết món ăn ${menuItemId}`
      })
      
      toast.success('Báo cáo đánh giá thành công. Admin sẽ sớm xử lý!')
      setReportingReviewId(null)
      setReportReason('')
    } catch (err: any) {
      // Xử lý lỗi spam report (Unique index lỗi từ Backend)
      if (err.response?.status === 409 || err.response?.data?.message?.includes('duplicate')) {
        toast.warning('Bạn đã báo cáo nội dung này trước đó rồi.')
      } else {
        toast.error(err.response?.data?.message || 'Không thể gửi báo cáo')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-12 flex flex-col items-center justify-center min-h-[300px] border border-gray-100 shadow-sm">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Đang tải đánh giá...</p>
      </div>
    )
  }

  return (
    <div className={`${className} bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden`}>
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-emerald-600" />
          Đánh giá từ khách hàng ({total})
        </h2>
      </div>

      <div className="divide-y divide-gray-100">
        {reviews.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-400 font-medium italic">Món ăn này chưa có đánh giá nào.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="p-6 transition-colors hover:bg-gray-50/50">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    {typeof review.userId === 'object' && review.userId?.avatarUrl ? (
                      <img src={review.userId.avatarUrl} className="w-12 h-12 rounded-full object-cover ring-4 ring-gray-50 shadow-sm" alt="" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center ring-4 ring-gray-50 text-emerald-700 font-bold text-lg">
                        {typeof review.userId === 'object' ? (review.userId?.firstname?.[0] || 'U') : 'U'}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 leading-none mb-1.5">
                      {typeof review.userId === 'object' 
                        ? `${review.userId?.firstname || ''} ${review.userId?.lastname || ''}`.trim() || 'Người dùng'
                        : 'Người dùng ẩn danh'}
                    </h4>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          i < review.rating ? 
                            <StarIcon key={i} className="w-4 h-4 text-yellow-400" /> : 
                            <StarOutlineIcon key={i} className="w-4 h-4 text-gray-300" />
                        ))}
                      </div>
                      <span className="text-gray-300 text-[10px]">•</span>
                      <time className="text-xs text-gray-400 font-medium">{formatDate(review.createdAt)}</time>
                    </div>
                  </div>
                </div>

                {/* NÚT BÁO CÁO: Chỉ hiện khi đã đăng nhập */}
                {isAuthenticated && (
                  <button
                    onClick={() => setReportingReviewId(review._id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  >
                    <FlagIcon className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="mt-4 ml-16">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{review.comment}</p>
                {review.images && review.images.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 mt-5">
                    {review.images.map((img, idx) => (
                      <img 
                        key={idx} 
                        src={img} 
                        alt="Review" 
                        onClick={() => setSelectedImage(img)}
                        className="w-20 h-20 rounded-xl object-cover cursor-zoom-in hover:scale-105 active:scale-95 border-2 border-transparent hover:border-emerald-200 transition-all shadow-sm"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* LIGHTBOX MODAL (Ảnh phóng to) */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-6 right-6 text-white hover:bg-white/10 rounded-full p-2 transition-all">
            <XMarkIcon className="w-8 h-8" />
          </button>
          <img 
            src={selectedImage} 
            alt="Full size" 
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

      {/* REPORT MODAL */}
      {reportingReviewId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Báo cáo vi phạm</h2>
            <p className="text-sm text-gray-500 mb-6 font-medium">Nội dung này vi phạm chính sách của chúng tôi?</p>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Nhập lý do..."
              className="w-full px-4 py-4 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none h-32 transition-all bg-gray-50"
            />
            <div className="flex gap-3 mt-8">
              <button
                disabled={isSubmitting}
                onClick={() => { setReportingReviewId(null); setReportReason(''); }}
                className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all"
              >
                Đóng
              </button>
              <button
                onClick={() => handleReport(reportingReviewId)}
                disabled={isSubmitting || !reportReason.trim()}
                className="flex-1 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 disabled:opacity-50 transition-all shadow-lg shadow-red-200"
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi báo cáo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReviewList