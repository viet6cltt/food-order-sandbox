import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import UserList from '../components/user-statistics/UserList';
import PenaltyAccountList from '../components/user-statistics/PenaltyAccountList';
import { adminUserApi } from '../api'; // Giả định file lưu api
import { toast } from 'react-toastify';

const UserStatisticsScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'users' | 'penalty' >('users');
    const [isLoading, setIsLoading] = useState(false);
    
    // States cho dữ liệu và phân trang
    const [users, setUsers] = useState<any[]>([]);
    const [metadata, setMetadata] = useState({ totalItems: 0, totalPages: 1, currentPage: 1 });
    const [penaltyList, setPenaltyList] = useState<any[]>([]);

    // Hàm lấy dữ liệu dựa trên Tab
    const fetchData = useCallback(async (page: number = 1) => {
        setIsLoading(true);
        try {
            // BE của bạn nhận { role, status } và pagination { page, limit }
            const params = {
                status: activeTab === 'users' ? 'active' : 'banned',
                page: page,
                limit: 10
            };

            const response = await adminUserApi.getUsers(params);
            
            if (activeTab === 'users') {
                setUsers(response.items || []);
            } else if (activeTab === 'penalty') {
                setPenaltyList(response.items || []);
            }
            
            setMetadata(response.metadata || { totalItems: 0, totalPages: 1, currentPage: 1 });

        } catch (error) {
            toast.error("Không thể tải dữ liệu");
        } finally {
            setIsLoading(false);
        }
    }, [activeTab]);

    useEffect(() => { 
        fetchData(1); // Reset về trang 1 mỗi khi đổi Tab
    }, [fetchData]);

    const handlePageChange = (newPage: number) => {
        fetchData(newPage);
    };

    // --- XỬ LÝ KHÓA TÀI KHOẢN (BE: blockUser) ---
    const handleBan = async (id: string) => {
        if (!window.confirm('Bạn có chắc muốn khóa tài khoản này?')) return;
        try {
            await adminUserApi.blockUser(id);
            toast.success("Đã khóa tài khoản thành công");
            fetchData(); // Reload lại danh sách
        } catch (error) {
            toast.error("Lỗi khi khóa tài khoản");
        }
    };

    // --- XỬ LÝ MỞ KHÓA (BE: unlockUser) ---
    const handleUnlock = async (id: string) => {
        if (!window.confirm('Xác nhận mở khóa tài khoản?')) return;
        try {
            await adminUserApi.unlockUser(id);
            toast.success("Đã mở khóa tài khoản");
            fetchData();
        } catch (error) {
            toast.error("Lỗi khi mở khóa");
        }
    };

    return (
        <AdminLayout className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý User & Đối tác</h1>
                    <p className="text-gray-500 text-sm mt-1">Hệ thống quản trị người dùng tập trung.</p>
                </div>
                {/* Hiển thị tổng số lượng từ Metadata của BE */}
                <div className="text-sm font-medium text-gray-500">
                    Tổng cộng: <span className="text-gray-900">{metadata.totalItems}</span> bản ghi
                </div>
            </div>

            {/* TAB NAVIGATION */}
            <div className="flex space-x-1 mb-6 bg-gray-200 p-1 rounded-xl w-fit">
                <button onClick={() => setActiveTab('users')} className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600'}`}>
                    Người dùng
                </button>
                <button onClick={() => setActiveTab('penalty')} className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'penalty' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600'}`}>
                    Đang bị khóa
                </button>
                
            </div>

            {isLoading ? (
                <div className="py-20 text-center flex flex-col items-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mb-4"></div>
                    <p className="text-gray-500">Đang tải dữ liệu...</p>
                </div>
            ) : (
                <>
                    <div className="animate-fade-in">
                        {activeTab === 'users' && <UserList users={users} onBan={handleBan} />}
                        {activeTab === 'penalty' && <PenaltyAccountList users={penaltyList} onUnlock={handleUnlock} />}
                    </div>

                    {/* PHÂN TRANG (Pagination) */}
                    {metadata.totalPages > 1 && (
                        <div className="mt-6 flex justify-center items-center space-x-4">
                            <button 
                                disabled={metadata.currentPage <= 1}
                                onClick={() => handlePageChange(metadata.currentPage - 1)}
                                className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                            >
                                Trước
                            </button>
                            <span className="text-sm font-medium">
                                Trang {metadata.currentPage} / {metadata.totalPages}
                            </span>
                            <button 
                                disabled={metadata.currentPage >= metadata.totalPages}
                                onClick={() => handlePageChange(metadata.currentPage + 1)}
                                className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                            >
                                Sau
                            </button>
                        </div>
                    )}
                </>
            )}
        </AdminLayout>
    );
};

export default UserStatisticsScreen;