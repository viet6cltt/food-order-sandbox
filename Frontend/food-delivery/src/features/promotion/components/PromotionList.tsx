// src/features/promotion/components/PromotionList.tsx
import React from 'react';
import { TagIcon, PencilSquareIcon, TrashIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import type { Promotion } from '../../../types/promotion';

// Mock Data
const MOCK_PROMOTIONS: Promotion[] = [
    { id: '1', code: 'CHAOMOI', name: 'Chào bạn mới', type: 'amount', value: 20000, startDate: '2025-01-01', endDate: '2025-12-31', isActive: true, description: 'Giảm 20k cho đơn đầu tiên' },
    { id: '2', code: 'FREESHIP', name: 'Mã Freeship', type: 'amount', value: 15000, startDate: '2025-02-01', endDate: '2025-02-28', isActive: true, description: 'Miễn phí vận chuyển dưới 3km' },
    { id: '3', code: 'GIAM50', name: 'Giảm 50%', type: 'percent', value: 50, startDate: '2025-03-08', endDate: '2025-03-08', isActive: false, description: 'Flash sale ngày 8/3' },
];

interface Props {
    onEdit: (promo: Promotion) => void;
}

const PromotionList: React.FC<Props> = ({ onEdit }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_PROMOTIONS.map((promo) => (
                <div key={promo.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition relative overflow-hidden">
                    {/* Dải màu trạng thái bên trái */}
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

                            <div className="flex space-x-2 mt-3 justify-end">
                                <button onClick={() => onEdit(promo)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full">
                                    <PencilSquareIcon className="w-5 h-5" />
                                </button>
                                <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-full">
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