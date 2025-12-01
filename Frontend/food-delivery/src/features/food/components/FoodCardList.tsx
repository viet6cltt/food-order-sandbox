// src/features/food/components/FoodCardList.tsx
import React from 'react';
import { type FoodItem } from '../../../types/food';
import FoodCard from './FoodCard';

// Dữ liệu giả lập (Mock Data)
const MOCK_FOODS: FoodItem[] = [
    { id: 'f1', name: 'Phở Bò Đặc Biệt', imageUrl: 'https://picsum.photos/150?random=11', price: 65000, description: 'Phở bò truyền thống, nước dùng đậm đà, bánh phở mềm.', isAvailable: true },
    { id: 'f2', name: 'Bánh Mì Pate Trứng', imageUrl: 'https://picsum.photos/150?random=12', price: 25000, description: 'Bánh mì giòn rụm, đầy ắp thịt, chả, và pate béo ngậy.', isAvailable: true },
    { id: 'f3', name: 'Trà Chanh Mật Ong', imageUrl: 'https://picsum.photos/150?random=13', price: 30000, description: 'Trà tươi mát, vị chua ngọt cân bằng, hiện đang tạm hết nguyên liệu.', isAvailable: false },
    { id: 'f4', name: 'Gà Rán Giòn', imageUrl: 'https://picsum.photos/150?random=14', price: 45000, description: 'Miếng gà được tẩm ướp đặc biệt và rán giòn tan.', isAvailable: true },
];

const FoodCardList: React.FC = () => {
    return (
        <div className="space-y-4">
            {MOCK_FOODS.map(food => (
                <FoodCard key={food.id} food={food} />
            ))}
        </div>
    );
};

export default FoodCardList;