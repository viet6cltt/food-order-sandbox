import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout'; // Layout chuẩn
import RealtimeOrderMap from '../components/order-tracking/RealtimeOrderMap';
import OrderFlow from '../components/order-tracking/OrderFlow';
import ActiveOrderList from '../components/order-tracking/ActiveOrderList';

// Mock Data
const MOCK_ORDERS = [
    { id: 'DH001', customer: 'Nguyễn Văn A', shipper: 'Trần Shipper', status: 'delivering' },
    { id: 'DH002', customer: 'Lê Thị B', shipper: 'Phạm Shipper', status: 'preparing' },
    { id: 'DH003', customer: 'Hoàng Văn C', shipper: 'Đang tìm...', status: 'confirmed' },
] as const;

const OrderTrackingScreen: React.FC = () => {
    const [selectedOrderId, setSelectedOrderId] = useState<string>(MOCK_ORDERS[0].id);

    // Lấy thông tin đơn hàng đang chọn
    const selectedOrder = MOCK_ORDERS.find(o => o.id === selectedOrderId) || MOCK_ORDERS[0];

    return (
        <AdminLayout className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Theo dõi Đơn hàng</h1>
                <p className="text-gray-500 text-sm">Giám sát vị trí shipper và trạng thái đơn hàng theo thời gian thực.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Cột trái: Danh sách đơn (1 phần) */}
                <div className="lg:col-span-1">
                    <ActiveOrderList
                        orders={[...MOCK_ORDERS]} // Spread để tránh lỗi readonly types
                        selectedId={selectedOrderId}
                        onSelect={setSelectedOrderId}
                    />
                </div>

                {/* Cột phải: Map & Flow (3 phần) */}
                <div className="lg:col-span-3 space-y-6">
                    {/* 1. Sơ đồ Flow */}
                    <OrderFlow currentStatus={selectedOrder.status} />

                    {/* 2. Bản đồ Realtime */}
                    <div className="h-[500px]">
                        <RealtimeOrderMap
                            shipperName={selectedOrder.shipper}
                            status={selectedOrder.status === 'delivering' ? 'Đang di chuyển tới Khách hàng' : 'Đang chờ tại quán'}
                        />
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
};

export default OrderTrackingScreen;

