import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout'; // ✅ Đã bật lại Layout
import UserList from '../components/user-statistics/UserList';
import PenaltyAccountList from '../components/user-statistics/PenaltyAccountList';
import OwnerRegisterList from '../components/user-statistics/OwnerRegisterList';

// --- MOCK DATA ---
const MOCK_USERS = [
    { id: '1', name: 'Nguyễn Văn A', email: 'khach1@gmail.com', role: 'customer', status: 'active' },
    { id: '2', name: 'Trần Văn B', email: 'owner1@gmail.com', role: 'owner', status: 'active' },
    { id: '3', name: 'Lê Thị C', email: 'khach2@gmail.com', role: 'customer', status: 'active' },
];

const MOCK_PENALTY = [
    { id: '4', name: 'Hoàng Hacker', email: 'hack@gmail.com', reason: 'Gian lận khuyến mãi', bannedDate: '28/12/2025' },
    { id: '5', name: 'Shipper Hủy Đơn', email: 'ship@gmail.com', reason: 'Hủy đơn liên tục', bannedDate: '25/12/2025' },
];

const MOCK_REQUESTS = [
    { id: '6', name: 'Đặng Khởi Nghiệp', email: 'newowner@gmail.com', phone: '0909123456', registerDate: '29/12/2025' },
    { id: '7', name: 'Phạm Bán Cơm', email: 'rice@gmail.com', phone: '0912345678', registerDate: '29/12/2025' },
];

const UserStatisticsScreen: React.FC = () => {
    // State quản lý Tab hiện tại
    const [activeTab, setActiveTab] = useState<'users' | 'penalty' | 'requests'>('users');

    // State dữ liệu
    const [users, setUsers] = useState(MOCK_USERS);
    const [penaltyList, setPenaltyList] = useState(MOCK_PENALTY);
    const [requests, setRequests] = useState(MOCK_REQUESTS);

    // --- 1. DUYỆT ĐĂNG KÝ (Chuyển từ Requests -> Users) ---
    const handleApproveOwner = (id: string) => {
        const ownerToApprove = requests.find(r => r.id === id);

        if (ownerToApprove && window.confirm('Duyệt người này làm Chủ quán?')) {
            // Thêm vào danh sách User
            const newUser = {
                id: ownerToApprove.id,
                name: ownerToApprove.name,
                email: ownerToApprove.email,
                role: 'owner',
                status: 'active'
            };
            setUsers(prev => [newUser, ...prev]);

            // Xóa khỏi danh sách chờ
            setRequests(prev => prev.filter(r => r.id !== id));

            alert('Đã duyệt thành công!');
        }
    };

    // --- 2. TỪ CHỐI ĐĂNG KÝ ---
    const handleRejectOwner = (id: string) => {
        if (window.confirm('Từ chối yêu cầu này?')) {
            setRequests(prev => prev.filter(r => r.id !== id));
        }
    };

    // --- 3. MỞ KHÓA (Chuyển từ Penalty -> Users) ---
    const handleUnlock = (id: string) => {
        const userToUnlock = penaltyList.find(u => u.id === id);

        if (userToUnlock && window.confirm('Mở khóa tài khoản này?')) {
            // Thêm lại vào danh sách User
            const unlockedUser = {
                id: userToUnlock.id,
                name: userToUnlock.name,
                email: userToUnlock.email,
                role: 'customer', // Mặc định reset về customer (hoặc giữ role cũ nếu backend hỗ trợ)
                status: 'active'
            };
            setUsers(prev => [unlockedUser, ...prev]);

            // Xóa khỏi danh sách phạt
            setPenaltyList(prev => prev.filter(u => u.id !== id));

            alert('Đã mở khóa tài khoản!');
        }
    };

    // --- 4. KHÓA TÀI KHOẢN (Chuyển từ Users -> Penalty) ---
    const handleBan = (id: string) => {
        const userToBan = users.find(u => u.id === id);
        const reason = window.prompt('Nhập lý do khóa tài khoản:');

        if (reason && userToBan) {
            // Thêm vào danh sách Phạt
            const penaltyUser = {
                id: userToBan.id,
                name: userToBan.name,
                email: userToBan.email,
                reason: reason,
                bannedDate: new Date().toLocaleDateString('vi-VN')
            };
            setPenaltyList(prev => [penaltyUser, ...prev]);

            // Xóa khỏi danh sách User
            setUsers(prev => prev.filter(u => u.id !== id));

            alert(`Đã khóa user với lý do: ${reason}`);
        }
    };

    return (
        <AdminLayout className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Thống kê & Quản lý User</h1>
                <p className="text-gray-500 text-sm mt-1">Kiểm soát người dùng, xử lý vi phạm và duyệt đối tác mới.</p>
            </div>

            {/* TAB NAVIGATION */}
            <div className="flex space-x-1 mb-6 bg-gray-200 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >
                    Danh sách User ({users.length})
                </button>
                <button
                    onClick={() => setActiveTab('penalty')}
                    className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'penalty' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >
                    Vi phạm ({penaltyList.length})
                </button>
                <button
                    onClick={() => setActiveTab('requests')}
                    className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'requests' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >
                    Đăng ký mới ({requests.length})
                </button>
            </div>

            {/* CONTENT */}
            <div className="animate-fade-in">
                {activeTab === 'users' && <UserList users={users} onBan={handleBan} />}

                {activeTab === 'penalty' && <PenaltyAccountList users={penaltyList} onUnlock={handleUnlock} />}

                {activeTab === 'requests' && <OwnerRegisterList requests={requests} onApprove={handleApproveOwner} onReject={handleRejectOwner} />}
            </div>

        </AdminLayout>
    );
};

export default UserStatisticsScreen;