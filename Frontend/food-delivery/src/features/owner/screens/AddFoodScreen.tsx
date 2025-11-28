// src/features/food/screens/AddFoodScreen.tsx
import React from 'react';
import OwnerDashboardLayout from '../../owner/OwnerDashboardLayout';
import { PlusIcon } from '@heroicons/react/24/outline';

const AddFoodScreen: React.FC = () => {
    return (
        <OwnerDashboardLayout>
            <div className="p-4 pt-8 max-w-2xl mx-auto pb-20 md:pb-4 bg-white rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <PlusIcon className="w-6 h-6 mr-2" />
                    Thêm Món Ăn Mới
                </h1>

                {/* Form Placeholder */}
                <form className="space-y-6">
                    <input type="text" placeholder="Tên món ăn" className="w-full p-3 border rounded-lg" />
                    <textarea placeholder="Mô tả" className="w-full p-3 border rounded-lg h-24"></textarea>
                    <input type="number" placeholder="Giá (VND)" className="w-full p-3 border rounded-lg" />
                    <div className="h-24 bg-gray-100 rounded-lg flex items-center justify-center border-dashed border-2">
                        [Image Uploader Placeholder]
                    </div>
                    <button type="submit" className="w-full p-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">
                        Lưu Món Ăn
                    </button>
                </form>
            </div>
        </OwnerDashboardLayout>
    );
};

export default AddFoodScreen;