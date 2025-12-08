// src/features/owner/screens/FoodManagerScreen.tsx
import React from 'react';
// import OwnerDashboardLayout from '../OwnerDashboardLayout'; // Bật lại nếu cần layout
import FoodEditForm from '../../food/components/FoodEditForm';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { type FoodItem } from '../../../types/food';

// Mock data cho món đang sửa
const MOCK_EDIT_FOOD: FoodItem = {
    id: 'f1',
    name: 'Phở Bò Đặc Biệt',
    imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43',
    price: 65000,
    description: 'Phở bò truyền thống với nước dùng hầm xương 24h, thịt bò tươi ngon.',
    isAvailable: true // Đang bán
};

const FoodManagerScreen: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                {/* Header điều hướng */}
                <div className="mb-6 flex items-center">
                    <button className="mr-4 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 text-gray-600">
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Món Ăn</h1>
                        <p className="text-sm text-gray-500">Chỉnh sửa thông tin và trạng thái món.</p>
                    </div>
                </div>

                {/* Form Chỉnh sửa */}
                <FoodEditForm food={MOCK_EDIT_FOOD} />
            </div>
        </div>
    );
};

export default FoodManagerScreen;