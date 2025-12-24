import React from 'react';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import FoodForm from '../../food/components/FoodForm';
import OwnerLayout from '../../../layouts/OwnerLayout';

const AddFoodScreen: React.FC = () => {
    return (
        <OwnerLayout>
            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="max-w-3xl mx-auto">
                    {/* Header điều hướng */}
                    <div className="mb-6 flex items-center">
                        <button
                            type="button" 
                            className="mr-4 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 text-gray-600 opacity-75 hover:opacity-100 transition-opacity"
                            onClick={() => window.history.back()}>
                            <ChevronLeftIcon className="w-5 h-5" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Thêm Món Mới</h1>
                    </div>
                    {/* Form chính */}
                    <FoodForm />
                </div>
            </div>
        </OwnerLayout>
    );
};

export default AddFoodScreen;