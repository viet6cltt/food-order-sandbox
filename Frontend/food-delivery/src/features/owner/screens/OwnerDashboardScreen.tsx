import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderList from '../components/OrderList';
import RevenueWidget from '../components/RevenueWidget';
import { ArrowPathIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import OwnerLayout from '../../../layouts/OwnerLayout';
import {Cog6ToothIcon} from '@heroicons/react/24/outline';
import { getMyRestaurant, type Restaurant } from '../api';
import { type OrderListHandle } from '../components/OrderList';

const OwnerDashboardScreen: React.FC = () => {
    const navigate = useNavigate();
    const { restaurantId } = useParams<{ restaurantId: string }>();
    
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const orderListRef = useRef<OrderListHandle | null>(null);
    const [reloadingOrders, setReloadingOrders] = useState(false);
    const [revenueReloadKey, setRevenueReloadKey] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Current restaurantId from params:", restaurantId);
        const fetchRestaurant = async () => {
            if (!restaurantId || restaurantId === 'null' || restaurantId === 'undefined') {
                setLoading(false);
                setRestaurant(null);
                return;
            }
            try {
                setLoading(true);
                console.log("bne trong:", restaurantId);
                const data = await getMyRestaurant(restaurantId);
                console.log(data);
                setRestaurant(data);
            } catch (error) {
                console.error('Error fetching restaurant:', error);
                setRestaurant(null);
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurant();
    }, [restaurantId]);

    if (loading) {
        return (
            <OwnerLayout>
                <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
                    <div className="text-gray-500">Đang tải...</div>
                </div>
            </OwnerLayout>
        );
    }

    if (!restaurant) {
        return (
            <OwnerLayout>
                <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col items-center justify-center">
                    <p className="text-gray-500 mb-4">Không tìm thấy thông tin nhà hàng</p>
                    <button
                        onClick={() => navigate('/owner/restaurant-list')}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Quay lại danh sách
                    </button>
                </div>
            </OwnerLayout>
        );
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

                        <div className='flex flex-row gap-4'>
                            <button
                            onClick={() => navigate(`/owner/${restaurant._id || restaurant.id}/menu-list`)}
                            className="mt-4 p-4 text-sm font-semibold rounded-full
                                    bg-emerald-50 text-emerald-700 border border-emerald-200
                                    hover:bg-emerald-100 hover:border-emerald-300 transition"
                            >
                                Menu
                            </button>

                            <button
                                type="button" 
                                    className="flex flex-row items-center gap-2 mt-4 p-4 text-sm font-semibold rounded-full
                                            bg-emerald-50 text-emerald-700 border border-emerald-200
                                            hover:bg-emerald-100 hover:border-emerald-300 transition"
                                    onClick={() => navigate(`/owner/${restaurantId}/restaurant-info`)} 
                            >
                                <p className="text-sm font-semibold
                                            bg-emerald-50 text-emerald-700
                                            hover:bg-emerald-100 transition text-center -translate-y-0.5"
                                >
                                    Thông tin nhà hàng
                                </p>    
                                <Cog6ToothIcon className="w-6 h-6 text-sm font-semibold
                                            bg-emerald-50 text-emerald-700
                                            hover:bg-emerald-100 transition" />
                            </button>
                        </div>
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
                                restaurantId={restaurantId || null}
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