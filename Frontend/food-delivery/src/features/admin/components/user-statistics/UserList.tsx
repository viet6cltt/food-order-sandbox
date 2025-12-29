import React from 'react';
import { UserIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
}

interface Props {
    users: User[];
    onBan: (id: string) => void;
}

const UserList: React.FC<Props> = ({ users, onBan }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex items-center justify-between">
                <div className="flex items-center">
                    <UserIcon className="w-5 h-5 text-green-700 mr-2" />
                    <h3 className="font-bold text-green-800">Tất cả người dùng ({users.length})</h3>
                </div>
            </div>
            <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vai trò</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${user.role === 'owner' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button onClick={() => onBan(user.id)} className="text-gray-400 hover:text-red-600 transition">
                                    <span className="text-xs font-bold border border-gray-200 px-2 py-1 rounded hover:bg-red-50 hover:border-red-200">Khóa</span>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;