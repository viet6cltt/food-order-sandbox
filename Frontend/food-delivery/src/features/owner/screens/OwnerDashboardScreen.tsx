import React, { useState, useEffect, useRef } from 'react';
import OrderList, { type OrderListHandle } from '../components/OrderList';
import RevenueWidget from '../components/RevenueWidget';
import { ArrowPathIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import OwnerLayout from '../../../layouts/OwnerLayout';
import {Cog6ToothIcon} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { getMyRestaurant, type Restaurant } from '../api';

const OwnerDashboardScreen: React.FC = () => {
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const orderListRef = useRef<OrderListHandle | null>(null);
    const [reloadingOrders, setReloadingOrders] = useState(false);
    const [revenueReloadKey, setRevenueReloadKey] = useState(0);

    useEffect(() => {
        const fetchRestaurant = async () => {
            const restaurant = await getMyRestaurant();
            setRestaurant(restaurant);
        };
        fetchRestaurant();
    }, []);

    if (!restaurant) {
        return <div>Loading...</div>;
    }

    return (
        <OwnerLayout>
            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="max-w-6xl mx-auto">

                    {/* Header Dashboard */}
                    <div className="flex flex-row justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                <ChartBarIcon className="w-8 h-8 mr-3 text-green-600" />
                                Tổng Quan Nhà Hàng: {restaurant.name}
                            </h1>
                            <p className="text-gray-500 mt-1 ml-11">Chào mừng trở lại! Đây là tình hình kinh doanh hôm nay.</p>
                        </div>
                        <button
                            type="button" 
                            className="flex flex-row items-center gap-2 mt-4 p-4 bg-green-200 rounded-full shadow-sm hover:bg-gray-100 text-gray-600 opacity-75 hover:opacity-100 transition-opacity"
                            onClick={() => navigate('/owner/restaurant-info')} 
                        >
                            <p className="text-black text-sm text-center -translate-y-0.5">Thông tin nhà hàng</p>    
                            <Cog6ToothIcon className="w-6 h-6 text-black opacity-75 hover:opacity-100 transition-opacity" />
                        </button>
                    </div>

                    {/* Revenue Widget */}
                    <div className="mb-6">
                        <RevenueWidget restaurant={restaurant} reloadKey={revenueReloadKey} />
                    </div>

                    {/* Order List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-900">Đơn hàng hôm nay</h2>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (!orderListRef.current) return;
                                        setReloadingOrders(true);
                                        try {
                                            await orderListRef.current.reload();
                                        } finally {
                                            setReloadingOrders(false);
                                        }
                                    }}
                                    disabled={reloadingOrders}
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ArrowPathIcon className={`w-4 h-4 ${reloadingOrders ? 'animate-spin' : ''}`} />
                                    <span className="text-sm font-medium">Tải lại</span>
                                </button>
                            </div>
                            <OrderList
                                ref={orderListRef}
                                onOrderCompleted={() => setRevenueReloadKey((k) => k + 1)}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </OwnerLayout>
    );
};

export default OwnerDashboardScreen;