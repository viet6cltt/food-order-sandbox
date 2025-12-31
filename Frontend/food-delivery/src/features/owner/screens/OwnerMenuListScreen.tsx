import React, { useState } from 'react';
// ✅ Thêm TrashIcon vào import
import { MagnifyingGlassIcon, SparklesIcon, TrashIcon } from '@heroicons/react/24/outline';
import ComboSelector from '../components/ComboSelector';

// --- Interface & Mock Data ---
interface FoodItem {
    id: string;
    name: string;
    price: number;
    image: string;
    isAvailable: boolean;
    category: string;
    description?: string;
}

const INITIAL_MENU: FoodItem[] = [
    { id: '1', name: 'Cơm Tấm Sườn Bì', price: 45000, category: 'Đồ ăn', isAvailable: true, image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&w=200&q=80', description: 'Cơm tấm sài gòn đặc biệt' },
    { id: '2', name: 'Bún Chả Hà Nội', price: 55000, category: 'Đồ ăn', isAvailable: true, image: 'https://images.unsplash.com/photo-1585502693721-39a7384a2055?auto=format&fit=crop&w=200&q=80', description: 'Chuẩn vị Hà Nội' },
    { id: '3', name: 'Trà Sữa Trân Châu', price: 30000, category: 'Đồ uống', isAvailable: true, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=200&q=80', description: 'Đường đen, trân châu dai' },
    { id: '4', name: 'Bánh Flan', price: 15000, category: 'Tráng miệng', isAvailable: true, image: 'https://images.unsplash.com/photo-1551024601-562963525602?auto=format&fit=crop&w=200&q=80' },
];

const OwnerMenuListScreen: React.FC = () => {
    const [menu, setMenu] = useState<FoodItem[]>(INITIAL_MENU);
    const [activeTab, setActiveTab] = useState('Tất cả');
    const [showComboModal, setShowComboModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // --- ACTION: BẬT/TẮT ---
    const handleToggleStatus = (id: string) => {
        setMenu(prev => prev.map(item => item.id === id ? { ...item, isAvailable: !item.isAvailable } : item));
    };

    // --- ACTION: XÓA MÓN/COMBO (Đã khôi phục) ---
    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Bạn có chắc muốn xóa "${name}" khỏi thực đơn không?`)) {
            setMenu(prev => prev.filter(item => item.id !== id));
        }
    };

    // --- ACTION: LƯU COMBO ---
    const handleSaveCombo = (selectedIds: string[], name: string, price: number) => {
        const selectedItems = menu.filter(i => selectedIds.includes(i.id));
        const ingredientsText = "Gồm: " + selectedItems.map(i => i.name).join(' + ');
        const comboImage = selectedItems[0]?.image || 'https://cdn-icons-png.flaticon.com/512/4500/4500196.png';

        const newCombo: FoodItem = {
            id: `combo-${Date.now()}`,
            name: `[Combo] ${name}`,
            price: price,
            category: 'Combo',
            isAvailable: true,
            image: comboImage,
            description: ingredientsText
        };

        setMenu(prev => [newCombo, ...prev]);
        setShowComboModal(false);
        setActiveTab('Combo');
    };

    // --- LOGIC LỌC ---
    const categories = ['Tất cả', 'Đồ ăn', 'Đồ uống', 'Tráng miệng', 'Combo'];
    const filteredMenu = menu.filter(item => {
        const matchCategory = activeTab === 'Tất cả' ? true : item.category === activeTab;
        const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Thực đơn quán</h1>
                    <p className="text-gray-500 text-sm">Quản lý tình trạng món ăn & Combo.</p>
                </div>
                <button onClick={() => setShowComboModal(true)} className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 shadow-sm transition">
                    <SparklesIcon className="w-5 h-5 mr-1" /> Tạo Combo
                </button>
            </div>

            {/* Tìm kiếm & Tabs */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm nhanh món ăn..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setActiveTab(cat)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === cat ? 'bg-green-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* List Món Ăn */}
            <div className="grid grid-cols-1 gap-4">
                {filteredMenu.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4 hover:shadow-md transition-all group">
                        {/* Ảnh */}
                        <img src={item.image} alt={item.name} className={`w-16 h-16 rounded-lg object-cover border ${item.isAvailable ? '' : 'grayscale opacity-60'}`} />

                        {/* Thông tin */}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                            {item.description && (
                                <p className="text-xs text-gray-500 mb-1 line-clamp-2 italic">
                                    {item.description}
                                </p>
                            )}
                            <p className="text-green-600 font-bold text-sm">{item.price.toLocaleString()}đ</p>
                        </div>

                        {/* Actions: Nút Gạt & Nút Xóa */}
                        <div className="flex flex-col items-end gap-3 pl-2">
                            <button
                                onClick={() => handleToggleStatus(item.id)}
                                className={`relative w-10 h-5 rounded-full transition-colors ${item.isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}
                                title={item.isAvailable ? "Đang bán (Bấm để tắt)" : "Hết hàng (Bấm để bật)"}
                            >
                                <span className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full shadow transition-transform ${item.isAvailable ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>

                            {/* Nút Xóa: Chỉ hiện khi hover vào dòng (trên PC) hoặc luôn hiện (trên mobile) */}
                            <button
                                onClick={() => handleDelete(item.id, item.name)}
                                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Xóa món này"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredMenu.length === 0 && (
                <div className="text-center text-gray-400 py-10 mt-4">Không tìm thấy món nào.</div>
            )}

            {showComboModal && <ComboSelector items={menu} onClose={() => setShowComboModal(false)} onSave={handleSaveCombo} />}
        </div>
    );
};

export default OwnerMenuListScreen;