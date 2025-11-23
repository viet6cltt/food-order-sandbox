import React from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import type { Review } from '../api'

interface ReviewListProps {
  reviews: Review[]
  className?: string
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, className = '' }) => {
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
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-600 font-semibold">
                      {review.userName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {review.userName || 'Người dùng ẩn danh'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
              <div>{renderStars(review.rating)}</div>
            </div>

            {review.comment && (
              <p className="text-gray-700 mt-3 whitespace-pre-line">{review.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReviewList

