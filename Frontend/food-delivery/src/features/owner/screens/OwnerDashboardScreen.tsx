import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderList from '../components/OrderList';
import RevenueWidget from '../components/RevenueWidget';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import OwnerLayout from '../../../layouts/OwnerLayout';
import {Cog6ToothIcon} from '@heroicons/react/24/outline';
import { getMyRestaurant, type Restaurant } from '../api';

const OwnerDashboardScreen: React.FC = () => {
    const navigate = useNavigate();
    const { restaurantId } = useParams<{ restaurantId: string }>();
    
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Current restaurantId from params:", restaurantId);
        const fetchRestaurant = async () => {
            if (!restaurantId) {
                setLoading(false);
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
                        onClick={() => navigate('/owner/restaurants')}
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
                        <button
                            type="button" 
                            className="flex flex-row items-center gap-2 mt-4 p-4 bg-green-200 rounded-full shadow-sm hover:bg-gray-100 text-gray-600 opacity-75 hover:opacity-100 transition-opacity"
                            onClick={() => navigate(`/owner/restaurant-info/${restaurantId}`)} 
                        >
                            <p className="text-black text-sm text-center -translate-y-0.5">Thông tin nhà hàng</p>    
                            <Cog6ToothIcon className="w-6 h-6 text-black opacity-75 hover:opacity-100 transition-opacity" />
                        </button>
                    </div>

                    {/* Revenue Widget */}
                    <div className="mb-6">
                        <RevenueWidget restaurant={restaurant} />
                    </div>

                    {/* Order List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Đơn hàng hôm nay</h2>
                            <OrderList />
                        </div>
                    </div>

                </div>
            </div>
        </OwnerLayout>
    );
};

export default OwnerDashboardScreen;