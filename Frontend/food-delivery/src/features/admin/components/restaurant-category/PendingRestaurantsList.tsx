import React from 'react';
import { 
    CheckIcon, 
    XMarkIcon, 
    BuildingStorefrontIcon, 
    PhoneIcon, 
    MapPinIcon, 
    DocumentIcon 
} from '@heroicons/react/24/outline';

interface RestaurantRequest {
    _id: string; 
    userId: string | any;
    restaurantName: string;
    description: string | null;
    address: {
        full: string; 
        street?: string;
        ward?: string;
        district?: string;
        city?: string;
    };
    phone: string;
    documents: string[]; // Mảng các link ảnh/file
    status: "pending" | "approved" | "rejected";
    createdAt: string;
}

interface Props {
    restaurants: RestaurantRequest[];
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

const PendingRestaurantsList: React.FC<Props> = ({ restaurants, onApprove, onReject }) => {
    // Nếu không có data thì không hiện component này
    if (!restaurants || restaurants.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
            {/* Header */}
            <div className="bg-amber-50 px-6 py-5 border-b border-amber-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500 rounded-lg">
                        <BuildingStorefrontIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-amber-900 uppercase">Yêu cầu mở quán</h2>
                        <p className="text-xs text-amber-700 font-medium">Đang chờ xét duyệt ({restaurants.length})</p>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="divide-y divide-gray-50">
                {restaurants.map((res) => (
                    <div key={res._id} className="p-6 hover:bg-gray-50/50 transition-colors">
                        <div className="flex flex-col xl:flex-row justify-between gap-6">
                            
                            {/* Thông tin chi tiết lấy từ Schema */}
                            <div className="space-y-3 flex-1">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{res.restaurantName}</h3>
                                    {res.description && (
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{res.description}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {/* Hiển thị address.full từ Schema */}
                                    <div className="flex items-start gap-2 text-sm text-gray-600">
                                        <MapPinIcon className="w-5 h-5 text-gray-400 shrink-0" />
                                        <span>{res.address.full}</span>
                                    </div>
                                    {/* Hiển thị phone */}
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <PhoneIcon className="w-5 h-5 text-gray-400 shrink-0" />
                                        <span>{res.phone}</span>
                                    </div>
                                </div>

                                {/* Hiển thị mảng documents (Giấy tờ) */}
                                {res.documents && res.documents.length > 0 && (
                                    <div className="pt-2">
                                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Hồ sơ pháp lý:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {res.documents.map((doc, idx) => (
                                                <a 
                                                    key={idx}
                                                    href={doc}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs font-bold text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                                                >
                                                    <DocumentIcon className="w-4 h-4 text-blue-500" />
                                                    Tài liệu {idx + 1}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Nút hành động */}
                            <div className="flex items-center gap-3 shrink-0 self-end xl:self-center">
                                <button
                                    onClick={() => onReject(res._id)}
                                    className="px-5 py-2.5 text-sm font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                                >
                                    Từ chối
                                </button>
                                <button
                                    onClick={() => onApprove(res._id)}
                                    className="px-6 py-2.5 text-sm font-bold text-white bg-green-600 rounded-xl hover:bg-green-700 shadow-md shadow-green-200 flex items-center gap-2 transition-all active:scale-95"
                                >
                                    <CheckIcon className="w-5 h-5" />
                                    Duyệt quán
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PendingRestaurantsList;