import React from 'react';
import { type UserProfile } from '../../../types/user';

// Dữ liệu giả
const MOCK_USER: UserProfile = {
    id: 'u123',
    username: 'foodlover99',
    email: 'khachhang@example.com',
    fullName: 'Nguyễn Văn A',
    phone: '0901234567',
    role: 'customer',
    avatarUrl: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=random',
};

const ProfileScreen: React.FC = () => {
    return (
        // KHÔNG dùng AppLayout nữa, tự tạo khung bao
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Giả lập Header cho đẹp */}
            <header className="bg-white shadow p-4 text-center font-bold text-gray-700">
                [Header: Food Delivery]
            </header>

            <div className="flex-grow p-4 md:p-8">
                <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-indigo-600 h-32 flex items-center justify-center">
                        <h1 className="text-white text-2xl font-bold">Hồ sơ cá nhân</h1>
                    </div>
                    <div className="px-6 py-8 relative">
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                            <img
                                src={MOCK_USER.avatarUrl}
                                alt="Avatar"
                                className="w-24 h-24 rounded-full border-4 border-white shadow-md"
                            />
                        </div>
                        <div className="mt-12 text-center">
                            <h2 className="text-xl font-bold text-gray-900">{MOCK_USER.fullName}</h2>
                            <p className="text-sm text-gray-500">@{MOCK_USER.username}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full uppercase">
                                {MOCK_USER.role}
                            </span>
                        </div>
                        <div className="mt-8 space-y-4">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-600">Email</span>
                                <span className="font-medium text-gray-900">{MOCK_USER.email}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-600">Số điện thoại</span>
                                <span className="font-medium text-gray-900">{MOCK_USER.phone}</span>
                            </div>
                        </div>
                        <button className="w-full mt-8 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition">
                            Đăng Xuất
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;