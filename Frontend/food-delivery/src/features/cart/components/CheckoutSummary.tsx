import React from 'react'

interface CheckoutSummaryProps {
  totalItems: number
  totalPrice: number
  shippingFee?: number
  onCheckout: () => void
  isLoading?: boolean
  disabled?: boolean
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  totalItems,
  totalPrice,
  shippingFee = 0,
  onCheckout,
  isLoading = false,
  disabled = false,
}) => {
  const finalTotal = totalPrice + shippingFee

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Tổng kết</h2>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-gray-600">
          <span>Số lượng món</span>
          <span>{totalItems}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Tạm tính</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>

        {shippingFee > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Phí vận chuyển</span>
            <span>{formatPrice(shippingFee)}</span>
          </div>
        )}

        <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
          <span>Tổng cộng</span>
          <span>{formatPrice(finalTotal)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        disabled={disabled || isLoading || totalItems === 0}
        className="w-full py-3 px-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Đang xử lý...' : 'Đặt hàng'}
      </button>
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

export default CheckoutSummary

