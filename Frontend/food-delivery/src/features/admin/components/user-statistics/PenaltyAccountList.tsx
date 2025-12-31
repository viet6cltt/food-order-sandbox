import React from 'react';
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';

interface PenaltyUser {
    id: string;
    name: string;
    email: string;
    reason: string; // Lý do bị khóa
    bannedDate: string;
}

interface Props {
    users: PenaltyUser[];
    onUnlock: (id: string) => void;
}

const PenaltyAccountList: React.FC<Props> = ({ users, onUnlock }) => {
    if (users.length === 0) return <div className="p-8 text-center text-gray-500">Không có tài khoản nào bị khóa.</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
            <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center">
                <LockClosedIcon className="w-5 h-5 text-red-600 mr-2" />
                <h3 className="font-bold text-red-800">Danh sách Vi phạm / Bị khóa ({users.length})</h3>
            </div>
            <div className="divide-y divide-gray-100">
                {users.map((user) => (
                    <div key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3 text-red-600">
                                <LockClosedIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{user.name}</p>
                                <p className="text-sm text-red-500">Lý do: {user.reason}</p>
                                <p className="text-xs text-gray-400">Ngày khóa: {user.bannedDate}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => onUnlock(user.id)}
                            className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 font-medium text-sm flex items-center"
                        >
                            <LockOpenIcon className="w-4 h-4 mr-1" /> Mở khóa
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PenaltyAccountList;