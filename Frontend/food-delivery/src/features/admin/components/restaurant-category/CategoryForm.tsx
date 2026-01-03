import React, { useState, useEffect } from 'react';

interface Props {
    initialData?: { _id: string; name: string; description?: string; imageUrl?: string } | null;
    onSubmit: (name: string, description: string, image: File | null) => void;
    onCancel: () => void;
}

const CategoryForm: React.FC<Props> = ({ initialData, onSubmit, onCancel }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setDescription(initialData.description || '');
            setPreviewUrl(initialData.imageUrl || null); 
        } else {
            setName('');
            setDescription('');
            setPreviewUrl(null);
        }
        setImageFile(null); // Reset file khi đổi chế độ
    }, [initialData]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // Tạo URL tạm để xem trước
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit(name, description, imageFile);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit sticky top-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
                {initialData ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
            </h3>

            <form onSubmit={handleSubmit}>
                {/* Ảnh Preview & Input File */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ảnh danh mục
                    </label>

                    <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                        {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        ) : (
                        <span className="text-gray-400 text-sm">Chưa có ảnh</span>
                        )}
                    </div>

                    <label className="mt-3 inline-block cursor-pointer bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition">
                        Chọn ảnh
                        <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                        />
                    </label>
                    </div>

                {/* Các trường Text giữ nguyên */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ví dụ: Cơm văn phòng..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Mô tả ngắn về danh mục này..."
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition resize-none"
                    />
                </div>

                <div className="flex space-x-3">
                    <button
                        type="submit"
                        disabled={!name.trim()}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {initialData ? 'Cập nhật' : 'Thêm mới'}
                    </button>
                    {initialData && (
                        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition">
                            Hủy
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CategoryForm;