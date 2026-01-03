import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import useUser from '../../../hooks/useUser'; 
import AppLayout from '../../../layouts/AppLayout';
import ProfileEditForm from '../components/ProfileEditForm';
import ChangePasswordForm from '../components/ChangePasswordForm';
import { type UserProfile } from '../../../types/user';

const ProfileScreen: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { user, isLoading, refetch } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // 1. Logic ghép FullName (Ưu tiên First + Last, fallback về Username)
    const fullName = user?.firstname || user?.lastname
        ? `${user.firstname || ''} ${user.lastname || ''}`.trim()
        : user?.username;

    const handleEditSuccess = () => {
        refetch(); 
        setIsEditing(false);
    };

    console.log(user);
    const getAvatarUrl = () => {
        if (user?.avatarUrl) return user.avatarUrl;
        const name = fullName || user?.username || 'User';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
    };

    if (isLoading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
            </AppLayout>
        );
    }

    if (!user) return null;

    const roleQuickAction = (() => {
        if (user.role === 'restaurant_owner') {
            return { label: 'Menu', to: '/owner/menu-list' };
        }
        if (user.role === 'admin') {
            return { label: 'Users', to: '/admin/users' };
        }
        return { label: 'Đơn hàng', to: '/order-list' };
    })();

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    {isEditing ? (
                        <ProfileEditForm
                            user={{ ...user, fullName } as UserProfile}
                            onSuccess={handleEditSuccess}
                            onCancel={() => setIsEditing(false)}
                        />
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            {/* Header Gradient */}
                            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={getAvatarUrl()}
                                            alt="Avatar"
                                            className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                                        />
                                        <div>
                                            <h1 className="text-2xl font-bold text-white">{fullName}</h1>
                                            <p className="text-green-100 opacity-90">@{user.username}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-white/20 backdrop-blur-md text-white border border-white/30 font-semibold rounded-lg hover:bg-white/30 transition flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        Chỉnh sửa
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                {/* Roles & Verified Badges */}
                                <div className="flex flex-wrap gap-2 mb-8">
                                    <Badge color="indigo">{user.role}</Badge>
                                    <Badge color={user.status === 'active' ? 'green' : 'red'}>
                                        {user.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                                    </Badge>
                                    {/* Hiển thị Provider nếu có (Google/Firebase) */}
                                    {user.providers?.map((p, i) => (
                                        <Badge key={i} color="gray" icon={true}>
                                            Linked: {p.provider}
                                        </Badge>
                                    ))}
                                </div>

                                {/* Main Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-4">
                                    <InfoRow 
                                        label="Họ và Tên" 
                                        value={fullName || 'Chưa cập nhật'} 
                                        icon={<path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
                                    />

                                    <InfoRow 
                                        label="Ngày sinh" 
                                        value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'} 
                                        icon={<path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />}
                                    />

                                    <InfoRow 
                                        label="Số điện thoại" 
                                        value={user.phone || 'Chưa cập nhật'} 
                                        isVerified={!!user.phoneVerifiedAt}
                                        icon={<path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />}
                                    />

                                    <InfoRow 
                                        label="Email" 
                                        value={user.email || 'Chưa cập nhật'} 
                                        isVerified={!!user.emailVerifiedAt}
                                        icon={<path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                                    />

                                    <div className="md:col-span-2">
                                        <InfoRow 
                                            label="Địa chỉ giao hàng" 
                                            value={user.address?.street ? `${user.address.street}, ${user.address.city || ''}` : 'Chưa thiết lập địa chỉ'} 
                                            icon={<path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />}
                                        />
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="mt-10 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <button 
                                        onClick={() => navigate(roleQuickAction.to)}
                                        className="flex items-center justify-center gap-2 py-3 bg-green-50 text-green-700 font-bold rounded-xl hover:bg-green-100 transition-all active:scale-95"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {user.role === 'restaurant_owner' ? (
                                                <path d="M4 6h16M4 12h16M4 18h16" />
                                            ) : user.role === 'admin' ? (
                                                <path d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 110-8 4 4 0 010 8zm8 3a4 4 0 10-8 0" />
                                            ) : (
                                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            )}
                                        </svg>
                                        {roleQuickAction.label}
                                    </button>

                                    <button 
                                        onClick={() => setIsChangingPassword((v) => !v)}
                                        className="flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-800 font-bold rounded-xl hover:bg-gray-100 transition-all active:scale-95"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 11c1.105 0 2 .895 2 2v2a2 2 0 11-4 0v-2c0-1.105.895-2 2-2zm6 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2v-6a2 2 0 012-2h8a2 2 0 012 2z" />
                                            <path d="M8 11V7a4 4 0 118 0v4" />
                                        </svg>
                                        Đổi mật khẩu
                                    </button>

                                    <button 
                                        onClick={logout}
                                        className="flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all active:scale-95"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Đăng xuất
                                    </button>
                                </div>

                                {isChangingPassword && (
                                    <ChangePasswordForm
                                        className="mt-6"
                                        onSuccess={() => setIsChangingPassword(false)}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

// --- Sub-components để code gọn gàng ---

const Badge = ({ children, color, icon }: { children: React.ReactNode, color: string, icon?: boolean }) => {
    const colors: Record<string, string> = {
        green: "bg-green-100 text-green-700",
        red: "bg-red-100 text-red-700",
        indigo: "bg-indigo-100 text-indigo-700",
        gray: "bg-gray-100 text-gray-600"
    };
    return (
        <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest flex items-center gap-1 ${colors[color]}`}>
            {icon && <span className="w-1.5 h-1.5 rounded-full bg-current"></span>}
            {children}
        </span>
    );
};

const InfoRow = ({ label, value, icon, isVerified }: { label: string, value: string, icon: React.ReactNode, isVerified?: boolean }) => (
    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
        <div className="p-2.5 bg-green-50 rounded-lg text-green-600 shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {icon}
            </svg>
        </div>
        <div className="flex-1">
            <p className="text-[11px] text-gray-400 uppercase font-bold tracking-tight mb-0.5">{label}</p>
            <div className="flex items-center gap-2">
                <p className="text-gray-900 font-semibold">{value}</p>
                {isVerified && (
                    <div className="flex items-center text-blue-500" title="Đã xác thực">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    </div>
);

export default ProfileScreen;