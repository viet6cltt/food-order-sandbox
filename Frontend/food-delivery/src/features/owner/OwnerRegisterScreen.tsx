import React, { useState, useEffect } from 'react';
import AppLayout from "../../layouts/AppLayout";
import OwnerRegisterForm from "./components/OwnerRegisterForm";
import RestaurantForm from "./components/RestaurantForm";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getCategories, submitRestaurantRequest, getMyRestaurantRequest, type NormalizedCategory, type RestaurantRequestResponse } from './api';
import { toast } from 'react-toastify';

const OwnerRegisterScreen: React.FC<{ className?: string }> = ({ className = '' }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2>(1);

    // Owner information state
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [ownerErrors, setOwnerErrors] = useState<{ username?: string; email?: string; phone?: string }>({});

    // Restaurant information state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState({
        full: '',
        street: '',
        ward: '',
        district: '',
        city: '',
    });
    const [restaurantPhone, setRestaurantPhone] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState<NormalizedCategory[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [restaurantErrors, setRestaurantErrors] = useState<{
        name?: string;
        description?: string;
        address?: string;
        phone?: string;
        categoryId?: string;
    }>({});

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pendingRequest, setPendingRequest] = useState<RestaurantRequestResponse | null>(null);
    const [checkingRequest, setCheckingRequest] = useState(true);

    // Check for pending request on component mount
    useEffect(() => {
        const checkPendingRequest = async () => {
            setCheckingRequest(true);
            try {
                const request = await getMyRestaurantRequest();
                setPendingRequest(request);
            } catch (err) {
                console.error('Error checking pending request:', err);
                // Nếu lỗi, vẫn cho phép user đăng ký
            } finally {
                setCheckingRequest(false);
            }
        };
        checkPendingRequest();
    }, []);

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            try {
                const categoriesData = await getCategories(1, 100);
                setCategories(categoriesData);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Không thể tải danh sách danh mục. Vui lòng thử lại.');
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    const validateOwnerInfo = (): boolean => {
        const errors: { username?: string; email?: string; phone?: string } = {};
        
        if (!username.trim()) {
            errors.username = 'Vui lòng nhập tên người dùng';
        }
        
        if (!email.trim()) {
            errors.email = 'Vui lòng nhập email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Email không hợp lệ';
        }
        
        if (!phone.trim()) {
            errors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!/^[0-9]{10,11}$/.test(phone.replace(/\s/g, ''))) {
            errors.phone = 'Số điện thoại không hợp lệ';
        }
        
        setOwnerErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateRestaurantInfo = (): boolean => {
        const errors: {
            name?: string;
            description?: string;
            address?: string;
            phone?: string;
            categoryId?: string;
        } = {};
        
        if (!name.trim()) {
            errors.name = 'Vui lòng nhập tên nhà hàng';
        }
        
        if (!address.full.trim()) {
            errors.address = 'Vui lòng nhập địa chỉ đầy đủ';
        }
        
        if (!restaurantPhone.trim()) {
            errors.phone = 'Vui lòng nhập số điện thoại nhà hàng';
        } else if (!/^[0-9]{10,11}$/.test(restaurantPhone.replace(/\s/g, ''))) {
            errors.phone = 'Số điện thoại không hợp lệ';
        }
        
        if (!categoryId.trim()) {
            errors.categoryId = 'Vui lòng chọn danh mục';
        }
        
        setRestaurantErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleNext = () => {
        if (step === 1) {
            if (validateOwnerInfo()) {
                setStep(2);
            }
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
        }
    };

    const handleSubmit = async () => {
        if (!validateRestaurantInfo()) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const payload = {
                restaurantName: name,
                description: description || undefined,
                address: {
                    full: address.full,
                    street: address.street || undefined,
                    ward: address.ward || undefined,
                    district: address.district || undefined,
                    city: address.city || undefined,
                },
                phone: restaurantPhone,
                categoriesId: [categoryId],
            };

            await submitRestaurantRequest(payload);
            
            toast.success('Yêu cầu đăng ký đã được gửi thành công. Vui lòng chờ xử lý.');
            navigate('/');
        } catch (err: unknown) {
            let errorMessage = 'Đăng ký thất bại. Vui lòng thử lại.';
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as { response?: { data?: { error?: string; message?: string } } };
                errorMessage = axiosError.response?.data?.error || axiosError.response?.data?.message || errorMessage;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Show loading state while checking for pending request
    if (checkingRequest) {
        return (
            <AppLayout>
                <div className={`min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-12 ${className}`}>
                    <div className="w-full max-w-2xl">
                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Đang kiểm tra trạng thái đăng ký...</p>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    // Show message if user already has a pending request
    if (pendingRequest) {
        const requestDate = new Date(pendingRequest.createdAt).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return (
            <AppLayout>
                <div className={`min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-12 ${className}`}>
                    <div className="w-full max-w-2xl">
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <div className="mb-6">
                                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                                    <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Yêu cầu đăng ký đang chờ xử lý
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    Bạn đã gửi yêu cầu đăng ký nhà hàng và đang chờ được xác thực.
                                </p>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                                <h3 className="font-semibold text-gray-900 mb-4">Thông tin yêu cầu:</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tên nhà hàng:</span>
                                        <span className="font-medium text-gray-900">{pendingRequest.restaurantName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Địa chỉ:</span>
                                        <span className="font-medium text-gray-900">{pendingRequest.address.full}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Số điện thoại:</span>
                                        <span className="font-medium text-gray-900">{pendingRequest.phone}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Trạng thái:</span>
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            Đang chờ xử lý
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Ngày gửi:</span>
                                        <span className="font-medium text-gray-900">{requestDate}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-blue-800">
                                    <strong>Lưu ý:</strong> Yêu cầu của bạn đang được xem xét bởi quản trị viên. 
                                    Vui lòng chờ thông báo qua email hoặc kiểm tra lại sau.
                                </p>
                            </div>

                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Về trang chủ
                            </button>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className={`min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-12 ${className}`}>
                <div className="w-full max-w-2xl">
                    {/* Progress indicator */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center space-x-4">
                            <div className={`flex items-center ${step >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                    step >= 1 ? 'bg-green-600 border-green-600 text-white' : 'border-gray-300'
                                }`}>
                                    {step > 1 ? '✓' : '1'}
                                </div>
                                <span className="ml-2 font-medium">Thông tin chủ nhà hàng</span>
                            </div>
                            <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                            <div className={`flex items-center ${step >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                    step >= 2 ? 'bg-green-600 border-green-600 text-white' : 'border-gray-300'
                                }`}>
                                    2
                                </div>
                                <span className="ml-2 font-medium">Thông tin nhà hàng</span>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Owner Information */}
                    {step === 1 && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
                                Thông tin chủ nhà hàng
                            </h2>
                            <OwnerRegisterForm
                                username={username}
                                email={email}
                                phone={phone}
                                onUsernameChange={setUsername}
                                onEmailChange={setEmail}
                                onPhoneChange={setPhone}
                                errors={ownerErrors}
                            />
                            <div className="mt-6 flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
                                >
                                    Tiếp theo
                                    <ChevronRightIcon className="ml-2 h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Restaurant Information */}
                    {step === 2 && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
                                Thông tin nhà hàng
                            </h2>
                            <RestaurantForm
                                name={name}
                                description={description}
                                address={address}
                                phone={restaurantPhone}
                                categoryId={categoryId}
                                categories={categories}
                                onNameChange={setName}
                                onDescriptionChange={setDescription}
                                onAddressChange={(field, value) => setAddress(prev => ({ ...prev, [field]: value }))}
                                onPhoneChange={setRestaurantPhone}
                                onCategoryChange={setCategoryId}
                                errors={restaurantErrors}
                            />
                            {loadingCategories && (
                                <div className="text-center text-sm text-gray-500 mt-2">
                                    Đang tải danh sách danh mục...
                                </div>
                            )}
                            <div className="mt-6 flex justify-between">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center"
                                >
                                    <ChevronLeftIcon className="mr-2 h-5 w-5" />
                                    Quay lại
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    {loading ? 'Đang xử lý...' : 'Hoàn tất đăng ký'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

export default OwnerRegisterScreen;