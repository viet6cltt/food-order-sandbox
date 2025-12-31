import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type UserProfile } from '../../../types/user';
import { getMe } from '../api';
import useAuth from '../../../hooks/useAuth';
import AppLayout from '../../../layouts/AppLayout';
import ProfileEditForm from '../components/ProfileEditForm';

const ProfileScreen: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            setError(null);
            const userData = await getMe();
            
            const fullName = userData.firstname || userData.lastname
                ? `${userData.firstname || ''} ${userData.lastname || ''}`.trim()
                : userData.username;
            
            const profile: UserProfile = {
                ...userData,
                fullName,
            };
            
            setUser(profile);
        } catch (err: unknown) {
            let errorMessage = 'Không thể tải thông tin người dùng. Vui lòng thử lại.';
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as { response?: { data?: { message?: string; error?: string } } };
                errorMessage = axiosError.response?.data?.message || 
                               axiosError.response?.data?.error || 
                               errorMessage;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleLogout = () => {
        logout();
    };

    const handleEditSuccess = (updatedUser: UserProfile) => {
        setUser(updatedUser);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    // Default avatar URL if user doesn't have one
    const getAvatarUrl = (user: UserProfile | null) => {
        if (user?.avatarUrl) return user.avatarUrl;
        if (user?.fullName || user?.username) {
            const name = user.fullName || user.username;
            return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
        }
        return 'https://ui-avatars.com/api/?name=User&background=random';
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Đang tải thông tin...</p>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (error) {
        return (
            <AppLayout>
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="text-center">
                                <div className="mb-4 text-red-500">
                                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Lỗi</h2>
                                <p className="text-gray-600 mb-4">{error}</p>
                                <button
                                    onClick={fetchUserData}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                >
                                    Thử lại
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    {isEditing ? (
                        <ProfileEditForm
                            user={user}
                            onSuccess={handleEditSuccess}
                            onCancel={handleCancelEdit}
                        />
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            {/* Header with Avatar */}
                            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={getAvatarUrl(user)}
                                            alt="Avatar"
                                            className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                                        />
                                        <div>
                                            <h1 className="text-2xl font-bold text-white">
                                                {user.fullName || user.username}
                                            </h1>
                                            <p className="text-green-100">@{user.username}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Chỉnh sửa
                                    </button>
                                </div>
                            </div>

                            {/* Profile Details */}
                            <div className="p-6">
                                {/* Role Badge */}
                                <div className="mb-6">
                                    <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-semibold rounded-full uppercase">
                                        {user.role === 'customer' ? 'Khách hàng' : user.role === 'restaurant_owner' ? 'Chủ nhà hàng' : 'Quản trị viên'}
                                    </span>
                                    {user.status && (
                                        <span className={`ml-2 inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                                            user.status === 'active' 
                                                ? 'bg-green-100 text-green-800' 
                                                : user.status === 'banned'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {user.status === 'active' ? 'Hoạt động' : user.status === 'banned' ? 'Bị khóa' : 'Chờ duyệt'}
                                        </span>
                                    )}
                                </div>

                                {/* Information Grid */}
                                <div className="space-y-4">
                                    {/* Full Name */}
                                        <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                                            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-500">Họ và Tên</p>
                                                <p className="text-base font-medium text-gray-900">{user.firstname} {user.lastname}</p>
                                            </div>
                                        </div>
                                    
                                    {/* Email */}
                                    {user.email && (
                                        <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                                            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-500">Email</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-base font-medium text-gray-900">{user.email}</p>
                                                    {user.emailVerifiedAt && (
                                                        <span className="text-xs text-green-600 flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                            Đã xác thực
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Phone */}
                                    <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Số điện thoại</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-base font-medium text-gray-900">{user.phone}</p>
                                                {user.phoneVerifiedAt && (
                                                    <span className="text-xs text-green-600 flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        Đã xác thực
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date of Birth */}
                                    {user.dateOfBirth && (
                                        <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                                            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-500">Ngày sinh</p>
                                                <p className="text-base font-medium text-gray-900">
                                                    {new Date(user.dateOfBirth).toLocaleDateString('vi-VN', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Address */}
                                    {user.address && (user.address.street || user.address.city) && (
                                        <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                                            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-500">Địa chỉ</p>
                                                <p className="text-base font-medium text-gray-900">
                                                    {user.address.street && user.address.city
                                                        ? `${user.address.street}, ${user.address.city}`
                                                        : user.address.street || user.address.city}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Account Created */}
                                    {user.createdAt && (
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-500">Tham gia từ</p>
                                                <p className="text-base font-medium text-gray-900">
                                                    {new Date(user.createdAt).toLocaleDateString('vi-VN', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
                                    <button
                                        onClick={() => navigate('/order-list')}
                                        className="w-full py-3 bg-green-50 text-green-600 font-semibold rounded-lg hover:bg-green-100 transition flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        Đơn hàng của tôi
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full py-3 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Đăng Xuất
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default ProfileScreen;

