import React from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import type { MenuItemDto } from '../../restaurant/components/FoodItem'

interface FoodInfoProps {
  food: MenuItemDto
  className?: string
}

const FoodInfo: React.FC<FoodInfoProps> = ({ food, className = '' }) => {
  function formatPrice(p: number) {
    try {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)
    } catch {
      return `${p.toLocaleString('vi-VN')} đ`
    }
  }

  function renderStars(rating: number) {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: fullStars }).map((_, i) => (
          <StarIcon key={`full-${i}`} className="w-5 h-5 text-yellow-400" />
        ))}
        {hasHalfStar && <StarIcon className="w-5 h-5 text-yellow-400 opacity-50" />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <StarOutlineIcon key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    )
  }

  return (
    <div className={`${className} bg-white rounded-lg shadow-md overflow-hidden`}>
      <div className="md:flex">
        <div className="md:w-1/2 bg-gray-100 h-64 md:h-96 flex items-center justify-center overflow-hidden">
          {food.imageUrl ? (
            <img
              src={food.imageUrl}
              alt={food.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="text-gray-400">Không có hình ảnh</div>
          )}
        </div>

        <div className="p-6 md:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{food.name}</h1>

          {typeof food.rating === 'number' && food.rating > 0 && (
            <div className="mb-4">{renderStars(food.rating)}</div>
          )}

          <div className="mt-4">
            <p className="text-2xl font-semibold text-emerald-600">{formatPrice(food.price)}</p>
          </div>

          {food.description && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Mô tả</h3>
              <p className="text-gray-600 whitespace-pre-line">{food.description}</p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center gap-2">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                food.isAvailable !== false
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {food.isAvailable !== false ? 'Có sẵn' : 'Hết hàng'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FoodInfo

