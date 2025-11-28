// src/features/food/components/FoodCard.tsx
import React from 'react';
import { type FoodItem } from '../../../types/food';
import { EyeIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

interface FoodCardProps {
    food: FoodItem;
}

const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden flex">
            {/* Ảnh (1/3 chiều rộng) */}
            <div className="w-1/3 h-full flex-shrink-0">
                <img
                    src={food.imageUrl || 'https://via.placeholder.com/150'}
                    alt={food.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            </div>

            {/* Nội dung (2/3 chiều rộng) */}
            <div className="w-2/3 p-4 flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 truncate">{food.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{food.description}</p>
                </div>

                <div className="mt-3 flex justify-between items-center">
                    {/* Giá tiền */}
                    <p className="text-xl font-extrabold text-red-600">{food.price.toLocaleString('vi-VN')}₫</p>
                    {/* Nút Chỉnh sửa/Xem */}
                    <div className="flex space-x-2">
                        <button className="text-gray-500 hover:text-gray-700" title="Chỉnh sửa">
                            <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700" title="Xem chi tiết">
                            <EyeIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                {/* Trạng thái Hết hàng */}
                {food.isAvailable ? null : (
                    <div className="text-xs text-red-500 font-semibold mt-1">Hết hàng</div>
                )}
            </div>
        </div>
    );
};

export default FoodCard;