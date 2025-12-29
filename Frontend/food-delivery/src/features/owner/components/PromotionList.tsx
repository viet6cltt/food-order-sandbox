import React from 'react';
import { type Promotion } from './PromotionForm';
import { PencilSquareIcon, TrashIcon, CalendarDaysIcon, BanknotesIcon } from '@heroicons/react/24/outline';

interface Props {
    promotions: Promotion[];
    onEdit: (item: Promotion) => void;
    onDelete: (id: string) => void;
    onToggleActive: (id: string) => void;
}

const PromotionList: React.FC<Props> = ({ promotions, onEdit, onDelete, onToggleActive }) => {
    if (promotions.length === 0) {
        return <div className="text-center text-gray-400 py-12 border-2 border-dashed border-gray-200 rounded-xl">Chưa có chương trình khuyến mãi nào.</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {promotions.map((promo) => (
                <div key={promo.id} className={`bg-white p-5 rounded-xl border shadow-sm transition-all hover:shadow-md relative overflow-hidden ${!promo.isActive ? 'opacity-70 grayscale bg-gray-50' : 'border-green-100'}`}>
                    {/* Badge trạng thái */}
                    <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-lg text-xs font-bold ${promo.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                        {promo.isActive ? 'Đang chạy' : 'Tạm dừng'}
                    </div>

                    {/* Nội dung chính */}
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">{promo.name}</h3>
                            <div className="flex items-center text-sm font-mono text-green-600 bg-green-50 px-2 py-0.5 rounded w-fit mt-1">
                                <TagIcon className="w-3.5 h-3.5 mr-1" /> {promo.code}
                            </div>
                        </div>
                    </div>

                    {/* Thông tin chi tiết */}
                    <div className="space-y-1 my-3 text-sm text-gray-600">
                        <div className="flex items-center">
                            <BanknotesIcon className="w-4 h-4 mr-2 text-gray-400" />
                            <span>Giảm: </span>
                            <span className="font-bold text-gray-900 ml-1">
                                {promo.type === 'percent' ? `${promo.value}%` : `${promo.value.toLocaleString()}đ`}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <CalendarDaysIcon className="w-4 h-4 mr-2 text-gray-400" />
                            <span>{promo.startDate} - {promo.endDate}</span>
                        </div>
                    </div>

                    {/* Hành động */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                        {/* Toggle Switch */}
                        <button
                            onClick={() => onToggleActive(promo.id)}
                            className={`relative w-10 h-5 rounded-full transition-colors ${promo.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                            <span className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full shadow transition-transform ${promo.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>

                        <div className="flex space-x-2">
                            <button onClick={() => onEdit(promo)} className="p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
                                <PencilSquareIcon className="w-4 h-4" />
                            </button>
                            <button onClick={() => onDelete(promo.id)} className="p-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Component Icon phụ trợ để đỡ phải import từ thư viện ngoài trong file List
const TagIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.593l6.202-2.126c1.192-.41 1.636-2.022.906-2.93l-6.86-8.577A2.253 2.253 0 0013.738 3h-4.17zM10.5 8.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
);

export default PromotionList;