import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from '../features/home/HomeScreen';
import LoginScreen from '../features/auth/screens/LoginScreen';
import SignupScreen from '../features/auth/screens/SignupScreen';
// import OwnerRegisterScreen from '../features/owner/OwnerRegisterScreen';
// import RestaurantDetailScreen from '../features/restaurant/RestaurantDetailScreen';
// import CartScreen from '../features/cart/CartScreen';
// import FoodDetailScreen from '../features/food/FoodDetailScreen';
// import PaymentScreen from '../features/payment/PaymentScreen';
import OrderListScreen from '../features/order/OrderListScreen';
import ResetPasswordRequestScreen from '../features/auth/screens/ResetPasswordRequestScreen';
import ResetPasswordScreen from '../features/auth/screens/ResetPasswordScreen';
// import ProtectedRoute from './ProtectedRoute';
// import RoleBasedRedirect from './RoleBasedRedirect';
// import ProfileScreen from '../features/profile/screens/ProfileScreen';

const AppRoutes: React.FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomeScreen />} />
				<Route path="/login" element={<LoginScreen />} />
				<Route path="/signup" element={<SignupScreen />} />
				<Route path="/order-list" element={<OrderListScreen />} />
				<Route path="/reset-password-request" element={<ResetPasswordRequestScreen />} />
				<Route path="/reset-password" element={<ResetPasswordScreen />} />
				
				 
			</Routes>
		</BrowserRouter>
	);
};

export default AppRoutes;
