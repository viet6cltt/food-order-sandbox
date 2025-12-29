import React, { useState, useMemo } from 'react';
import { XMarkIcon, CheckCircleIcon, GiftIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';

// Định nghĩa lại Type đơn giản để không phụ thuộc file khác
interface FoodItem {
    id: string;
    name: string;
    price: number;
    image: string;
    isAvailable: boolean;
    category: string;
}

interface Props {
    items: FoodItem[];
    onClose: () => void;
    onSave: (selectedIds: string[], comboName: string, discountPrice: number) => void;
}

const ComboSelector: React.FC<Props> = ({ items, onClose, onSave }) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [comboName, setComboName] = useState('');
    const [discountPrice, setDiscountPrice] = useState<number>(0);

    // Chỉ lấy món đang có hàng
    const availableItems = useMemo(() => items.filter(i => i.isAvailable), [items]);

    // Tính tổng giá gốc
    const originalTotal = useMemo(() => {
        return items
            .filter(i => selectedIds.includes(i.id))
            .reduce((sum, i) => sum + i.price, 0);
    }, [items, selectedIds]);

    const handleToggle = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const handleConfirm = () => {
        if (!comboName || selectedIds.length < 2) {
            alert("Vui lòng nhập tên combo và chọn ít nhất 2 món!");
            return;
        }
        onSave(selectedIds, comboName, discountPrice || originalTotal);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-green-50">
                    <div className="flex items-center text-green-800">
                        <GiftIcon className="w-6 h-6 mr-2" />
                        <h2 className="text-lg font-bold">Tạo Combo Khuyến Mãi</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-green-100 rounded-full transition">
                        <XMarkIcon className="w-5 h-5 text-green-700" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên Combo</label>
                            <input type="text" placeholder="VD: Combo Trưa Hè..." className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500" value={comboName} onChange={e => setComboName(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VNĐ)</label>
                            <input type="number" placeholder="Nhập giá KM..." className="w-full p-2 border border-gray-300 rounded-lg outline-none font-bold text-green-700 focus:ring-2 focus:ring-green-500" value={discountPrice || ''} onChange={e => setDiscountPrice(Number(e.target.value))} />
                            {originalTotal > 0 && <p className="text-xs text-gray-500 mt-1">Giá gốc: <span className="line-through">{originalTotal.toLocaleString()}đ</span></p>}
                        </div>
                    </div>

                    <h3 className="font-bold text-gray-800 mb-3">Chọn món ăn kèm ({selectedIds.length})</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {availableItems.map(item => {
                            const isSelected = selectedIds.includes(item.id);
                            return (
                                <div key={item.id} onClick={() => handleToggle(item.id)} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all select-none ${isSelected ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'border-gray-200 hover:border-green-300'}`}>
                                    <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${isSelected ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}>{isSelected && <CheckIcon className="w-3.5 h-3.5 text-white" />}</div>
                                    <img src={item.image} alt="" className="w-10 h-10 rounded-md object-cover mr-3" />
                                    <div className="flex-1"><p className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</p><p className="text-xs text-gray-500">{item.price.toLocaleString()}đ</p></div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition">Hủy bỏ</button>
                    <button onClick={handleConfirm} className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-md flex items-center"><CheckCircleIcon className="w-5 h-5 mr-2" /> Tạo Combo</button>
                </div>
            </div>
        </div>
    );
};

export default ComboSelector;