import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import CategoryList from '../components/restaurant-category/CategoryList';
import CategoryForm from '../components/restaurant-category/CategoryForm';
import { adminCategoryApi } from '../api';
import { toast } from 'react-hot-toast';

const RestaurantCategoryScreen: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [editingCategory, setEditingCategory] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

    // Dùng useCallback để tránh re-render không cần thiết
    const fetchCategories = useCallback(async (page: number = 1) => {
        setIsLoading(true);
        try {
            const data = await adminCategoryApi.getAll(page, 10);
            console.log("Pagination từ BE:", data.pagination);

            setCategories(data.categories); // Lấy mảng categories
            setPagination(data.pagination); // Lưu thông tin phân trang
        } catch (error) {
            toast.error("Không thể tải danh mục");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { 
        fetchCategories(); 
    }, [fetchCategories]);

    const handlePageChange = (newPage: number) => {
        fetchCategories(newPage);
    };

    // --- XỬ LÝ LƯU (CREATE / UPDATE) ---
    const handleSubmitCategory = async (name: string, description: string) => {
        try {
            if (editingCategory) {
                await adminCategoryApi.update(editingCategory._id, name, description);
                toast.success("Cập nhật danh mục thành công");
            } else {
                await adminCategoryApi.create(name, description);
                toast.success("Thêm danh mục mới thành công");
            }
            setEditingCategory(null);
            fetchCategories();
        } catch (error) {
            toast.error("Thao tác thất bại");
        }
    };

    // --- XỬ LÝ ẨN/HIỆN (PATCH) ---
    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            if (currentStatus) {
                await adminCategoryApi.deactive(id);
                toast.success("Đã ẩn danh mục");
            } else {
                await adminCategoryApi.active(id);
                toast.success("Đã kích hoạt danh mục");
            }
            fetchCategories();
        } catch (error) {
            toast.error("Không thể thay đổi trạng thái");
        }
    };

    // --- XỬ LÝ XÓA VĨNH VIỄN (DELETE) ---
    const handleDeleteCategory = async (id: string) => {
        if (!window.confirm('Cảnh báo: Xóa vĩnh viễn danh mục này có thể gây lỗi nếu có nhà hàng đang sử dụng. Bạn vẫn muốn xóa?')) return;
        
        try {
            await adminCategoryApi.hardDelete(id);
            toast.success("Đã xóa vĩnh viễn");
            fetchCategories();
        } catch (error) {
            toast.error("Không thể xóa danh mục");
        }
    };

    return (
        <AdminLayout className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý Danh mục Hệ thống</h1>
                <p className="text-gray-500 text-sm mt-1">Quản lý các loại hình món ăn và trạng thái hiển thị của chúng.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {/* Truyền isLoading vào CategoryList để hiển thị trạng thái chờ */}
                    <CategoryList
                        categories={categories}
                        isLoading={isLoading} 
                        onEdit={setEditingCategory}
                        onToggleStatus={handleToggleStatus}
                        onDelete={handleDeleteCategory}
                    />
                    {/* Thanh điều hướng trang */}
                    <div className="mt-4 flex justify-center items-center space-x-2">
                        <button
                            disabled={pagination.page <= 1}
                            onClick={() => handlePageChange(pagination.page - 1)}
                            className="px-3 py-1 bg-white border rounded disabled:opacity-50"
                        >
                            Trước
                        </button>
                        <span className="text-sm text-gray-600">
                            Trang {pagination.page} / {pagination.totalPages}
                        </span>
                        <button
                            disabled={pagination.page >= pagination.totalPages}
                            onClick={() => handlePageChange(pagination.page + 1)}
                            className="px-3 py-1 bg-white border rounded disabled:opacity-50"
                        >
                            Sau
                        </button>
                    </div>
                </div>
                
                <div className="lg:col-span-1">
                    <CategoryForm
                        initialData={editingCategory}
                        onSubmit={handleSubmitCategory}
                        onCancel={() => setEditingCategory(null)}
                    />
                </div>
            </div>
        </AdminLayout>
    );
};

export default RestaurantCategoryScreen;