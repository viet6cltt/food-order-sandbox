import React, { useState } from 'react';
import { PlusIcon, MegaphoneIcon } from '@heroicons/react/24/outline';
import PromotionList from '../components/PromotionList';
import PromotionForm, { type Promotion } from '../components/PromotionForm';

// Dữ liệu mẫu
const MOCK_PROMOTIONS: Promotion[] = [
    { id: '1', name: 'Chào hè rực rỡ', code: 'SUMMER2025', type: 'percent', value: 20, startDate: '2025-06-01', endDate: '2025-06-30', isActive: true },
    { id: '2', name: 'Giảm giá vận chuyển', code: 'FREESHIP', type: 'fixed', value: 15000, startDate: '2025-01-01', endDate: '2025-12-31', isActive: true },
    { id: '3', name: 'Flash Sale Trưa', code: 'TRUA10K', type: 'fixed', value: 10000, startDate: '2025-05-01', endDate: '2025-05-05', isActive: false },
];

const PromotionComboScreen: React.FC = () => {
    const [promotions, setPromotions] = useState<Promotion[]>(MOCK_PROMOTIONS);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Promotion | null>(null);

    // Xử lý Lưu (Tạo mới hoặc Cập nhật)
    const handleSave = (data: Promotion) => {
        if (editingItem) {
            // Cập nhật
            setPromotions(prev => prev.map(p => p.id === data.id ? data : p));
        } else {
            // Tạo mới
            setPromotions(prev => [data, ...prev]);
        }
        setIsFormOpen(false);
        setEditingItem(null);
    };

    // Xử lý Sửa
    const handleEdit = (item: Promotion) => {
        setEditingItem(item);
        setIsFormOpen(true);
    };

    // Xử lý Xóa
    const handleDelete = (id: string) => {
        if (window.confirm('Bạn có chắc muốn xóa khuyến mãi này?')) {
            setPromotions(prev => prev.filter(p => p.id !== id));
        }
    };

    // Xử lý Bật/Tắt
    const handleToggleActive = (id: string) => {
        setPromotions(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <MegaphoneIcon className="w-7 h-7 mr-2 text-green-600" />
                        Chương Trình Khuyến Mãi
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Tạo mã giảm giá để thu hút khách hàng.</p>
                </div>
                <button
                    onClick={() => { setEditingItem(null); setIsFormOpen(true); }}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-sm transition active:scale-95"
                >
                    <PlusIcon className="w-5 h-5 mr-1" /> Tạo Khuyến Mãi
                </button>
            </div>

            {/* Danh sách */}
            <PromotionList
                promotions={promotions}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
            />

            {/* Popup Form */}
            {isFormOpen && (
                <PromotionForm
                    initialData={editingItem}
                    onClose={() => { setIsFormOpen(false); setEditingItem(null); }}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default PromotionComboScreen;