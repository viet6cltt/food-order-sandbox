import React from 'react';

interface User {
    _id: string;
    firstname: string;
    lastname: string;
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
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* ... Header giữ nguyên ... */}
            <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Họ và Tên</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Liên hệ</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vai trò</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                            {/* GHÉP TÊN TẠI ĐÂY */}
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {`${user.lastname} ${user.firstname}`}
                            </td>
                            
                            <td className="px-6 py-4 text-sm text-gray-500 italic">
                                @{user.username}
                            </td>

                            <td className="px-6 py-4 text-sm text-gray-500">
                                <div>{user.email}</div>
                                <div className="text-xs text-gray-400">{user.phone}</div>
                            </td>

                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${
                                    user.role === 'owner' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {user.role}
                                </span>
                            </td>

                            <td className="px-6 py-4 text-right">
                                <button 
                                    onClick={() => onBan(user._id)} 
                                    className="text-red-500 hover:text-red-700 font-semibold text-xs border border-red-100 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                                >
                                    Khóa tài khoản
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