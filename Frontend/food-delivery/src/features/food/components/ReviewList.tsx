import React, { useState } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import { FlagIcon } from '@heroicons/react/24/outline'
import type { Review } from '../../review/api'
import { reportReview } from '../../review/api'
import { toast } from 'react-toastify'
import useAuth from '../../../hooks/useAuth'

interface ReviewListProps {
  reviews: Review[]
  className?: string
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, className = '' }) => {
  const { isAuthenticated } = useAuth()
  const [reportingReviewId, setReportingReviewId] = useState<string | null>(null)
  const [reportReason, setReportReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  function formatDate(dateString?: string) {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  function renderStars(rating: number) {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          i < rating ? (
            <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
          ) : (
            <StarOutlineIcon key={i} className="w-4 h-4 text-gray-300" />
          )
        ))}
      </div>
    )
  }

  async function handleReport(reviewId: string) {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để báo cáo đánh giá')
      return
    }

    if (!reportReason.trim()) {
      toast.error('Vui lòng nhập lý do báo cáo')
      return
    }

    setIsSubmitting(true)
    try {
      await reportReview(reviewId, { reason: reportReason.trim() })
      toast.success('Báo cáo đánh giá đã được gửi thành công!')
      setReportingReviewId(null)
      setReportReason('')
    } catch (err: unknown) {
      let errorMessage = 'Không thể gửi báo cáo'
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string; error?: string }; status?: number } }
        errorMessage = axiosError.response?.data?.message || 
                      axiosError.response?.data?.error || 
                      errorMessage
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (reviews.length === 0) {
    return (
      <div className={`${className} bg-white rounded-lg shadow-md p-6`}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Đánh giá</h2>
        <p className="text-gray-500 text-center py-8">Chưa có đánh giá nào cho món ăn này.</p>
      </div>
    )
  }

  return (
    <div className={`${className} bg-white rounded-lg shadow-md p-6`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Đánh giá ({reviews.length})
      </h2>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {typeof review.userId === 'object' && review.userId?.avatarUrl ? (
                    <img
                      src={review.userId.avatarUrl}
                      alt={review.userId.firstname || 'User'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-emerald-600 font-semibold">
                        {typeof review.userId === 'object' 
                          ? (review.userId?.firstname?.charAt(0).toUpperCase() || 
                             review.userId?.lastname?.charAt(0).toUpperCase() || 'U')
                          : 'U'}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">
                      {typeof review.userId === 'object'
                        ? `${review.userId?.firstname || ''} ${review.userId?.lastname || ''}`.trim() || 'Người dùng ẩn danh'
                        : 'Người dùng ẩn danh'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div>{renderStars(review.rating)}</div>
                {isAuthenticated && (
                  <button
                    onClick={() => setReportingReviewId(review._id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                    title="Báo cáo đánh giá"
                  >
                    <FlagIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {review.comment && (
              <p className="text-gray-700 mt-3 whitespace-pre-line">{review.comment}</p>
            )}
          </div>
        ))}
      </div>

      {/* Report Modal */}
      {reportingReviewId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Báo cáo đánh giá</h2>
            <p className="text-sm text-gray-600 mb-4">
              Vui lòng cung cấp lý do bạn muốn báo cáo đánh giá này.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do báo cáo <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Nhập lý do báo cáo..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setReportingReviewId(null)
                  setReportReason('')
                }}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => handleReport(reportingReviewId)}
                disabled={isSubmitting || !reportReason.trim()}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
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

