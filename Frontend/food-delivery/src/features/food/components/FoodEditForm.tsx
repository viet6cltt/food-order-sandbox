/**
 * Form chỉnh sửa thông tin món ăn.
 * Bao gồm các trường nhập liệu, Toggle trạng thái và nút Xóa.
 */
import React, { useState } from 'react';
import { type FoodItem } from '../../../types/food';
import StatusToggle from './StatusToggle';
import DeleteConfirmModal from './DeleteConfirmModal';
import { PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';

interface FoodEditFormProps {
    food: FoodItem; // Dữ liệu món ăn cần sửa
}

const FoodEditForm: React.FC<FoodEditFormProps> = ({ food }) => {
    // State lưu dữ liệu form
    const [formData, setFormData] = useState<FoodItem>(food);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Xử lý thay đổi input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">

            {/* Header: Tiêu đề + Nút xóa */}
            <div className="flex justify-between items-start mb-6">
                <h2 className="text-lg font-bold text-gray-900">Chỉnh sửa món ăn</h2>
                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                    title="Xóa món này"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>

            <form className="space-y-6">
                {/* Toggle Trạng thái */}
                <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Trạng thái kinh doanh</span>
                    <StatusToggle
                        isActive={formData.isAvailable}
                        onToggle={(newState) => setFormData({ ...formData, isAvailable: newState })}
                    />
                </div>

                {/* Tên món */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tên món ăn</label>
                    <input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-green-500 focus:border-green-500"
                    />
                </div>

                {/* Giá & Danh mục */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Giá bán (VNĐ)</label>
                        <input
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Danh mục</label>
                        <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-green-500 focus:border-green-500 bg-white">
                            <option>Món chính</option>
                            <option>Đồ uống</option>
                            <option>Tráng miệng</option>
                        </select>
                    </div>
                </div>

                {/* Mô tả */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mô tả ngắn</label>
                    <textarea
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-green-500 focus:border-green-500"
                    />
                </div>

                {/* Nút Submit */}
                <div className="flex justify-end pt-4 border-t">
                    <button type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3">
                        Hủy bỏ
                    </button>
                    <button type="button" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Lưu Thay Đổi
                    </button>
                </div>
            </form>

            {/* Modal Xóa - Chỉ hiển thị khi showDeleteModal = true */}
            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={() => {
                    alert('Đã xóa món ăn thành công!');
                    setShowDeleteModal(false);
                }}
                foodName={formData.name}
            />
        </div>
    );
};

export default FoodEditForm;