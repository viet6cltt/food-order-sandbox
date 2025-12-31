import React from 'react';
import { MapPinIcon } from '@heroicons/react/24/solid';

interface Props {
    shipperName: string;
    status: string;
}

const RealtimeOrderMap: React.FC<Props> = ({ shipperName, status }) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <MapPinIcon className="w-5 h-5 text-green-600 mr-2" />
                Bản đồ lộ trình
            </h3>

            {/* KHUNG BẢN ĐỒ GIẢ LẬP */}
            <div className="relative flex-1 bg-blue-50 rounded-lg overflow-hidden border border-blue-100 min-h-[400px]">
                {/* 1. Nền bản đồ (Vẽ đường phố bằng CSS) */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#6b7280 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}>
                </div>

                {/* Đường phố giả */}
                <div className="absolute top-1/2 left-0 w-full h-4 bg-white shadow-sm transform -translate-y-1/2"></div>
                <div className="absolute top-0 left-1/3 w-4 h-full bg-white shadow-sm transform -translate-x-1/2"></div>

                {/* 2. Vị trí Cửa hàng (Cố định) */}
                <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="w-8 h-8 bg-orange-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-bounce">
                        <span className="text-white font-bold text-xs">Shop</span>
                    </div>
                </div>

                {/* 3. Vị trí Khách hàng (Cố định) */}
                <div className="absolute top-20 right-20 flex flex-col items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">User</span>
                    </div>
                </div>

                {/* 4. Vị trí Shipper (Mô phỏng di chuyển) */}
                {/* Dùng animation pulse để tạo hiệu ứng radar */}
                <div className="absolute top-1/2 left-1/2 transform transition-all duration-1000 ease-in-out">
                    <div className="relative">
                        <span className="absolute -top-1 -left-1 w-10 h-10 bg-green-500 rounded-full opacity-30 animate-ping"></span>
                        <div className="w-8 h-8 bg-green-600 rounded-full border-2 border-white shadow-xl flex items-center justify-center z-10 relative">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                                <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
                                <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" />
                                <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                            </svg>
                        </div>
                        {/* Tooltip Shipper */}
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                            {shipperName}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-3 text-sm text-gray-500 flex justify-between">
                <span>Trạng thái: <b className="text-green-600">{status}</b></span>
                <span>Tốc độ: 35km/h</span>
            </div>
        </div>
    );
};

export default RealtimeOrderMap;