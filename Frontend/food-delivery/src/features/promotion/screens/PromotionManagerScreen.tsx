// src/features/promotion/screens/PromotionManagerScreen.tsx
import React, { useState } from 'react';
import PromotionList from '../components/PromotionList';
import PromotionForm from '../components/PromotionForm';
import { TagIcon, PlusIcon } from '@heroicons/react/24/outline';
import type { Promotion } from '../../../types/promotion';

const MOCK_DATA: Promotion[] = [
    { id: '1', code: 'CHAOMOI', name: 'Chào bạn mới', type: 'amount', value: 20000, startDate: '2025-01-01', endDate: '2025-12-31', isActive: true, description: 'Giảm 20k cho đơn đầu tiên' },
    { id: '2', code: 'FREESHIP', name: 'Mã Freeship', type: 'amount', value: 15000, startDate: '2025-02-01', endDate: '2025-02-28', isActive: true, description: 'Miễn phí vận chuyển dưới 3km' },
    { id: '3', code: 'GIAM50', name: 'Giảm 50%', type: 'percent', value: 50, startDate: '2025-03-08', endDate: '2025-03-08', isActive: false, description: 'Flash sale ngày 8/3' },
];

const PromotionManagerScreen: React.FC = () => {
    const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit'>('list');
    const [promotions, setPromotions] = useState<Promotion[]>(MOCK_DATA);
    const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);

    const handleEdit = (promo: Promotion) => {
        setEditingPromo(promo);
        setViewMode('edit');
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa mã khuyến mãi này không?')) {
            const newList = promotions.filter(p => p.id !== id);
            setPromotions(newList);
        }
    };

    // --- HÀM MỚI: Xử lý lưu dữ liệu ---
    const handleSave = (data: Promotion) => {
        if (viewMode === 'create') {
            // Trường hợp TẠO MỚI: Thêm vào mảng
            setPromotions([...promotions, data]);
        } else {
            // Trường hợp SỬA: Tìm và thay thế
            const newList = promotions.map(p => p.id === data.id ? data : p);
            setPromotions(newList);
        }

        // Lưu xong thì quay về danh sách
        setViewMode('list');
        setEditingPromo(null);
    };

    const handleCancel = () => {
        setEditingPromo(null);
        setViewMode('list');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <TagIcon className="w-8 h-8 mr-3 text-green-600" />
                            Quản lý Khuyến Mãi
                        </h1>
                        <p className="text-gray-500 mt-1 ml-11">Tạo combo và mã giảm giá để thu hút khách hàng.</p>
                    </div>

                    {viewMode === 'list' && (
                        <button
                            onClick={() => {
                                setEditingPromo(null); // Reset dữ liệu cũ nếu có
                                setViewMode('create');
                            }}
                            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-sm font-medium"
                        >
                            <PlusIcon className="w-5 h-5 mr-1" />
                            Tạo mới
                        </button>
                    )}
                </div>

                {viewMode === 'list' ? (
                    <PromotionList
                        promotions={promotions}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ) : (
                    <PromotionForm
                        initialData={editingPromo} // Truyền dữ liệu cũ (nếu có) vào form
                        onCancel={handleCancel}
                        onSave={handleSave} // Truyền hàm lưu xuống
                    />
                )}
            </div>
        </div>
    );
};

export default PromotionManagerScreen;