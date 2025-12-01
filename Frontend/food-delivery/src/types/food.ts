// src/types/food.ts (Chỉ thay đổi phần FoodItem)

// ... các type Restaurant và Order giữ nguyên ...

export type FoodItem = {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
    description: string; // Thêm mô tả chi tiết
    isAvailable: boolean; // Trạng thái còn/hết hàng
};