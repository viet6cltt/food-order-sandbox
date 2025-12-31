import React, { useState, useEffect } from 'react';
import { XMarkIcon, CheckCircleIcon, TagIcon } from '@heroicons/react/24/outline';

// Định nghĩa kiểu dữ liệu cho Khuyến mãi
export interface Promotion {
    id: string;
    name: string;      // Tên chương trình (VD: Giảm giá mùa hè)
    code: string;      // Mã giảm giá (VD: HE2024)
    type: 'percent' | 'fixed'; // Loại giảm: % hoặc Tiền mặt
    value: number;     // Giá trị giảm
    startDate: string;
    endDate: string;
    isActive: boolean;
}

interface Props {
    initialData?: Promotion | null; // Nếu có dữ liệu là sửa, null là tạo mới
    onClose: () => void;
    onSave: (data: Promotion) => void;
}

const PromotionForm: React.FC<Props> = ({ initialData, onClose, onSave }) => {
    // State form
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [type, setType] = useState<'percent' | 'fixed'>('percent');
    const [value, setValue] = useState<number>(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Load dữ liệu nếu là chế độ Sửa
    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setCode(initialData.code);
            setType(initialData.type);
            setValue(initialData.value);
            setStartDate(initialData.startDate);
            setEndDate(initialData.endDate);
        } else {
            // Reset nếu tạo mới
            setName(''); setCode(''); setType('percent'); setValue(0);
            const today = new Date().toISOString().split('T')[0];
            setStartDate(today); setEndDate(today);
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newPromotion: Promotion = {
            id: initialData ? initialData.id : Date.now().toString(), // Giữ ID cũ nếu sửa
            name, code, type, value, startDate, endDate,
            isActive: initialData ? initialData.isActive : true
        };
        onSave(newPromotion);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in-up overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-green-50">
                    <div className="flex items-center text-green-800">
                        <TagIcon className="w-6 h-6 mr-2" />
                        <h2 className="text-lg font-bold">{initialData ? 'Sửa Khuyến Mãi' : 'Tạo Khuyến Mãi Mới'}</h2>
                    </div>
                    <button onClick={onClose} type="button" className="p-2 hover:bg-green-100 rounded-full transition">
                        <XMarkIcon className="w-5 h-5 text-green-700" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên chương trình</label>
                        <input required type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="VD: Siêu sale 12/12" value={name} onChange={e => setName(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mã Code (bắt buộc)</label>
                            <input required type="text" className="w-full p-2 border rounded-lg font-mono uppercase focus:ring-2 focus:ring-green-500 outline-none" placeholder="SALE50" value={code} onChange={e => setCode(e.target.value.toUpperCase())} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Loại giảm giá</label>
                            <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" value={type} onChange={e => setType(e.target.value as any)}>
                                <option value="percent">Theo Phần trăm (%)</option>
                                <option value="fixed">Theo Tiền mặt (VNĐ)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị giảm {type === 'percent' ? '(%)' : '(VNĐ)'}</label>
                        <input required type="number" min="0" className="w-full p-2 border rounded-lg font-bold text-green-700 focus:ring-2 focus:ring-green-500 outline-none" value={value} onChange={e => setValue(Number(e.target.value))} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                            <input required type="date" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" value={startDate} onChange={e => setStartDate(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                            <input required type="date" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" value={endDate} onChange={e => setEndDate(e.target.value)} />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Hủy</button>
                        <button type="submit" className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 flex items-center">
                            <CheckCircleIcon className="w-5 h-5 mr-2" /> Lưu lại
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PromotionForm;