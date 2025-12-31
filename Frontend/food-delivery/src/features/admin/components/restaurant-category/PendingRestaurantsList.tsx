import React from 'react';
import { CheckIcon, XMarkIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';

// Định nghĩa kiểu dữ liệu tạm ở đây (hoặc lấy từ types chung)
interface Restaurant {
    id: string;
    name: string;
    ownerName: string;
    address: string;
    registerDate: string;
}

interface Props {
    restaurants: Restaurant[];
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

const PendingRestaurantsList: React.FC<Props> = ({ restaurants, onApprove, onReject }) => {
    if (restaurants.length === 0) {
        return null; // Không có gì chờ duyệt thì ẩn đi
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
            <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex items-center">
                <BuildingStorefrontIcon className="w-6 h-6 text-green-700 mr-2" />
                <h2 className="text-lg font-bold text-green-800">Yêu cầu mở quán mới ({restaurants.length})</h2>
            </div>

            <div className="divide-y divide-gray-100">
                {restaurants.map((res) => (
                    <div key={res.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50 transition">
                        <div className="mb-4 md:mb-0">
                            <h3 className="text-lg font-bold text-gray-900">{res.name}</h3>
                            <p className="text-sm text-gray-500">Chủ quán: <span className="font-medium text-gray-700">{res.ownerName}</span></p>
                            <p className="text-sm text-gray-500">Địa chỉ: {res.address}</p>
                            <p className="text-xs text-gray-400 mt-1">Đăng ký: {res.registerDate}</p>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => onReject(res.id)}
                                className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition"
                            >
                                Từ chối
                            </button>
                            <button
                                onClick={() => onApprove(res.id)}
                                className="px-4 py-2 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-sm transition flex items-center"
                            >
                                <CheckIcon className="w-5 h-5 mr-1" />
                                Duyệt ngay
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PendingRestaurantsList;