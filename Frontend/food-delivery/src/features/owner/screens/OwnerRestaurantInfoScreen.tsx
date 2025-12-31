// src/features/owner/screens/OwnerRestaurantInfoScreen.tsx
import React from 'react';
// import OwnerDashboardLayout from '../OwnerDashboardLayout'; // Bật lại nếu dùng layout

// Import các components con
import ToggleAcceptOrders from '../components/ToggleAcceptOrders'; // Mới
import OpeningHoursEditor from '../components/OpeningHoursEditor'; // Mới
import ShippingFeeForm from '../components/ShippingFeeForm';       // Đã làm
// Import từ feature FOOD (Menu)
import FoodCardList from '../../food/components/FoodCardList';     // Đã làm
import AddFoodButton from '../../food/components/AddFoodButton';   // Đã làm

import { Cog6ToothIcon, BookOpenIcon } from '@heroicons/react/24/outline';

const OwnerRestaurantInfoScreen: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center mb-6">
                    <div className="p-3 bg-white rounded-full shadow-sm mr-4">
                        <Cog6ToothIcon className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Thiết lập Nhà hàng</h1>
                        <p className="text-gray-500">Quản lý hoạt động, giờ giấc và thực đơn.</p>
                    </div>
                </div>

                {/* PHẦN 1: Cài đặt chung (Trạng thái & Giờ) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ToggleAcceptOrders />
                    {/* Nếu muốn ShippingFeeForm nằm cạnh Toggle thì để ở đây */}
                </div>

                {/* PHẦN 2: Cấu hình chi tiết (Giờ & Ship) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <OpeningHoursEditor />
                    <ShippingFeeForm />
                </div>

                {/* PHẦN 3: Quản lý Menu (Tích hợp lại vào màn hình Info) */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <BookOpenIcon className="w-6 h-6 mr-2 text-indigo-600" />
                            Quản lý Thực đơn
                        </h2>
                        <AddFoodButton />
                    </div>
                    <FoodCardList />
                </div>

            </div>
        </div>
    );
};

export default OwnerRestaurantInfoScreen;