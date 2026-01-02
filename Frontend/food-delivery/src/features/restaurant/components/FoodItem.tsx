import React from 'react'
import { StarIcon, PlusIcon } from '@heroicons/react/24/outline'

export type MenuItemDto = {
  _id: string
  name: string
  description?: string
  price: number
  imageUrl?: string
  isAvailable?: boolean
  rating?: number
  restaurantId?: string
}

interface FoodItemProps {
  data?: MenuItemDto
  className?: string
  showAddBar?: boolean
  compact?: boolean
  onAdd?: (payload: { itemId?: string; qty: number }) => void
  onSelect?: (item: MenuItemDto) => void
}

const FoodItem: React.FC<FoodItemProps> = ({
  data,
  className = '',
  compact = false,
  onAdd,
  onSelect,
}) => {
  // Presentational component: requires `data` prop when used in lists.
  const item = data
  if (!item) return <div className={`${className} text-sm text-gray-500`}>No item provided.</div>

  // Compact card used inside lists
  if (compact) {
    return (
      <article className={`${className} rounded-md overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col`}>
        <button
          type="button"
          onClick={() => onSelect && onSelect(item)}
          className="text-left flex-1 flex flex-col"
          aria-label={`View ${item.name}`}
        >
          <div className="h-36 bg-gray-100 flex items-center justify-center overflow-hidden">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-xs text-gray-400">No image</div>
            )}
          </div>
          <div className="p-3">
            <h3 className="text-sm font-semibold text-gray-800 truncate">{item.name}</h3>
            {item.description ? <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p> : null}
          </div>
        </button>

        <div className="px-3 py-2 border-t flex items-center justify-between bg-gray-50">
          <div>
            <div className="text-sm font-medium text-gray-900">{formatPrice(item.price)}</div>
            {typeof item.rating === 'number' && <div className="text-xs text-yellow-600"><StarIcon className="inline w-4 h-4" /> {item.rating.toFixed(1)}</div>}
          </div>
          <div>
            <button
              type="button"
              onClick={() => onAdd && onAdd({ itemId: item._id, qty: 1 })}
              className="inline-flex items-center px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              <PlusIcon className="w-4 h-4 mr-1" /> Add
            </button>
          </div>
        </div>
      </article>
    )
  }

  return (
    <div className={`${className} bg-white rounded shadow overflow-hidden`}>
      <div className="md:flex">
        <div className="md:w-1/2 bg-gray-100 h-64 flex items-center justify-center overflow-hidden">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-gray-400">No image</div>
          )}
        </div>

        <div className="p-4 md:w-1/2">
          <h2 className="text-2xl font-bold">{item.name}</h2>
          {typeof item.rating === 'number' && (
            <div className="text-sm text-yellow-600 mt-2"><StarIcon className="inline w-4 h-4" /> {item.rating.toFixed(1)}</div>
          )}
          <p className="text-sm text-gray-600 mt-4">{item.description}</p>
          <div className="mt-4 text-xl font-semibold">{formatPrice(item.price)}</div>
        </div>
      </div>
    </div>
  )
}

function formatPrice(p: number) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(p)
  } catch {
    return `$${p.toFixed(2)}`
  }
}

export default FoodItem;
