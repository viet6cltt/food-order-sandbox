import React from 'react';
import { PencilSquareIcon, TrashIcon, TagIcon, PowerIcon, InboxIcon } from '@heroicons/react/24/outline';

interface Category {
    _id: string;
    name: string;
    description?: string;
    isActive: boolean;
}

interface Props {
    categories: Category[];
    isLoading: boolean; // Thêm prop isLoading
    onEdit: (cat: Category) => void;
    onToggleStatus: (id: string, currentStatus: boolean) => void;
    onDelete: (id: string) => void;
}

const CategoryList: React.FC<Props> = ({ categories, isLoading, onEdit, onToggleStatus, onDelete }) => {
    
    // 1. Trạng thái đang tải dữ liệu
    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                <p className="text-gray-500 animate-pulse">Đang tải danh sách danh mục...</p>
            </div>
        );
    }

    // 2. Trạng thái danh sách trống
    if (categories.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
                <InboxIcon className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Chưa có danh mục nào</h3>
                <p className="text-gray-500 max-w-xs">Hãy thêm danh mục mới ở form bên cạnh để bắt đầu quản lý hệ thống.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 flex items-center">
                    <TagIcon className="w-5 h-5 mr-2 text-green-600" />
                    Danh sách Danh mục
                </h3>
                <span className="text-xs font-medium bg-gray-200 text-gray-600 px-2.5 py-0.5 rounded-full">
                    Tổng: {categories.length}
                </span>
            </div>

            <ul className="divide-y divide-gray-100">
                {categories.map((cat) => (
                    <li key={cat._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 group transition">
                        <div className="flex items-center space-x-4">
                            {/* Avatar ký tự đầu */}
                            <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                                cat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                            }`}>
                                {cat.name.charAt(0).toUpperCase()}
                            </span>
                            
                            <div>
                                <div className="flex items-center space-x-2">
                                    <p className={`font-semibold transition-all ${
                                        cat.isActive ? 'text-gray-900' : 'text-gray-400 line-through'
                                    }`}>
                                        {cat.name}
                                    </p>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                                        cat.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                    }`}>
                                        {cat.isActive ? 'Active' : 'Hidden'}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-1 max-w-xs italic">
                                    {cat.description || 'Chưa có mô tả chi tiết'}
                                </p>
                            </div>
                        </div>

                        {/* Nút thao tác hiện ra khi hover dòng */}
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
                            <button
                                onClick={() => onToggleStatus(cat._id, cat.isActive)}
                                className={`p-2 rounded-full transition-colors ${
                                    cat.isActive ? 'text-orange-500 hover:bg-orange-50' : 'text-green-500 hover:bg-green-50'
                                }`}
                                title={cat.isActive ? "Tạm ẩn" : "Kích hoạt"}
                            >
                                <PowerIcon className="w-5 h-5" />
                            </button>
                            
                            <button
                                onClick={() => onEdit(cat)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                title="Chỉnh sửa"
                            >
                                <PencilSquareIcon className="w-5 h-5" />
                            </button>
                            
                            <button
                                onClick={() => onDelete(cat._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                title="Xóa vĩnh viễn"
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