import React, { useState, useEffect } from "react";
import CheckboxButton from "../../../components/ui/CheckboxButton";
import { getRestaurantById } from "../../restaurant/api";

interface PaymentMethodProps {
    className?: string;
    restaurantId: string;
    paymentMethod: 'COD' | 'BANK_TRANSFER';
    onPaymentMethodChange?: (method: 'COD' | 'BANK_TRANSFER') => void;
}

interface BankInfo {
    code: string;
    AccountNumber: string;
    logoUrl?: string;
}

interface RestaurantPaymentInfo {
    bankName?: string;
    bankAccountNumber?: string;
    bankAccountName?: string;
    qrImageUrl?: string;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ className = '', restaurantId, paymentMethod, onPaymentMethodChange }) => {
    const [page, setPage] = useState<number>(paymentMethod === 'BANK_TRANSFER' ? 1 : 0);
    const [selectedBank, setSelectedBank] = useState<string | null>(null);
    const [restaurantPaymentInfo, setRestaurantPaymentInfo] = useState<RestaurantPaymentInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRestaurantInfo = async () => {
            try {
                const restaurant = await getRestaurantById(restaurantId);
                if (restaurant.paymentInfo) {
                    setRestaurantPaymentInfo(restaurant.paymentInfo);
                    // Build bank list from restaurant payment info
                    if (restaurant.paymentInfo.bankName && restaurant.paymentInfo.bankAccountNumber) {
                        const bankCode = restaurant.paymentInfo.bankName.substring(0, 3).toUpperCase();
                        
                        // If paymentMethod is BANK_TRANSFER, select this bank
                        if (paymentMethod === 'BANK_TRANSFER') {
                            setSelectedBank(bankCode);
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to load restaurant payment info:', err);
            } finally {
                setLoading(false);
            }
        };

        loadRestaurantInfo();
    }, [restaurantId, paymentMethod]);

    const listBanks: BankInfo[] = restaurantPaymentInfo?.bankName && restaurantPaymentInfo?.bankAccountNumber
        ? [{
            code: restaurantPaymentInfo.bankName.substring(0, 3).toUpperCase(),
            AccountNumber: restaurantPaymentInfo.bankAccountNumber.length > 4 
                ? `*${restaurantPaymentInfo.bankAccountNumber.slice(-3)}` 
                : restaurantPaymentInfo.bankAccountNumber,
            logoUrl: restaurantPaymentInfo.qrImageUrl || undefined
        }]
        : [];

    const onSelectBank = (bankCode: string, checked: boolean) => {
        if (checked) {
            setSelectedBank(bankCode);
            if (onPaymentMethodChange) {
                onPaymentMethodChange('BANK_TRANSFER');
            }
        } else {
            setSelectedBank(null);
        }
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        if (onPaymentMethodChange) {
            onPaymentMethodChange(newPage === 0 ? 'COD' : 'BANK_TRANSFER');
        }
    }

    if (loading) {
        return (
            <div className={`${className} bg-white`}>
                <div className="p-6 text-center text-gray-500">
                    Đang tải thông tin thanh toán...
                </div>
            </div>
        );
    }

    return (
        <div className={`${className} bg-white`}>
            <div className="flex flex-row gap-4 border-b border-gray-300 p-4 flex-wrap">
                <h2 className="p-4">Phương thức thanh toán</h2>
                <button
                    className={`p-2 m-2 border ${page === 0 ? 'border-emerald-600 text-emerald-600' : 'border-gray-300'} text-center hover:cursor-pointer hover:border-emerald-600 hover:text-emerald-600 transition`}
                    onClick={() => handlePageChange(0)}
                >
                    Thanh toán khi nhận hàng
                </button>
                <button
                    className={`p-2 m-2 border ${page === 1 ? 'border-emerald-600 text-emerald-600' : 'border-gray-300'} text-center hover:cursor-pointer hover:border-emerald-600 hover:text-emerald-600 transition`}
                    onClick={() => handlePageChange(1)}
                >
                    Thanh toán bằng ngân hàng
                </button>
            </div>
            <div className="mt-4">
                {page === 0 && (
                    <div className="p-6 mb-4 text-sm bg-white">
                        <p>Thanh toán khi nhận hàng - hãy thanh toán khi shipper giao hàng tới</p>
                    </div> 
                )}
                {page === 1 && (
                    <div>
                        {listBanks.length > 0 ? (
                            listBanks.map((bank) => (
                                <div key={bank.code} className="flex flex-row p-6 mb-4 bg-white items-center">
                                    <div>
                                        <CheckboxButton checked={selectedBank === bank.code} onChange={(c) => onSelectBank(bank.code, c)} />
                                    </div>
                                    {bank.logoUrl && (
                                        <div>
                                            <img src={bank.logoUrl} alt={bank.code} className="h-10 w-10 mx-4" />
                                        </div>
                                    )}
                                    <div>
                                        <div>
                                            <p className="font-medium">{restaurantPaymentInfo?.bankName || bank.code}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">{bank.AccountNumber}</p>
                                        </div>
                                        {restaurantPaymentInfo?.bankAccountName && (
                                            <div>
                                                <p className="text-gray-500 text-sm">Chủ tài khoản: {restaurantPaymentInfo.bankAccountName}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 mb-4 text-center">
                                <div className="inline-block p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-sm text-yellow-800 font-medium">
                                        Hiện tại nhà hàng này chưa hỗ trợ chuyển khoản ngân hàng
                                    </p>
                                </div>
                            </div>
                        )}

                        {listBanks.length > 0 && selectedBank && restaurantPaymentInfo?.qrImageUrl && (
                            <div className="p-6">
                                <p className="text-sm text-gray-600 mb-3">Quét mã QR để chuyển khoản</p>
                                <div className="flex justify-center">
                                    <img
                                        src={restaurantPaymentInfo.qrImageUrl}
                                        alt="QR thanh toán"
                                        className="w-64 h-64 object-contain border border-gray-200 rounded"
                                    />
                                </div>
                                {restaurantPaymentInfo?.bankAccountNumber && (
                                    <p className="text-xs text-gray-500 mt-3 text-center">
                                        STK: {restaurantPaymentInfo.bankAccountNumber}
                                        {restaurantPaymentInfo?.bankAccountName ? ` - ${restaurantPaymentInfo.bankAccountName}` : ''}
                                    </p>
                                )}
                            </div>
                        )}
                    </div> 
                )}
            </div>
        </div>
    );
};

export default PaymentMethod;