import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import PendingRestaurantsList from '../components/restaurant-category/PendingRestaurantsList';
import { adminRestaurantApi } from '../api';
import { toast } from 'react-hot-toast';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const AdminRestaurantRequestsScreen: React.FC = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // 1. Hàm lấy dữ liệu từ Backend
    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await adminRestaurantApi.getPendingRequests();
            // Data từ service trả về thường nằm trong data.data hoặc data tùy cấu hình
            setRequests(data || []);
        } catch (error) {
            console.error(error);
            toast.error("Không thể tải danh sách yêu cầu");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    // 2. Xử lý Duyệt (Approve)
    const handleApprove = async (id: string) => {
        if (!window.confirm('Xác nhận duyệt nhà hàng này và cấp quyền Owner cho người dùng?')) return;
        try {
            await adminRestaurantApi.approveRequest(id);
            toast.success("Đã phê duyệt hồ sơ thành công!");
            fetchRequests(); // Reload lại danh sách sau khi duyệt
        } catch (error) {
            toast.error("Lỗi trong quá trình phê duyệt");
        }
    };

    // 3. Xử lý Từ chối (Reject)
    const handleReject = async (id: string) => {
        const reason = window.prompt("Nhập lý do từ chối hồ sơ này:");
        if (reason === null) return; // Người dùng bấm Hủy (Cancel)
        if (!reason.trim()) return toast.error("Vui lòng nhập lý do từ chối");

        try {
            await adminRestaurantApi.rejectRequest(id, reason);
            toast.success("Đã từ chối hồ sơ đăng ký");
            fetchRequests();
        } catch (error) {
            toast.error("Lỗi khi gửi yêu cầu từ chối");
        }
    };

    return (
        <AdminLayout className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            {/* Header Trang */}
            <div className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                        <ClipboardDocumentListIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 uppercase">Phê duyệt đối tác</h1>
                        <p className="text-gray-500 text-sm">Xem xét và cấp phép cho các yêu cầu mở nhà hàng mới trên hệ thống.</p>
                    </div>
                </div>
            </div>

            {/* Nội dung chính */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    <p className="mt-4 text-gray-500 font-medium">Đang tải danh sách chờ...</p>
                </div>
            ) : (
                <div className="animate-fade-in">
                    <PendingRestaurantsList 
                        restaurants={requests} 
                        onApprove={handleApprove} 
                        onReject={handleReject} 
                    />
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminRestaurantRequestsScreen;