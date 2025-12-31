import React from 'react'
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import type { CartItem } from '../api'

interface CartListProps {
  items: CartItem[]
  onUpdateQty: (itemId: string, qty: number) => void
  onRemove: (itemId: string) => void
}

const CartList: React.FC<CartListProps> = ({ items, onUpdateQty, onRemove }) => {
  if (!items || items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Giỏ hàng trống</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item._id}
          className="bg-white rounded-lg shadow-sm p-4 flex gap-4"
        >
          {item.imageUrl && (
            <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-gray-100">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
            
            {item.selectedOptions && item.selectedOptions.length > 0 && (
              <div className="mt-1 text-sm text-gray-600">
                {item.selectedOptions.map((opt, idx) => (
                  <span key={idx}>
                    {opt.optionName}
                    {idx < item.selectedOptions.length - 1 && ', '}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-2 flex items-center justify-between">
              <div className="text-lg font-semibold text-gray-900">
                {formatPrice(item.finalPrice)}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateQty(item._id, Math.max(1, item.qty - 1))}
                  className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-50"
                  aria-label="Decrease quantity"
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{item.qty}</span>
                <button
                  type="button"
                  onClick={() => onUpdateQty(item._id, item.qty + 1)}
                  className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-50"
                  aria-label="Increase quantity"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item._id)}
            className="self-start p-2 text-red-600 hover:bg-red-50 rounded"
            aria-label="Remove item"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  )
}

function formatPrice(price: number): string {
  try {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  } catch {
    return `${price.toLocaleString()} ₫`
  }
}

export default CartList

