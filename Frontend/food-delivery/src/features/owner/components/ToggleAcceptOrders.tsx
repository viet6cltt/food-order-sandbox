// src/features/owner/components/ToggleAcceptOrders.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getMyRestaurant, updateMyRestaurant } from '../api';

const ToggleAcceptOrders: React.FC = () => {
    const params = useParams();
    const restaurantId = typeof params.restaurantId === 'string' ? params.restaurantId : null;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                const restaurant = await getMyRestaurant(restaurantId);
                if (!alive) return;

                if (!restaurantId) {
                    toast.error('Thiếu mã nhà hàng');
                    return;
                }

                // Backend coi "operational" dựa trên isActive (và một số flow khác dùng isAcceptingOrders)
                // nên ưu tiên đọc isActive, fallback sang isAcceptingOrders.
                if (restaurant && typeof restaurant.isActive === 'boolean') {
                    setIsOpen(restaurant.isActive);
                } else {
                    setIsOpen(restaurant?.isAcceptingOrders !== false);
                }
            } catch (err) {
                console.error(err);
                toast.error('Không tải được trạng thái nhà hàng');
            } finally {
                if (alive) setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [restaurantId]);

    const onToggle = async () => {
        if (!restaurantId) {
            toast.error('Thiếu mã nhà hàng');
            return;
        }

        const next = !isOpen;
        setSaving(true);
        setIsOpen(next);

        try {
            // Sync both flags to avoid inconsistent behavior across screens/APIs
            await updateMyRestaurant(restaurantId, { isActive: next, isAcceptingOrders: next });
        } catch (err) {
            console.error(err);
            setIsOpen(!next);
            toast.error('Cập nhật trạng thái thất bại');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex items-center justify-between">
            <div>
                <h3 className="text-lg font-bold text-gray-900">Trạng thái Nhà hàng</h3>
                <p className={`text-sm font-medium ${isOpen ? 'text-emerald-600' : 'text-red-500'}`}>
                    {isOpen ? 'Đang mở cửa - Nhận đơn' : 'Đang đóng cửa - Tạm ngưng'}
                </p>
            </div>

            {/* Toggle Switch Button */}
            <button
                disabled={loading || saving}
                onClick={onToggle}
                className={`relative inline-flex ml-4 h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                    isOpen ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
            >
                <span className="sr-only">Toggle shop status</span>
                <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isOpen ? 'translate-x-7' : 'translate-x-1'
                        }`}
                />
            </button>
        </div>
    );
};

export default ToggleAcceptOrders;