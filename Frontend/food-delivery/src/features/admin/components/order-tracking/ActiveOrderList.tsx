import React from 'react';

interface Order {
    id: string;
    customer: string;
    shipper: string;
    status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'completed';
}

interface Props {
    orders: Order[];
    selectedId: string;
    onSelect: (id: string) => void;
}

const ActiveOrderList: React.FC<Props> = ({ orders, selectedId, onSelect }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b border-gray-100 bg-green-50">
                <h3 className="font-bold text-green-800">Đơn hàng trực tuyến</h3>
                <p className="text-xs text-green-600">Cập nhật mỗi 30s</p>
            </div>

            <div className="overflow-y-auto flex-1 p-2 space-y-2">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        onClick={() => onSelect(order.id)}
                        className={`
                            p-3 rounded-lg cursor-pointer border transition-all
                            ${selectedId === order.id
                                ? 'bg-green-50 border-green-500 shadow-sm'
                                : 'bg-white border-transparent hover:bg-gray-50 border-gray-100'}
                        `}
                    >
                        <div className="flex justify-between items-start">
                            <span className="font-bold text-gray-800">#{order.id}</span>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full 
                                ${order.status === 'delivering' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                                {order.status}
                            </span>
                        </div>
                        <div className="mt-1">
                            <p className="text-xs text-gray-500">Khách: {order.customer}</p>
                            <p className="text-xs text-gray-500">Shipper: {order.shipper}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActiveOrderList;