import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { geocodeAddress } from '../../../services/geocodeApi';

interface ChangeAddressFormProps {
    currentAddress?: { full: string; lat: number; lng: number } | null;
    onClose: () => void;
    onSuccess: (address: { full: string; lat: number; lng: number }) => void;
}

const ChangeAddressForm: React.FC<ChangeAddressFormProps> = ({
    currentAddress,
    onClose,
    onSuccess,
}) => {
    const [fullAddress, setFullAddress] = useState<string>(currentAddress?.full || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullAddress.trim()) {
            toast.error('Vui lòng nhập địa chỉ');
            return;
        }

        try {
            setLoading(true);

            const q = fullAddress.trim();
            let newAddress: { full: string; lat: number; lng: number };
            try {
                const geo = await geocodeAddress(q);
                newAddress = {
                    full: geo.formatted || q,
                    lat: geo.lat,
                    lng: geo.lng,
                };
            } catch {
                // Allow user to proceed even if geocoding is temporarily unavailable.
                // Backend will attempt to geocode again when placing the order.
                newAddress = { full: q, lat: 0, lng: 0 };
                toast.warn('Không thể định vị địa chỉ lúc này. Sẽ xử lý khi đặt hàng.');
            }

            // Just update local state, don't call API here
            // API will be called when user clicks "Đặt hàng"
            toast.success('Đã cập nhật địa chỉ');
            onSuccess(newAddress);
            onClose();
        } catch (err: unknown) {
            let errorMessage = 'Không thể cập nhật địa chỉ';
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as { response?: { data?: { message?: string; error?: string }; status?: number } };
                if (axiosError.response?.status === 401) {
                    toast.error('Phiên đăng nhập đã hết hạn');
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
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-opacity-100">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Thay đổi địa chỉ nhận hàng</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                        disabled={loading}
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label htmlFor="fullAddress" className="block text-sm font-medium text-gray-700 mb-1">
                            Địa chỉ đầy đủ <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="fullAddress"
                            value={fullAddress}
                            onChange={(e) => setFullAddress(e.target.value)}
                            placeholder="Ví dụ: Số 1, Đường ABC, Phường XYZ, Quận 123, Hà Nội"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            rows={4}
                            required
                            disabled={loading}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Vui lòng nhập địa chỉ chi tiết để đảm bảo giao hàng chính xác
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !fullAddress.trim()}
                            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Đang lưu...</span>
                                </>
                            ) : (
                                'Lưu địa chỉ'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangeAddressForm;

