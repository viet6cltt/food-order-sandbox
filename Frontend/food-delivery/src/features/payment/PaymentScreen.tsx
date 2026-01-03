import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import AppLayout from "../../layouts/AppLayout";
import AddressSelector from "./components/AddressSelector";
import PaymentMethod from "./components/PaymentMethod";
import PlaceOrderButton from "./components/PlaceOrderButton";
import ChangeAddressForm from "./components/ChangeAddressForm";
import * as profileApi from '../profile/api';
import * as orderApi from '../order/api';
import * as geocodeApi from '../../services/geocodeApi';
import type { Order } from '../../types/order';

const PaymentScreen: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BANK_TRANSFER'>('COD');
    const [deliveryAddress, setDeliveryAddress] = useState<{ full: string; lat: number; lng: number } | null>(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    
    const geocodeOrFallback = async (full: string) => {
        const trimmed = (full || '').trim();
        if (!trimmed) return null;
        try {
            const geo = await geocodeApi.geocodeAddress(trimmed);
            return { full: geo.formatted || trimmed, lat: geo.lat, lng: geo.lng };
        } catch (e) {
            // If geocode fails, still allow user to proceed; backend will attempt again on place order.
            return { full: trimmed, lat: 0, lng: 0 };
        }
    };

    useEffect(() => {
        const loadOrder = async () => {
            if (!orderId) {
                setError('Không tìm thấy mã đơn hàng');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                // Load order from backend
                const orderData = await orderApi.getOrder(orderId);
                setOrder(orderData);
                
                // Set payment method from order or default to COD
                setPaymentMethod(orderData.paymentMethod || 'COD');
                
                // Load user profile to get default delivery address
                try {
                    const userData = await profileApi.getMe();
                    let profileAddressText = '';
                    
                    if (userData.address?.street) {
                        profileAddressText = `${userData.address.street}${userData.address.city ? `, ${userData.address.city}` : ''}`.trim();
                    }
                    
                    const seedFull = orderData.deliveryAddress?.full || profileAddressText || '';
                    const geoAddress = await geocodeOrFallback(seedFull);
                    setDeliveryAddress(geoAddress);
                    
                    // If no address text, show form to enter address
                    if (!seedFull.trim()) {
                        setShowAddressForm(true);
                    }
                } catch (profileErr) {
                    console.error('Failed to load user profile:', profileErr);
                    // Use order's delivery address if exists
                    if (orderData.deliveryAddress?.full) {
                        const geoAddress = await geocodeOrFallback(orderData.deliveryAddress.full);
                        setDeliveryAddress(geoAddress);
                    } else {
                        setShowAddressForm(true);
                    }
                }
            } catch (err: unknown) {
                let errorMessage = 'Không thể tải thông tin đơn hàng';
                if (err && typeof err === 'object' && 'response' in err) {
                    const axiosError = err as { response?: { data?: { message?: string; error?: string }; status?: number } };
                    if (axiosError.response?.status === 401) {
                        navigate('/login');
                        return;
                    } else if (axiosError.response?.status === 404) {
                        errorMessage = 'Không tìm thấy đơn hàng';
                    } else {
                        errorMessage = axiosError.response?.data?.message || 
                                       axiosError.response?.data?.error || 
                                       errorMessage;
                    }
                } else if (err instanceof Error) {
                    errorMessage = err.message;
                }
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        loadOrder();
    }, [orderId, navigate]);

    // Auto-open address form if no address is set after loading completes
    useEffect(() => {
        if (!loading && !deliveryAddress && order) {
            setShowAddressForm(true);
        }
    }, [loading, deliveryAddress, order]);

    if (loading) {
        return (
            <AppLayout>
                <div className="flex flex-col min-h-screen justify-center items-center bg-gray-100">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (error || !order) {
        return (
            <AppLayout>
                <div className="flex flex-col min-h-screen justify-center items-center bg-gray-100">
                    <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow">
                        <p className="text-red-500 mb-4">{error || 'Không tìm thấy đơn hàng'}</p>
                        <button
                            onClick={() => navigate('/cart')}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                        >
                            Quay lại giỏ hàng
                        </button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="flex flex-col min-h-screen justify-center items-center bg-gray-100">
                <header className="font-bold text-xl bg-white w-full p-4 mb-2">
                    <div className="items-center justify-center flex">
                        <h1>Thanh toán đơn hàng</h1>
                    </div>
                </header>
                <main className="flex-grow w-full max-w-7xl p-2">
                    <section className="mb-6">
                        <AddressSelector 
                            deliveryAddress={deliveryAddress}
                            onAddressChange={(address) => {
                                setDeliveryAddress(address);
                                setShowAddressForm(false);
                                // Only update local state, don't call API here
                            }}
                            onRequestChange={() => {
                                setShowAddressForm(true);
                            }}
                        />
                    </section>
                    <section className="mb-6">
                        <PaymentMethod 
                            restaurantId={order.restaurantId}
                            paymentMethod={paymentMethod}
                            onPaymentMethodChange={(method) => {
                                setPaymentMethod(method);
                                // Only update local state, don't call API here
                            }}
                        />
                    </section>
                    <section>
                        <PlaceOrderButton 
                            order={order}
                            paymentMethod={paymentMethod}
                            deliveryAddress={deliveryAddress}
                        />
                    </section>
                </main>
                {showAddressForm && (
                    <ChangeAddressForm
                        currentAddress={deliveryAddress}
                        onClose={() => {
                            // Only allow closing if address is already set
                            // If no address, user must enter one before closing
                            if (deliveryAddress) {
                                setShowAddressForm(false);
                            } else {
                                // Show warning if trying to close without address
                                toast.error('Vui lòng nhập địa chỉ nhận hàng để tiếp tục');
                            }
                        }}
                        onSuccess={(address) => {
                            setDeliveryAddress(address);
                            setShowAddressForm(false);
                            // Only update local state, don't call API here
                        }}
                    />
                )}
            </div>
        </AppLayout>
    )
}

export default PaymentScreen;