import React from 'react';
import { PencilSquareIcon, TrashIcon, TagIcon } from '@heroicons/react/24/outline';

interface Category {
    id: string;
    name: string;
    count: number; // Số lượng quán thuộc danh mục này
}

interface Props {
    categories: Category[];
    onEdit: (cat: Category) => void;
    onDelete: (id: string) => void;
}

const CategoryList: React.FC<Props> = ({ categories, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 flex items-center">
                    <TagIcon className="w-5 h-5 mr-2 text-green-600" />
                    Danh sách Danh mục
                </h3>
                <span className="text-sm text-gray-500">Tổng: {categories.length}</span>
            </div>

            <ul className="divide-y divide-gray-100">
                {categories.map((cat) => (
                    <li key={cat.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 group transition">
                        <div className="flex items-center">
                            <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs mr-3">
                                {cat.name.charAt(0).toUpperCase()}
                            </span>
                            <div>
                                <p className="font-medium text-gray-900">{cat.name}</p>
                                <p className="text-xs text-gray-500">{cat.count} nhà hàng</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => onEdit(cat)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                title="Sửa"
                            >
                                <PencilSquareIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => onDelete(cat.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                title="Xóa"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;