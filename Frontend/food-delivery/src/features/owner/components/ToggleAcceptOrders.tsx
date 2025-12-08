// src/features/owner/components/ToggleAcceptOrders.tsx
import React, { useState } from 'react';

const ToggleAcceptOrders: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <h3 className="text-lg font-bold text-gray-900">Trạng thái Nhà hàng</h3>
                <p className={`text-sm font-medium ${isOpen ? 'text-green-600' : 'text-red-500'}`}>
                    {isOpen ? 'Đang mở cửa - Nhận đơn' : 'Đang đóng cửa - Tạm ngưng'}
                </p>
            </div>

            {/* Toggle Switch Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${isOpen ? 'bg-green-500' : 'bg-gray-300'
                    }`}
            >
                <span className="sr-only">Toggle shop status</span>
                <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isOpen ? 'translate-x-7' : 'translate-x-1'
                        }`}
                />
            </button>
        </div>
    );
};

export default ToggleAcceptOrders;