import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from '../features/home/HomeScreen';
import LoginScreen from '../features/auth/LoginScreen';
import SignupScreen from '../features/auth/SignupScreen';
import OwnerRegisterScreen from '../features/owner/OwnerRegisterScreen';
import RestaurantDetailScreen from '../features/restaurant/RestaurantDetailScreen';
import CartScreen from '../features/cart/CartScreen';
import FoodDetailScreen from '../features/food/FoodDetailScreen';
import PaymentScreen from '../features/payment/PaymentScreen';
import OrderListScreen from '../features/order/OrderListScreen';
import OwnerDashboardScreen from '../features/owner/screens/OwnerDashboardScreen';
import OwnerMenuListScreen from '../features/owner/screens/OwnerMenuListScreen';
import AddFoodScreen from '../features/owner/screens/AddFoodScreen';
import OwnerRestaurantInfoScreen from '../features/owner/screens/OwnerRestaurantInfoScreen';
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRedirect from './RoleBasedRedirect';

const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Auth routes */}
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/signup" element={<SignupScreen />} />
                
                {/* Redirect sau khi đăng nhập */}
                <Route path="/redirect" element={<RoleBasedRedirect />} />

                {/* Customer routes */}
                <Route path="/" element={<HomeScreen />} />
                <Route path="/cart" element={
					<ProtectedRoute allowedRoles={['customer']}>
						<CartScreen />
					</ProtectedRoute>
				} />
                <Route path="/payment" element={
					<ProtectedRoute allowedRoles={['customer']}>
						<PaymentScreen />
					</ProtectedRoute>
				} />
                <Route path="/restaurant/:restaurantId/*" element={<RestaurantDetailScreen />} />
                <Route path="/food/:foodId" element={<FoodDetailScreen />} />
                <Route path="/owner/register" element={
					<ProtectedRoute allowedRoles={['customer']}>
						<OwnerRegisterScreen />
					</ProtectedRoute>
				} />
                <Route path="/orders" element={<OrderListScreen />} />

                {/* Owner routes */}
                <Route path="/owner/dashboard/*" element={
                    <ProtectedRoute allowedRoles={['restaurant_owner']}>
                        <OwnerDashboardScreen />
                    </ProtectedRoute>
                } />
                <Route path="/owner/menu-list/*" element={
                    <ProtectedRoute allowedRoles={['restaurant_owner']}>
                        <OwnerMenuListScreen />
                    </ProtectedRoute>
                } />
                <Route path="/owner/add-food/*" element={
                    <ProtectedRoute allowedRoles={['restaurant_owner']}>
                        <AddFoodScreen />
                    </ProtectedRoute>
                } />
                <Route path="/owner/restaurant-info/*" element={
                    <ProtectedRoute allowedRoles={['restaurant_owner']}>
                        <OwnerRestaurantInfoScreen />
                    </ProtectedRoute>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
