import React from 'react';
import { UserIcon } from '@heroicons/react/24/outline';

interface User {
    _id: string;
    firstname?: string;
    lastname?: string;
    email: string;
    role: string;
    status: string;
    username: string;
    phone: string;
}

interface Props {
    users: User[];
    onBan: (id: string) => void;
}

const UserList: React.FC<Props> = ({ users, onBan }) => {
    if (users.length === 0) {
        return (
            <div className="bg-white p-10 text-center rounded-xl border border-gray-200">
                <UserIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Không có người dùng nào hoạt động.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Thành viên</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Thông tin liên hệ</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vai trò</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                                            {user.lastname?.charAt(0) || '?'}
                                        </div>
                                        <div className="ml-3">
                                            {/* Tên đầy đủ: Kiểm tra cả lastname và firstname */}
                                            <div className="text-sm font-bold text-gray-900">
                                                {user.lastname || user.firstname 
                                                    ? `${user.lastname ?? ''} ${user.firstname ?? ''}`.trim() 
                                                    : 'Không Rõ'}
                                            </div>

                                            {/* Username: Nếu undefined thì hiện @khongro */}
                                            <div className="text-xs text-gray-400 italic">
                                                @{user.username ?? 'khongro'}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600">{user.email}</div>
                                    <div className="text-xs text-gray-500">{user.phone || 'Chưa cập nhật SĐT'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-md shadow-sm border ${
                                        user.role === 'owner' 
                                            ? 'bg-purple-50 text-purple-700 border-purple-100' 
                                            : 'bg-blue-50 text-blue-700 border-blue-100'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                                        <span className="text-sm text-gray-600 capitalize">{user.status}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <button 
                                        onClick={() => onBan(user._id)} 
                                        className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-100 transition-all active:scale-95"
                                    >
                                        Khóa tài khoản
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;