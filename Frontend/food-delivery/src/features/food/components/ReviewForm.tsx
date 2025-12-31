import React, { useState } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import useAuth from '../../../hooks/useAuth'

interface ReviewFormProps {
  onSubmit: (payload: { rating: number; comment?: string }) => Promise<void>
  className?: string
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, className = '' }) => {
  const { isAuthenticated } = useAuth()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!isAuthenticated) {
    return (
      <div className={`${className} bg-white rounded-lg shadow-md p-6`}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Viết đánh giá</h2>
        <p className="text-gray-500">Vui lòng đăng nhập để viết đánh giá.</p>
      </div>
    )
  }

  function handleStarClick(starRating: number) {
    setRating(starRating)
    setError(null)
  }

  function handleStarHover(starRating: number) {
    setHoveredRating(starRating)
  }

  function handleStarLeave() {
    setHoveredRating(0)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (rating === 0) {
      setError('Vui lòng chọn số sao đánh giá')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      setSuccess(false)

      await onSubmit({ rating, comment: comment.trim() || undefined })

      // Reset form
      setRating(0)
      setComment('')
      setSuccess(true)

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể gửi đánh giá. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayRating = hoveredRating || rating

  return (
    <div className={`${className} bg-white rounded-lg shadow-md p-6`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Viết đánh giá</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          Cảm ơn bạn đã đánh giá!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đánh giá của bạn
          </label>
          <div
            className="flex items-center gap-1"
            onMouseLeave={handleStarLeave}
          >
            {Array.from({ length: 5 }).map((_, i) => {
              const starValue = i + 1
              const isFilled = starValue <= displayRating

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleStarClick(starValue)}
                  onMouseEnter={() => handleStarHover(starValue)}
                  className="focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded"
                  aria-label={`${starValue} sao`}
                >
                  {isFilled ? (
                    <StarIcon className="w-8 h-8 text-yellow-400 transition-colors" />
                  ) : (
                    <StarOutlineIcon className="w-8 h-8 text-gray-300 transition-colors" />
                  )}
                </button>
              )
            })}
            {rating > 0 && (
              <span className="ml-2 text-sm text-gray-600">{rating} sao</span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Nhận xét (tùy chọn)
          </label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-gray-400"
            placeholder="Chia sẻ trải nghiệm của bạn về món ăn này..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
        </button>
      </form>
    </div>
  )
}

export default ReviewForm

