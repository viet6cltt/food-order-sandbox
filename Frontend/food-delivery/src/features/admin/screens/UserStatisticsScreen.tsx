import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import UserList from '../components/user-statistics/UserList';
import PenaltyAccountList from '../components/user-statistics/PenaltyAccountList';
import OwnerRegisterList from '../components/user-statistics/OwnerRegisterList';
import { adminUserApi } from '../api'; // Giả định file lưu api
import { toast } from 'react-toastify';

const UserStatisticsScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'users' | 'penalty' | 'requests'>('users');
    const [isLoading, setIsLoading] = useState(false);
    
    // Data States
    const [users, setUsers] = useState<any[]>([]);
    const [penaltyList, setPenaltyList] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);

    // Hàm lấy dữ liệu dựa trên Tab
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'users') {
                // Lấy user active (customer/owner)
                const data = await adminUserApi.getUsers({ status: 'active' });
                setUsers(data.users || data); // Tùy cấu hình phân trang của BE
            } else if (activeTab === 'penalty') {
                // Lấy danh sách user bị block
                const data = await adminUserApi.getUsers({ status: 'banned' });
                setPenaltyList(data.users || data);
            }
            // else: fetchData cho requests duyệt quán (nếu có API riêng)
        } catch (error) {
            toast.error("Không thể tải dữ liệu người dùng");
        } finally {
            setIsLoading(false);
        }
    }, [activeTab]);

    useEffect(() => { fetchData(); }, [fetchData]);

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
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý User & Đối tác</h1>
                <p className="text-gray-500 text-sm mt-1">Hệ thống quản trị người dùng tập trung.</p>
            </div>

            {/* TAB NAVIGATION */}
            <div className="flex space-x-1 mb-6 bg-gray-200 p-1 rounded-xl w-fit">
                <button onClick={() => setActiveTab('users')} className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600'}`}>
                    Người dùng ({users.length})
                </button>
                <button onClick={() => setActiveTab('penalty')} className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'penalty' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600'}`}>
                    Đang bị khóa ({penaltyList.length})
                </button>
                <button onClick={() => setActiveTab('requests')} className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'requests' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600'}`}>
                    Duyệt Owner ({requests.length})
                </button>
            </div>

            {isLoading ? (
                <div className="py-10 text-center">Đang tải...</div>
            ) : (
                <div className="animate-fade-in">
                    {activeTab === 'users' && <UserList users={users} onBan={handleBan} />}
                    {activeTab === 'penalty' && <PenaltyAccountList users={penaltyList} onUnlock={handleUnlock} />}
                    {activeTab === 'requests' && <OwnerRegisterList requests={requests} onApprove={() => {}} onReject={() => {}} />}
                </div>
            )}
        </AdminLayout>
    );
};

export default UserStatisticsScreen;