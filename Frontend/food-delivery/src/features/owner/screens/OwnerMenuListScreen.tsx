// src/features/owner/screens/OwnerMenuListScreen.tsx
import React from 'react';
import OwnerDashboardLayout from '../OwnerDashboardLayout';
import FoodCardList from '../../food/components/FoodCardList';
import AddFoodButton from '../../food/components/AddFoodButton'; // <-- Import nút mới
import { BookOpenIcon } from '@heroicons/react/24/outline';

const OwnerMenuListScreen: React.FC = () => {
    return (
        <OwnerDashboardLayout>
            <div className="p-4 pt-8 max-w-4xl mx-auto pb-20 md:pb-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
                        <BookOpenIcon className="w-8 h-8 mr-2 text-indigo-600" />
                        Quản lý Menu
                    </h1>
                    {/* THAY THẾ Placeholder bằng nút thật */}
                    <AddFoodButton />
                </div>

                <FoodCardList />
            </div>
        </OwnerDashboardLayout>
    );
};

export default OwnerMenuListScreen;