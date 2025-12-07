// src/types/promotion.ts
export type Promotion = {
    id: string;
    code: string;        // Mã giảm giá (VD: SUMMER2025)
    name: string;        // Tên chương trình
    type: 'percent' | 'amount'; // Giảm theo % hay số tiền cố định
    value: number;       // Giá trị giảm (10% hoặc 15.000đ)
    startDate: string;
    endDate: string;
    isActive: boolean;
    description?: string;
};