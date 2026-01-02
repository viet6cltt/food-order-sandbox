// src/features/owner/components/ShippingFeeForm.tsx
import React, { useState } from 'react';
import { TruckIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const ShippingFeeForm: React.FC = () => {
    // State giả lập dữ liệu đang có
    const [fees, setFees] = useState({
        baseFee: 15000,
        perKm: 5000,
        freeShipFrom: 200000
    });

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <TruckIcon className="w-6 h-6 text-green-600 mr-2" />
                Cài đặt Phí Vận Chuyển
            </h2>

            <form className="space-y-5">
                {/* Phí cơ bản */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phí giao hàng cơ bản (cho 3km đầu)
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">₫</span>
                        </div>
                        <input
                            type="number"
                            value={fees.baseFee}
                            className="block w-full pl-7 pr-12 py-3 border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                            placeholder="0"
                            onChange={(e) => setFees({ ...fees, baseFee: Number(e.target.value) })}
                        />
                    </div>
                </div>

                {/* Phí theo Km */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phí thêm mỗi Km tiếp theo
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">₫</span>
                        </div>
                        <input
                            type="number"
                            value={fees.perKm}
                            className="block w-full pl-7 pr-12 py-3 border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                            placeholder="0"
                            onChange={(e) => setFees({ ...fees, perKm: Number(e.target.value) })}
                        />
                    </div>
                </div>

                {/* Freeship */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Miễn phí vận chuyển cho đơn từ
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="number"
                            value={fees.freeShipFrom}
                            className="block w-full pl-10 pr-12 py-3 border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                            placeholder="Nhập số tiền"
                            onChange={(e) => setFees({ ...fees, freeShipFrom: Number(e.target.value) })}
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Khách hàng sẽ được Freeship nếu tổng đơn hàng vượt quá số tiền này.</p>
                </div>

                {/* Nút Lưu */}
                <div className="pt-4">
                    <button
                        type="button"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        onClick={() => alert("Đã lưu cấu hình vận chuyển!")}
                    >
                        Lưu Cấu Hình
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ShippingFeeForm;