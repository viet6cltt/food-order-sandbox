import React from 'react';
import { 
    CheckIcon, 
    BuildingStorefrontIcon, 
    PhoneIcon, 
    MapPinIcon, 
    DocumentIcon 
} from '@heroicons/react/24/outline';

interface RestaurantRequest {
    _id: string; 
    userId: {
        _id: string,
        username: string;
        email?: string;
    },
    restaurantName: string;
    description: string | null;
    bannerUrl?: string,
    address: {
        full: string; 
        street?: string;
        ward?: string;
        district?: string;
        city?: string;
        geo?: {
            type: string;
            coordinates: [number, number];
        }
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
    if (!restaurants || restaurants.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-amber-50 px-6 py-5 border-b border-amber-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500 rounded-lg">
                            <BuildingStorefrontIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-amber-900 uppercase">Yêu cầu mở quán</h2>
                            <p className="text-xs text-amber-700 font-medium">Đang chờ xét duyệt (0)</p>
                        </div>
                    </div>
                </div>

                <div className="p-10 text-center">
                    <p className="text-sm font-semibold text-gray-800">Không có nhà hàng nào cần duyệt</p>
                    <p className="mt-1 text-sm text-gray-500">Khi có yêu cầu mới, chúng sẽ hiển thị tại đây.</p>
                </div>
            </div>
        );
    }

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
                    <div key={res._id} className="group p-6 hover:bg-gray-50/50 transition-colors">
                        <div className="flex flex-col lg:flex-row gap-6">

                            {/* LEFT: BANNER (Dữ nguyên kích thước) */}
                            {res.bannerUrl && (
                                <div className="w-full lg:w-44 shrink-0">
                                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100">
                                        <img
                                            src={res.bannerUrl}
                                            alt={res.restaurantName}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* RIGHT: CONTENT BOX (Chiếm toàn bộ phần còn lại) */}
                            <div className="flex-1 flex flex-col gap-4">
                                
                                {/* 1. TOP INFO: Name & Requester */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 leading-tight">{res.restaurantName}</h3>
                                        <p className="text-sm text-emerald-600 font-medium mt-0.5">
                                            Người yêu cầu: <span className="text-gray-900">{res.userId?.username || 'N/A'}</span>
                                            <span className="text-gray-400 font-normal ml-2">• {new Date(res.createdAt).toLocaleDateString('vi-VN')}</span>
                                        </p>
                                    </div>
                                    <div className="text-right text-[11px] text-gray-400 uppercase font-bold">
                                        ID: {res._id.slice(-6)}
                                    </div>
                                </div>

                                {/* 2. CONTACT & ADDRESS GRID */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-100">
                                    <div className="flex items-start gap-2 text-sm">
                                        <MapPinIcon className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                                        <span className="text-gray-700 line-clamp-2">{res.address.full}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <PhoneIcon className="w-4 h-4 text-gray-400 shrink-0" />
                                        <span className="font-semibold text-gray-700">{res.phone}</span>
                                    </div>
                                </div>

                                {/* 3. BOTTOM ROW: DOCUMENTS & ACTIONS (NẰM NGANG NHAU) */}
                                <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-4 mt-2">
                                    
                                    {/* Documents bên trái */}
                                    <div className="w-full md:w-auto">
                                        {res.documents?.length > 0 && (
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 ml-1">Hồ sơ pháp lý</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {res.documents.map((doc, idx) => (
                                                        <a
                                                            key={idx}
                                                            href={doc}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-100 bg-blue-50/50 text-xs font-bold text-blue-600 hover:bg-blue-100 transition shadow-sm"
                                                        >
                                                            <DocumentIcon className="w-3.5 h-3.5" />
                                                            Tài liệu {idx + 1}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Buttons bên phải */}
                                    <div className="flex gap-2 shrink-0">
                                        <button
                                            onClick={() => onReject(res._id)}
                                            className="px-5 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition active:scale-95"
                                        >
                                            Từ chối
                                        </button>
                                        <button
                                            onClick={() => onApprove(res._id)}
                                            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-100 flex items-center gap-2 transition active:scale-95"
                                        >
                                            <CheckIcon className="w-5 h-5" />
                                            Duyệt quán
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PendingRestaurantsList;