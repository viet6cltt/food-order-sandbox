import React, { useState } from 'react';
import AppLayout from "../../layouts/AppLayout";
import OwnerRegisterForm from "./components/OwnerRegisterForm";
import RestaurantForm from "./components/RestaurantForm";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

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
    const [openingTime, setOpeningTime] = useState('08:00');
    const [closingTime, setClosingTime] = useState('22:00');
    const [restaurantErrors, setRestaurantErrors] = useState<{
        name?: string;
        description?: string;
        address?: string;
        phone?: string;
        openingTime?: string;
        closingTime?: string;
    }>({});

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            openingTime?: string;
            closingTime?: string;
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
        
        if (openingTime && closingTime && openingTime >= closingTime) {
            errors.closingTime = 'Giờ đóng cửa phải sau giờ mở cửa';
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
            // TODO: Gọi API để đăng ký owner và tạo restaurant
            // const response = await registerOwnerAndRestaurant({
            //     owner: { username, email, phone },
            //     restaurant: { name, description, address, phone: restaurantPhone, openingTime, closingTime }
            // });
            
            alert('Đăng ký thành công! (API chưa được implement)');
            navigate('/');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Đăng ký thất bại. Vui lòng thử lại.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

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
                                openingTime={openingTime}
                                closingTime={closingTime}
                                onNameChange={setName}
                                onDescriptionChange={setDescription}
                                onAddressChange={(field, value) => setAddress(prev => ({ ...prev, [field]: value }))}
                                onPhoneChange={setRestaurantPhone}
                                onOpeningTimeChange={setOpeningTime}
                                onClosingTimeChange={setClosingTime}
                                errors={restaurantErrors}
                            />
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