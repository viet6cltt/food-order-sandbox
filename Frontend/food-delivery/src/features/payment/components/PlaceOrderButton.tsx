import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { Order } from '../../../types/order';
import * as orderApi from '../../order/api';
import * as paymentApi from '../api';

interface PlaceOrderButtonProps {
    className?: string;
    order: Order;
    paymentMethod: 'COD' | 'BANK_TRANSFER';
    deliveryAddress: { full: string; lat: number; lng: number } | null;
    shippingFee?: number;
}

const PlaceOrderButton: React.FC<PlaceOrderButtonProps> = ({ 
    className = '', 
    order,
    paymentMethod,
    deliveryAddress,
    shippingFee: shippingFeeProp,
}) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const basePrice = order.totalFoodPrice || 0;
    const shippingFee = typeof shippingFeeProp === 'number' ? shippingFeeProp : (order.shippingFee || 0);
    const totalPrice = basePrice + shippingFee;

    const fmt = (v: number) => v.toLocaleString('vi-VN') + '₫';

    const handleClickOrder = async () => {
        if (!deliveryAddress) {
            toast.error('Vui lòng chọn địa chỉ nhận hàng');
            return;
        }

        try {
            setLoading(true);

            let updatedOrder: Order;
            try {
                updatedOrder = await orderApi.updateOrderInfo(order._id, {
                    deliveryAddress: deliveryAddress,
                    paymentMethod,
                });
            } catch (err: unknown) {
                // If order is already pending/draft updated (e.g., user retries), fall back to fetching
                const maybeAxios = err && typeof err === 'object' && 'response' in err;
                const message = maybeAxios
                    ? (err as any).response?.data?.message || (err as any).response?.data?.error
                    : (err instanceof Error ? err.message : '');

                if (String(message || '').includes('update order info')) {
                    updatedOrder = await orderApi.getOrder(order._id);
                } else {
                    throw err;
                }
            }

            // Step 2: If payment method is BANK_TRANSFER, ensure payment record exists
            if (paymentMethod === 'BANK_TRANSFER') {
                const existing = await paymentApi.getPaymentByOrder(updatedOrder._id);
                if (!existing) {
                    await paymentApi.createPayment({
                        orderId: updatedOrder._id,
                    });
                }
            }

            toast.success('Đặt hàng thành công!');
            
            // Navigate to order list
            navigate('/order-list');
        } catch (err: unknown) {
            let errorMessage = 'Không thể đặt hàng';
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as { response?: { data?: { message?: string; error?: string }; status?: number } };
                if (axiosError.response?.status === 401) {
                    navigate('/auth/login');
                    return;
                } else {
                    errorMessage = axiosError.response?.data?.message || 
                                   axiosError.response?.data?.error || 
                                   errorMessage;
                }
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={`${className} w-full bg-[#fffefb] p-4`}> 
            <div className="max-w-full mx-auto items-center sm:items-start justify-between gap-4">
                <div className="hidden sm:flex flex-col text-right mb-4 sm:mb-0 p-2 border-b border-dashed border-gray-300">
                    <div className="text-sm text-gray-600">
                        <div>Tổng tiền hàng</div>
                        <div className="font-medium">{fmt(basePrice)}</div>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                        <div>Tổng tiền phí vận chuyển</div>
                        <div className="font-medium">{fmt(shippingFee)}</div>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                        <div className="text-sm">Tổng thanh toán</div>
                        <div className="text-2xl text-green-600 font-semibold">{fmt(totalPrice)}</div>
                    </div>
                </div>

                <div className="flex flex-row p-2">
                    <div className="flex-1 text-xs text-gray-600">
                        <p>Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo <a href="#" className="text-blue-600 underline">Điều khoản</a></p>
                    </div>
                    <button 
                        onClick={handleClickOrder}
                        disabled={loading || !deliveryAddress}
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-md shadow-md transition flex items-center gap-2">
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Đang xử lý...</span>
                            </>
                        ) : (
                            'Đặt hàng'
                        )}
                    </button>
                    <div className="sm:hidden mt-3 w-full text-center text-sm text-gray-700">
                        <div className="font-medium">{fmt(totalPrice)}</div>
                    </div>
                </div>  
            </div>
        </div>
    );
};

export default PlaceOrderButton;