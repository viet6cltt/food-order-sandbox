import React, { useState } from 'react'

interface AddToCartBarProps {
  itemId?: string
  price: number
  initialQty?: number
  minQty?: number
  maxQty?: number
  className?: string
  loading?: boolean
  onAdd: (payload: { itemId?: string; qty: number }) => void
}

const AddToCartBar: React.FC<AddToCartBarProps> = ({
  itemId,
  price,
  initialQty = 1,
  minQty = 1,
  maxQty = 99,
  className = '',
  loading = false,
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
    if (qty <= 0 || loading) return
    onAdd({ itemId, qty })
  }

  const totalPrice = price * qty

  return (
    <div className={`${className} w-full bg-white shadow-md rounded-t-lg p-4 flex flex-col sm:flex-row items-center gap-4`}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={dec}
          disabled={loading || qty <= minQty}
          aria-label="Giảm số lượng"
          className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center text-lg text-gray-700 hover:bg-gray-50 hover:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          –
        </button>
        <input
          aria-label="Số lượng"
          className="w-16 text-center border-2 border-gray-300 rounded-lg px-2 py-2 font-semibold focus:outline-none focus:border-emerald-500"
          value={qty}
          onChange={onChange}
          inputMode="numeric"
          disabled={loading}
        />
        <button
          type="button"
          onClick={inc}
          disabled={loading || qty >= maxQty}
          aria-label="Tăng số lượng"
          className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center text-lg text-gray-700 hover:bg-gray-50 hover:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          +
        </button>
      </div>

      <div className="flex-1 text-center sm:text-left">
        <div className="text-sm text-gray-600 mb-1">Tổng tiền</div>
        <div className="text-xl font-bold text-emerald-600">{formatPrice(totalPrice)}</div>
      </div>

      <div className="w-full sm:w-auto">
        <button
          type="button"
          onClick={handleAdd}
          disabled={loading || !itemId}
          className="w-full sm:w-auto px-6 py-3 bg-emerald-600 text-white rounded-lg shadow-md hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 font-semibold"
          aria-label="Thêm vào giỏ hàng"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Đang thêm...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Thêm vào giỏ</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

function formatPrice(p: number) {
  try {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)
  } catch {
    return `${p.toLocaleString('vi-VN')} đ`
  }
}

export default AddToCartBar
