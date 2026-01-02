import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from '../features/home/HomeScreen';
import SearchScreen from '../features/home/SearchScreen';
import CategoryRestaurantsScreen from '../features/home/CategoryRestaurantsScreen';
import LoginScreen from '../features/auth/screens/LoginScreen';
import SignupScreen from '../features/auth/screens/SignupScreen';
import CompleteProfileScreen from '../features/auth/screens/CompleteProfileScreen.tsx';
import OAuthSuccessScreen from '../features/auth/screens/OAuthSuccessScreen.tsx';
import OwnerRegisterScreen from '../features/owner/OwnerRegisterScreen';
import RestaurantDetailScreen from '../features/restaurant/RestaurantDetailScreen';
import CartScreen from '../features/cart/CartScreen';
import FoodDetailScreen from '../features/food/FoodDetailScreen';
import PaymentScreen from '../features/payment/PaymentScreen';
import OrderListScreen from '../features/order/OrderListScreen';
import OwnerDashboardScreen from '../features/owner/screens/OwnerDashboardScreen';
import AddFoodScreen from '../features/owner/screens/AddFoodScreen';
import OwnerRestaurantInfoScreen from '../features/owner/screens/OwnerRestaurantInfoScreen';
import OwnerMenuListScreen from '../features/owner/screens/OwnerMenuListScreen.tsx';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import ResetPasswordRequestScreen from '../features/auth/screens/ResetPasswordRequestScreen';
import ResetPasswordScreen from '../features/auth/screens/ResetPasswordScreen';
import RoleBasedRedirect from './RoleBasedRedirect';
import ProfileScreen from '../features/profile/screens/ProfileScreen';
import AdminDashboardScreen from '../features/admin/screens/AdminDashboardScreen';
import RestaurantCategoryScreen from '../features/admin/screens/RestaurantCategoryScreen';
import AdminReportHandlingScreen from '../features/admin/screens/AdminReportHandlingScreen';
import UserStatisticsScreen from '../features/admin/screens/UserStatisticsScreen';
import AdminRestaurantRequestsScreen from '../features/admin/screens/AdminRestaurantRequestScreen';
const AppRoutes: React.FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/auth/login"
					element={
						<PublicRoute>
							<LoginScreen />
						</PublicRoute>
					}
				/>
				<Route
					path="/auth/signup"
					element={
						<PublicRoute>
							<SignupScreen />
						</PublicRoute>
					}
				/>
				<Route path="/auth/complete-profile" element={<CompleteProfileScreen />} />
				<Route path="/auth/oauth-success" element={<OAuthSuccessScreen />} />
				<Route path="/auth/reset-password-request" element={<ResetPasswordRequestScreen />} />
				<Route path="/auth/reset-password" element={<ResetPasswordScreen />} />


				{/* Customer routes */}
				<Route path="/search" element={<SearchScreen />} />
				{/* <Route path="/category/:categoryId" element={<CategoryRestaurantsScreen />} /> */}
    
				{/* Redirect sau khi đăng nhập */}
				<Route path="/redirect" element={<RoleBasedRedirect />} />
				
				{/* Customer routes */}
				<Route path="/" element={
					<ProtectedRoute allowedRoles={['customer']}>
						<HomeScreen />
					</ProtectedRoute>
				} />
				<Route path="/cart" element={
					<ProtectedRoute allowedRoles={['customer']}>
						<CartScreen />
					</ProtectedRoute>
				} />
				<Route path="/restaurants" element={<SearchScreen />} />
			
				<Route path="/payment" element={
					<ProtectedRoute allowedRoles={['customer']}>
						<PaymentScreen />
					</ProtectedRoute>
				} />
                <Route path="/restaurant/:restaurantId/*" element={
					<ProtectedRoute allowedRoles={['customer']}>
						<RestaurantDetailScreen />
					</ProtectedRoute>
				} />

                <Route path="/food/:foodId" element={
					<ProtectedRoute allowedRoles={['customer']}>
						<FoodDetailScreen />
					</ProtectedRoute>
				} />

                <Route path="/owner/register" element={
					<ProtectedRoute allowedRoles={['customer']}>
						<OwnerRegisterScreen />
					</ProtectedRoute>
				} />

                <Route path="/order-list" element={
					<ProtectedRoute allowedRoles={['customer']}>
						<OrderListScreen />
					</ProtectedRoute>
				} />
                <Route path="/profile" element={
					<ProtectedRoute allowedRoles={['customer', 'restaurant_owner', 'admin']}>
						<ProfileScreen />
					</ProtectedRoute>
				} />

                {/* Owner routes */}
                <Route path="/owner/dashboard/*" element={
                    <ProtectedRoute allowedRoles={['restaurant_owner']}>
                        <OwnerDashboardScreen />
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

				<Route path="/owner/menu-list" element={
						<ProtectedRoute allowedRoles={['restaurant_owner']}>
								<OwnerMenuListScreen />
						</ProtectedRoute>
				} />

				{/** Admin */}
				 <Route path="/admin/dashboard/*" element={
						<ProtectedRoute allowedRoles={['admin']}>
								<AdminDashboardScreen />
						</ProtectedRoute>
				} />

				<Route path="/admin/categories/*" element={
						<ProtectedRoute allowedRoles={['admin']}>
								<RestaurantCategoryScreen />
						</ProtectedRoute>
				} />

				<Route path="/admin/reports/*" element={
						<ProtectedRoute allowedRoles={['admin']}>
								<AdminReportHandlingScreen />
						</ProtectedRoute>
				} />

				<Route path="/admin/users/*" element={
						<ProtectedRoute allowedRoles={['admin']}>
								<UserStatisticsScreen />
						</ProtectedRoute>
				} />

				<Route path="/admin/restaurant-requests/*" element={
						<ProtectedRoute allowedRoles={['admin']}>
								<AdminRestaurantRequestsScreen />
						</ProtectedRoute>
				} />

			</Routes>
		</BrowserRouter>
	);
};

export default AppRoutes;
