// src/features/food/components/FoodForm.tsx
import React, { useState } from 'react';
import ImageUploader from './ImageUploader';

const FoodForm: React.FC = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    // State bây giờ là một mảng File[]
    const [images, setImages] = useState<File[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Log ra để kiểm tra xem đã nhận đủ ảnh chưa
        console.log("Submitting Food:", {
            name,
            price,
            description,
            totalImages: images.length,
            fileNames: images.map(f => f.name)
        });

        alert(`Đã lưu món: ${name} với ${images.length} hình ảnh!`);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Thông tin món ăn</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tên món */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tên món ăn</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-green-500 focus:border-green-500"
                        placeholder="Ví dụ: Phở Bò Đặc Biệt"
                        required
                    />
                </div>

                {/* Giá & Danh mục */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Giá bán (VNĐ)</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-green-500 focus:border-green-500"
                            placeholder="0"
                            required
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
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-green-500 focus:border-green-500"
                        placeholder="Mô tả thành phần, hương vị..."
                    />
                </div>

                {/* Upload Nhiều Ảnh - Sử dụng component mới */}
                <ImageUploader onImagesChange={(files) => setImages(files)} />

                {/* Nút Submit */}
                <div className="flex justify-end pt-4 border-t mt-4">
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