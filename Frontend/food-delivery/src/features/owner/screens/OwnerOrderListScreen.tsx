// src/features/owner/screens/OwnerOrderListScreen.tsx
import React, { useState, useMemo } from 'react';
import OrderTable from '../components/OrderTable';
import type { Order, OrderStatus } from '../../../types/order';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

// Mock Data (Giữ nguyên)
const MOCK_ORDERS: Order[] = [
    {
        _id: '65f1a2b3c4d5e6f7a8b9c001',
        restaurantId: 'res1',
        restaurantName: 'Quán Ngon',
        customerName: 'Nguyễn Văn A',
        items: [{ menuItemId: 'm1', name: 'Phở Bò', price: 50000, quantity: 1 }],
        totalPrice: 50000,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentMethod: 'COD'
    },
    {
        _id: '65f1a2b3c4d5e6f7a8b9c002',
        restaurantId: 'res1',
        restaurantName: 'Quán Ngon',
        customerName: 'Trần Thị B',
        items: [{ menuItemId: 'm3', name: 'Cơm Rang', price: 60000, quantity: 2 }],
        totalPrice: 120000,
        status: 'cooking',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentMethod: 'Banking'
    },
    {
        _id: '65f1a2b3c4d5e6f7a8b9c003',
        restaurantId: 'res1',
        restaurantName: 'Quán Ngon',
        customerName: 'Lê Văn C',
        items: [{ menuItemId: 'm4', name: 'Bún Chả', price: 45000, quantity: 1 }],
        totalPrice: 45000,
        status: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentMethod: 'COD'
    },
    {
        _id: '65f1a2b3c4d5e6f7a8b9c004',
        restaurantId: 'res1',
        restaurantName: 'Quán Ngon',
        customerName: 'Phạm Văn D',
        items: [{ menuItemId: 'm5', name: 'Trà Sữa', price: 25000, quantity: 4 }],
        totalPrice: 100000,
        status: 'canceled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentMethod: 'Banking'
    },
];

// Định nghĩa các Tab lọc
type TabType = 'all' | OrderStatus;
const TABS: { id: TabType; label: string }[] = [
    { id: 'all', label: 'Tất cả' },
    { id: 'pending', label: 'Chờ xác nhận' },
    { id: 'cooking', label: 'Đang nấu' },
    { id: 'delivering', label: 'Đang giao' },
    { id: 'completed', label: 'Hoàn thành' },
    { id: 'canceled', label: 'Đã hủy' },
];

const OwnerOrderListScreen: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
    const [activeTab, setActiveTab] = useState<TabType>('all'); // State lưu tab đang chọn

    const handleUpdateStatus = (id: string, newStatus: OrderStatus) => {
        const updatedOrders = orders.map(order =>
            order._id === id ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
    };

    // --- LOGIC LỌC ĐƠN HÀNG ---
    const filteredOrders = useMemo(() => {
        if (activeTab === 'all') return orders;
        return orders.filter(order => order.status === activeTab);
    }, [orders, activeTab]);

    // --- LOGIC ĐẾM SỐ LƯỢNG CHO TỪNG TAB ---
    const getCount = (tabId: TabType) => {
        if (tabId === 'all') return orders.length;
        return orders.filter(o => o.status === tabId).length;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <ClipboardDocumentListIcon className="w-8 h-8 mr-3 text-green-600" />
                        Quản lý Đơn hàng
                    </h1>
                </div>

                {/* THANH TAB BỘ LỌC (Mới thêm vào) */}
                <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
                    {TABS.map((tab) => {
                        const count = getCount(tab.id);
                        const isActive = activeTab === tab.id;

                        // Ẩn tab nếu không có đơn nào (trừ tab Tất cả) - Tùy chọn, ở đây tôi để hiện hết
                        // if (count === 0 && tab.id !== 'all') return null;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-2
                                    ${isActive
                                        ? 'bg-green-600 text-white shadow-md'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}
                                `}
                            >
                                <span>{tab.label}</span>
                                <span className={`
                                    ml-2 px-2 py-0.5 rounded-full text-xs font-bold
                                    ${isActive ? 'bg-white text-green-600' : 'bg-gray-100 text-gray-500'}
                                `}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Bảng đơn hàng (Truyền danh sách ĐÃ LỌC) */}
                <OrderTable orders={filteredOrders} onUpdateStatus={handleUpdateStatus} />
            </div>
        </div>
    );
};

export default OwnerOrderListScreen;