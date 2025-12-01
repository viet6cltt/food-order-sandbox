// src/features/food/components/FoodForm.tsx
import React from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';

const FoodForm: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Thông tin món ăn</h2>

            <form className="space-y-6">
                {/* Tên món */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tên món ăn</label>
                    <input
                        type="text"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-green-500 focus:border-green-500"
                        placeholder="Ví dụ: Phở Bò Đặc Biệt"
                    />
                </div>

                {/* Giá & Danh mục */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Giá bán (VNĐ)</label>
                        <input
                            type="number"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-green-500 focus:border-green-500"
                            placeholder="0"
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
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-green-500 focus:border-green-500"
                        placeholder="Mô tả thành phần, hương vị..."
                    />
                </div>

                {/* Upload Ảnh */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Hình ảnh món ăn</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 cursor-pointer transition">
                        <div className="space-y-1 text-center">
                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                                <span className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                                    Tải ảnh lên
                                </span>
                                <p className="pl-1">hoặc kéo thả vào đây</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 5MB</p>
                        </div>
                    </div>
                </div>

                {/* Nút Submit */}
                <div className="flex justify-end pt-4">
                    <button type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3">
                        Hủy
                    </button>
                    <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Lưu Món Ăn
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FoodForm;