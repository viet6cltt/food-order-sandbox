// src/features/owner/components/ShippingFeeForm.tsx
import React, { useState } from 'react';
import { TruckIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const ShippingFeeForm: React.FC = () => {
    // State giả lập dữ liệu đang có
    const [fees, setFees] = useState({
        baseFee: 15000,
        perKm: 5000,
    });

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
                <TruckIcon className="w-6 h-6 text-emerald-600 mr-2" />
                Cài đặt Phí Vận Chuyển
            </h2>
            <p className="text-sm text-gray-500 mb-6">Thiết lập phí giao hàng và ngưỡng miễn phí vận chuyển.</p>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Phí cơ bản */}
                <div className="md:col-span-1">
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
                            className="block w-full pl-7 pr-12 py-3 border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="0"
                            onChange={(e) => setFees({ ...fees, baseFee: Number(e.target.value) })}
                        />
                    </div>
                </div>

                {/* Phí theo Km */}
                <div className="md:col-span-1">
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
                            className="block w-full pl-7 pr-12 py-3 border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="0"
                            onChange={(e) => setFees({ ...fees, perKm: Number(e.target.value) })}
                        />
                    </div>
                </div>

                {/* Nút Lưu */}
                <div className="md:col-span-2 pt-2">
                    <button
                        type="button"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                        onClick={() => toast.success("Đã lưu cấu hình vận chuyển!")}
                    >
                        Lưu Cấu Hình
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ShippingFeeForm;