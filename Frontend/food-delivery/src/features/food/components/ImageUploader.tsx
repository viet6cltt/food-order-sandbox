// src/features/food/components/ImageUploader.tsx
import React, { useEffect, useRef, useState } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ImageUploaderProps {
    onImageChange?: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    // Xử lý khi chọn file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (!file) return;
        if (onImageChange) onImageChange(file);
        const url = URL.createObjectURL(file);
        setPreview(url);
    };

    // Xử lý xóa từng ảnh
    const handleRemoveImage = () => {
        if (onImageChange) onImageChange(null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh món ăn
            </label>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Danh sách ảnh đã chọn */}
                {preview ? (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-300 group">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="bg-white text-red-600 p-1 rounded-full shadow-lg hover:bg-red-50"
                                title="Xóa ảnh này"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ) : null}

                {/* Nút thêm ảnh (Luôn hiện để chọn thêm) */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-400 cursor-pointer transition-colors"
                >
                    <PhotoIcon className="h-8 w-8 text-gray-400 mb-1" />
                    <span className="text-xs font-medium text-green-600">Chọn ảnh</span>
                </div>
            </div>

            {/* Input ẩn (thêm thuộc tính multiple) */}
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />
            <p className="text-xs text-gray-500 mt-2">Chỉ cho phép tải lên 1 ảnh (JPG, PNG, GIF).</p>
        </div>
    );
};

export default ImageUploader;