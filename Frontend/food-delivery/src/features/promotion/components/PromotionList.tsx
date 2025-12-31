// src/features/promotion/components/PromotionList.tsx
import React from 'react';
import type { Promotion } from '../../../types/promotion';
import { PencilSquareIcon, TrashIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

interface Props {
    promotions: Promotion[];           // Nhận danh sách từ cha
    onEdit: (promo: Promotion) => void;
    onDelete: (id: string) => void;    // Nhận hàm xóa từ cha
}

const PromotionList: React.FC<Props> = ({ promotions, onEdit, onDelete }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {promotions.map((promo) => (
                <div key={promo.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition relative overflow-hidden group">
                    {/* Dải màu trạng thái */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${promo.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>

                    <div className="flex justify-between items-start pl-2">
                        <div>
                            <div className="flex items-center space-x-2">
                                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded border border-green-200 uppercase">
                                    {promo.code}
                                </span>
                                {!promo.isActive && <span className="text-xs text-gray-400 font-medium">(Hết hạn)</span>}
                            </div>
                            <h3 className="font-bold text-gray-900 mt-2">{promo.name}</h3>
                            <p className="text-sm text-gray-500 line-clamp-1">{promo.description}</p>

                            <div className="mt-3 flex items-center text-xs text-gray-500">
                                <CalendarDaysIcon className="w-4 h-4 mr-1" />
                                {promo.startDate} - {promo.endDate}
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">
                                {promo.type === 'percent' ? `${promo.value}%` : `${promo.value / 1000}k`}
                            </p>
                            <p className="text-xs text-gray-400 uppercase">Giảm</p>

                            <div className="flex space-x-2 mt-3 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => onEdit(promo)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full"
                                    title="Chỉnh sửa"
                                >
                                    <PencilSquareIcon className="w-5 h-5" />
                                </button>
                                <button
                                    // GẮN SỰ KIỆN XÓA TẠI ĐÂY
                                    onClick={() => onDelete(promo.id)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-full"
                                    title="Xóa khuyến mãi"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PromotionList;