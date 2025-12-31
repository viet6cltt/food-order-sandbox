import React, { useState, useEffect } from 'react';

interface Props {
    initialData?: { id: string; name: string } | null;
    onSubmit: (name: string) => void;
    onCancel: () => void;
}

const CategoryForm: React.FC<Props> = ({ initialData, onSubmit, onCancel }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (initialData) setName(initialData.name);
        else setName('');
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) onSubmit(name);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit sticky top-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
                {initialData ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
            </h3>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ví dụ: Cơm văn phòng, Trà sữa..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                        autoFocus
                    />
                </div>

                <div className="flex space-x-3">
                    <button
                        type="submit"
                        disabled={!name.trim()}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {initialData ? 'Cập nhật' : 'Thêm mới'}
                    </button>

                    {initialData && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-medium transition"
                        >
                            Hủy
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CategoryForm;