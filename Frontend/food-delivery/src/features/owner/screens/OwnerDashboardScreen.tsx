import React, { useState, useEffect } from 'react';
import OrderList from '../components/OrderList';
import RevenueWidget from '../components/RevenueWidget';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import OwnerLayout from '../../../layouts/OwnerLayout';
import {Cog6ToothIcon} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { getMyRestaurant, type Restaurant } from '../api';

const OwnerDashboardScreen: React.FC = () => {
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

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
                                Tổng Quan Nhà Hàng {restaurant.name}
                            </h1>
                            <p className="text-gray-500 mt-1 ml-11">Chào mừng trở lại! Đây là tình hình kinh doanh hôm nay.</p>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <p className="text-black text-sm text-center mt-4">Restaurant information</p>
                            <button
                                type="button" 
                                className="mt-4 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 text-gray-600 opacity-75 hover:opacity-100 transition-opacity"
                                onClick={() => navigate('/owner/restaurant-info')}
                            >
                                <Cog6ToothIcon className="w-6 h-6 text-black opacity-75 hover:opacity-100 transition-opacity" />
                            </button>
                        </div>
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