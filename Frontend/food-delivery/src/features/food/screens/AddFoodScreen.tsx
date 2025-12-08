// src/features/food/screens/AddFoodScreen.tsx
import React from 'react';
// import OwnerDashboardLayout from '../../owner/OwnerDashboardLayout'; // Bỏ comment nếu muốn dùng Layout
import FoodForm from '../components/FoodForm';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

const AddFoodScreen: React.FC = () => {
    return (
        // Dùng div bao ngoài an toàn thay vì Layout để tránh lỗi import
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6 flex items-center">
                    <button className="mr-4 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 text-gray-600">
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Thêm Món Mới</h1>
                </div>

                <FoodForm />
            </div>
        </div>
    );
};

export default AddFoodScreen;