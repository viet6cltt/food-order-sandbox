import React from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

const AddFoodButton: React.FC = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate('/owner/add-food')}
            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm"
        >
            <PlusIcon className="w-5 h-5 mr-1" />
            Thêm món mới
        </button>
    );
};
export default AddFoodButton;