import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from '../features/home/HomeScreen';
import LoginScreen from '../features/auth/screens/LoginScreen';
import SignupScreen from '../features/auth/screens/SignupScreen';
import OwnerRegisterScreen from '../features/owner/OwnerRegisterScreen';
import RestaurantDetailScreen from '../features/restaurant/RestaurantDetailScreen';
import CartScreen from '../features/cart/CartScreen';
import FoodDetailScreen from '../features/food/FoodDetailScreen';
import PaymentScreen from '../features/payment/PaymentScreen';
import OrderListScreen from '../features/order/OrderListScreen';
import ResetPasswordScreen from '../features/auth/screens/ResetPasswordScreen';

const AppRoutes: React.FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomeScreen />} />
				<Route path="/login" element={<LoginScreen />} />
				<Route path="/signup" element={<SignupScreen />} />
				<Route path="/reset-password" element={<ResetPasswordScreen />} />
				<Route path="/cart" element={<CartScreen />} />
				<Route path="/payment" element={<PaymentScreen />} />
				<Route path="/restaurant/:restaurantId/*" element={<RestaurantDetailScreen />} />
				<Route path="/food/:foodId" element={<FoodDetailScreen />} />
				<Route path="/owner/register" element={<OwnerRegisterScreen />} />
				<Route path="/orders" element={<OrderListScreen />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	);
};

export default AppRoutes;
