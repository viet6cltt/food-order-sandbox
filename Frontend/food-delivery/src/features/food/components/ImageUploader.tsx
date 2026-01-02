// src/features/food/components/ImageUploader.tsx
import React, { useState, useRef, useEffect } from 'react';
import { PhotoIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

interface ImageUploaderProps {
    onImagesChange?: (files: File[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesChange }) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Xử lý khi chọn file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);

            // Cập nhật danh sách file
            const updatedFiles = [...selectedFiles, ...newFiles];
            setSelectedFiles(updatedFiles);
            if (onImagesChange) onImagesChange(updatedFiles);

            // Tạo preview URL cho các file mới
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    // Xử lý xóa từng ảnh
    const handleRemoveImage = (index: number) => {
        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        const updatedPreviews = previews.filter((_, i) => i !== index);

        setSelectedFiles(updatedFiles);
        setPreviews(updatedPreviews);
        if (onImagesChange) onImagesChange(updatedFiles);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh món ăn ({selectedFiles.length} ảnh)
            </label>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Danh sách ảnh đã chọn */}
                {previews.map((src, index) => (
                    <div key={index} className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-300 group">
                        <img
                            src={src}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="bg-white text-red-600 p-1 rounded-full shadow-lg hover:bg-red-50"
                                title="Xóa ảnh này"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Nút thêm ảnh (Luôn hiện để chọn thêm) */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-400 cursor-pointer transition-colors"
                >
                    <PhotoIcon className="h-8 w-8 text-gray-400 mb-1" />
                    <span className="text-xs font-medium text-green-600">Thêm ảnh</span>
                </div>
            </div>

            {/* Input ẩn (thêm thuộc tính multiple) */}
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileChange}
            />
            <p className="text-xs text-gray-500 mt-2">Cho phép tải lên nhiều ảnh (JPG, PNG, GIF).</p>
        </div>
    );
};

export default ImageUploader;