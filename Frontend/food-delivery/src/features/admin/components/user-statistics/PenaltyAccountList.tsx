import React from 'react';
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';

// 1. Cập nhật Interface để khớp với dữ liệu thực tế từ BE
interface PenaltyUser {
    _id: string; // MongoDB sử dụng _id
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    status: string;
    bannedReason?: string; // Trường này nếu bạn lưu lý do khóa ở BE
    updatedAt: string;     // Dùng để hiển thị ngày bị khóa
}

interface Props {
    users: PenaltyUser[];
    onUnlock: (id: string) => void;
}

const PenaltyAccountList: React.FC<Props> = ({ users, onUnlock }) => {
    if (users.length === 0) {
        return (
            <div className="p-12 text-center bg-white rounded-xl border border-dashed border-gray-300 mt-6">
                <LockOpenIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Không có tài khoản nào đang bị khóa.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
            {/* Header */}
            <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center justify-between">
                <div className="flex items-center">
                    <LockClosedIcon className="w-5 h-5 text-red-600 mr-2" />
                    <h3 className="font-bold text-red-800 uppercase tracking-wider text-sm">
                        Danh sách vi phạm / Đã khóa ({users.length})
                    </h3>
                </div>
            </div>

            {/* List Body */}
            <div className="divide-y divide-gray-100">
                {users.map((user) => (
                    <div key={user._id} className="p-5 flex items-center justify-between hover:bg-red-50/30 transition-colors group">
                        <div className="flex items-center space-x-4">
                            {/* Avatar Icon */}
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 ring-2 ring-white">
                                <LockClosedIcon className="w-6 h-6" />
                            </div>

                            <div>
                                {/* Ghép Họ và Tên + Username */}
                                <div className="flex items-center space-x-2">
                                    <p className="font-bold text-gray-900">
                                        {user.lastname} {user.firstname}
                                    </p>
                                    <span className="text-xs text-gray-400 font-normal">
                                        @{user.username}
                                    </span>
                                </div>

                                {/* Thông tin liên hệ */}
                                <p className="text-xs text-gray-500 mb-1">{user.email}</p>

                                {/* Lý do và Ngày khóa */}
                                <div className="flex flex-col space-y-0.5">
                                    <p className="text-sm text-red-600 font-medium">
                                        Lý do: <span className="font-normal">{user.bannedReason || 'Vi phạm điều khoản hệ thống'}</span>
                                    </p>
                                    <p className="text-[11px] text-gray-400 italic">
                                        Ngày khóa: {new Date(user.updatedAt).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Nút thao tác */}
                        <button
                            onClick={() => onUnlock(user._id)} // Truyền đúng _id
                            className="flex items-center px-4 py-2 bg-white border border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-200 font-bold text-sm shadow-sm"
                        >
                            <LockOpenIcon className="w-4 h-4 mr-2" />
                            Mở khóa
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PenaltyAccountList;