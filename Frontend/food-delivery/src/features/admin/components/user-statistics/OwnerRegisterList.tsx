import React from 'react';
import { CheckIcon, XMarkIcon, UserPlusIcon } from '@heroicons/react/24/outline';

interface OwnerRequest {
    id: string;
    name: string;
    email: string;
    phone: string;
    registerDate: string;
}

interface Props {
    requests: OwnerRequest[];
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

const OwnerRegisterList: React.FC<Props> = ({ requests, onApprove, onReject }) => {
    if (requests.length === 0) return <div className="p-8 text-center text-gray-500">Không có yêu cầu đăng ký nào.</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center">
                <UserPlusIcon className="w-5 h-5 text-orange-600 mr-2" />
                <h3 className="font-bold text-orange-800">Yêu cầu đăng ký Chủ quán ({requests.length})</h3>
            </div>
            <div className="divide-y divide-gray-100">
                {requests.map((req) => (
                    <div key={req.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                        <div>
                            <p className="font-bold text-gray-900">{req.name}</p>
                            <p className="text-sm text-gray-500">{req.email} - {req.phone}</p>
                            <p className="text-xs text-gray-400 mt-1">Ngày đăng ký: {req.registerDate}</p>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => onReject(req.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                            <button onClick={() => onApprove(req.id)} className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold flex items-center text-sm shadow-sm">
                                <CheckIcon className="w-4 h-4 mr-1" /> Duyệt
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OwnerRegisterList;