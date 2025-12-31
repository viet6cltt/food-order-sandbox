import React from 'react';
import OwnerLayout from '../../../layouts/OwnerLayout';
import FoodCardList from '../../food/components/FoodCardList';
import AddFoodButton from '../../food/components/AddFoodButton'; // <-- Import nút mới
import { BookOpenIcon } from '@heroicons/react/24/outline';

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
        <OwnerLayout>
            <div className="p-4 pt-8 max-w-4xl mx-auto pb-20 md:pb-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
                        <BookOpenIcon className="w-8 h-8 mr-2 text-indigo-600" />
                        Quản lý Menu
                    </h1>
                    {/* THAY THẾ Placeholder bằng nút thật */}
                    <AddFoodButton />
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
        </OwnerLayout>
    );
};

export default OwnerMenuListScreen;