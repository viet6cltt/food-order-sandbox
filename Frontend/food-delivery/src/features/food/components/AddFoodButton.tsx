// src/features/food/components/AddFoodButton.tsx
import React from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

const AddFoodButton: React.FC = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        // Chuyển hướng tới màn hình thêm món ăn
        navigate('/owner/add-food');
    };

    return (
        <button
            onClick={handleClick}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
            <PlusCircleIcon className="w-5 h-5" />
            <span>Thêm Món Mới</span>
        </button>
    );
};

export default AddFoodButton;