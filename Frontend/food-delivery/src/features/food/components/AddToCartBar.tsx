import React, { useState } from 'react'

interface AddToCartBarProps {
  itemId?: string
  price: number
  initialQty?: number
  minQty?: number
  maxQty?: number
  className?: string
  onAdd: (payload: { itemId?: string; qty: number }) => void
}

const AddToCartBar: React.FC<AddToCartBarProps> = ({
  itemId,
  price,
  initialQty = 1,
  minQty = 1,
  maxQty = 99,
  className = '',
  onAdd,
}) => {
  const [qty, setQty] = useState<number>(Math.max(minQty, initialQty))

  function inc() {
    setQty((s) => Math.min(maxQty, s + 1))
  }

  function dec() {
    setQty((s) => Math.max(minQty, s - 1))
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value || 0)
    if (Number.isNaN(v)) return
    setQty(Math.max(minQty, Math.min(maxQty, Math.floor(v))))
  }

  function handleAdd() {
    if (qty <= 0) return
    onAdd({ itemId, qty })
  }

  return (
    <div className={`${className} w-full bg-white shadow-md rounded-t-lg p-3 flex items-center gap-3`}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={dec}
          aria-label="Decrease quantity"
          className="w-9 h-9 rounded border flex items-center justify-center text-lg text-gray-700 hover:bg-gray-50"
        >
          –
        </button>
        <input
          aria-label="Quantity"
          className="w-14 text-center border rounded px-2 py-1"
          value={qty}
          onChange={onChange}
          inputMode="numeric"
        />
        <button
          type="button"
          onClick={inc}
          aria-label="Increase quantity"
          className="w-9 h-9 rounded border flex items-center justify-center text-lg text-gray-700 hover:bg-gray-50"
        >
          +
        </button>
      </div>

      <div className="flex-1">
        <div className="text-sm text-gray-600">Total</div>
        <div className="text-lg font-semibold">{formatPrice(price * qty)}</div>
      </div>

      <div>
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-emerald-600 text-white rounded shadow hover:bg-emerald-700 disabled:opacity-60"
          aria-label="Add to cart"
        >
          Add to cart
        </button>
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

export default AddToCartBar
