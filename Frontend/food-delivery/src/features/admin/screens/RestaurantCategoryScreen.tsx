import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout'; // Bật lại Layout chuẩn
import PendingRestaurantsList from '../components/restaurant-category/PendingRestaurantsList';
import CategoryList from '../components/restaurant-category/CategoryList';
import CategoryForm from '../components/restaurant-category/CategoryForm';
import { toast } from 'react-toastify';

// --- MOCK DATA ---
const MOCK_PENDING = [
    { id: '1', name: 'Cơm Tấm Sài Gòn', ownerName: 'Nguyễn Văn A', address: '123 Cầu Giấy', registerDate: '2023-12-28' },
    { id: '2', name: 'Trà Sữa DingTea', ownerName: 'Trần Thị B', address: '456 Đê La Thành', registerDate: '2023-12-29' },
    { id: '3', name: 'Bún Bò Huế Xưa', ownerName: 'Lê Thị C', address: '789 Kim Mã', registerDate: '2023-12-30' },
];

const MOCK_CATEGORIES = [
    { id: 'c1', name: 'Đồ ăn', count: 120 },
    { id: 'c2', name: 'Đồ uống', count: 85 },
    { id: 'c3', name: 'Ăn vặt', count: 45 },
    { id: 'c4', name: 'Cơm văn phòng', count: 60 },
    { id: 'c5', name: 'Healthy', count: 12 },
];

const RestaurantCategoryScreen: React.FC = () => {
    const [pendingList, setPendingList] = useState(MOCK_PENDING);
    const [categories, setCategories] = useState(MOCK_CATEGORIES);
    const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null);

    // --- XỬ LÝ DUYỆT ---
    const handleApprove = (id: string) => {
        if (window.confirm('Xác nhận cho phép nhà hàng này hoạt động?')) {
            setPendingList(prev => prev.filter(r => r.id !== id));
        }
    };

    // --- XỬ LÝ TỪ CHỐI ---
    const handleReject = (id: string) => {
        const reason = window.prompt("Vui lòng nhập lý do từ chối để gửi email cho chủ quán:");
        if (reason !== null) {
            if (reason.trim() === "") {
                toast.warn("Bạn chưa nhập lý do! Không thể từ chối.");
                return;
            }
            setPendingList(prev => prev.filter(r => r.id !== id));
            toast.success(`Đã gửi email từ chối với lý do: "${reason}"`);
        }
    };

    // --- XỬ LÝ DANH MỤC ---
    const handleSubmitCategory = (name: string) => {
        if (editingCategory) {
            setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, name } : c));
            setEditingCategory(null);
        } else {
            const newCat = { id: Date.now().toString(), name, count: 0 };
            setCategories(prev => [newCat, ...prev]);
        }
    };

    const handleDeleteCategory = (id: string) => {
        if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
            setCategories(prev => prev.filter(c => c.id !== id));
        }
    };

    return (
        // Sử dụng AdminLayout chuẩn
        <AdminLayout className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý Danh mục & Đối tác</h1>
                <p className="text-gray-500 text-sm mt-1">Phê duyệt nhà hàng mới và quản lý danh mục hệ thống.</p>
            </div>

            {/* List duyệt nhà hàng */}
            <PendingRestaurantsList
                restaurants={pendingList}
                onApprove={handleApprove}
                onReject={handleReject}
            />

            {/* Quản lý danh mục */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <CategoryList
                        categories={categories}
                        onEdit={setEditingCategory}
                        onDelete={handleDeleteCategory}
                    />
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