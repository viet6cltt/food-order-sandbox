import React, { useState, useEffect } from 'react';
import AppLayout from "../../layouts/AppLayout";
import RestaurantForm from "./components/RestaurantForm";
import { useNavigate } from "react-router-dom";
import { getCategories, submitRestaurantRequestWithBanner, getMyRestaurantRequest, type NormalizedCategory, type RestaurantRequestResponse } from './api';
import { toast } from 'react-toastify';

const OwnerRegisterScreen: React.FC<{ className?: string }> = ({ className = '' }) => {
    const navigate = useNavigate();

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
    const [bannerFile, setBannerFile] = useState<File | null>(null);
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

            await submitRestaurantRequestWithBanner(payload, bannerFile);
            
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
                <div className={`min-h-screen flex flex-col justify-center items-center bg-white px-4 sm:px-6 lg:px-8 py-12 ${className}`}>
                    <div className="w-full max-w-2xl">
                        <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-2 border-black/10 border-t-emerald-600 mx-auto mb-4"></div>
                            <p className="text-black/70">Đang kiểm tra trạng thái đăng ký...</p>
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
                <div className={`min-h-screen flex flex-col justify-center items-center bg-white px-4 sm:px-6 lg:px-8 py-12 ${className}`}>
                    <div className="w-full max-w-2xl">
                        <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-8 text-center">
                            <div className="mb-6">
                                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-600 mb-4">
                                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-black mb-2">
                                    Yêu cầu đăng ký đang chờ xử lý
                                </h2>
                                <p className="text-black/70 mb-4">
                                    Bạn đã gửi yêu cầu đăng ký nhà hàng và đang chờ được xác thực.
                                </p>
                            </div>
                            
                            <div className="bg-white rounded-2xl border border-black/10 p-6 mb-6 text-left">
                                <h3 className="font-semibold text-black mb-4">Thông tin yêu cầu:</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-black/70">Tên nhà hàng:</span>
                                        <span className="font-medium text-black">{pendingRequest.restaurantName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-black/70">Địa chỉ:</span>
                                        <span className="font-medium text-black">{pendingRequest.address.full}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-black/70">Số điện thoại:</span>
                                        <span className="font-medium text-black">{pendingRequest.phone}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-black/70">Trạng thái:</span>
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-black text-white">
                                            Đang chờ xử lý
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-black/70">Ngày gửi:</span>
                                        <span className="font-medium text-black">{requestDate}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-black/10 rounded-2xl p-4 mb-6">
                                <p className="text-sm text-black/80">
                                    <strong>Lưu ý:</strong> Yêu cầu của bạn đang được xem xét bởi quản trị viên.
                                    Vui lòng chờ thông báo qua email hoặc kiểm tra lại sau.
                                </p>
                            </div>

                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            <div className={`min-h-screen flex flex-col justify-center items-center bg-white px-4 sm:px-6 lg:px-8 py-12 ${className}`}>
                <div className="w-full max-w-2xl">
                    {error && (
                        <div className="mb-4 p-3 bg-white border border-black/10 text-black rounded-2xl">
                            {error}
                        </div>
                    )}

                    <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6 sm:p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-center text-black">
                                Tạo nhà hàng
                            </h2>
                            <p className="text-center text-sm text-black/70 mt-2">
                                Nhập thông tin nhà hàng và địa chỉ để gửi yêu cầu duyệt.
                            </p>
                        </div>

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
                            onBannerFileChange={setBannerFile}
                            errors={restaurantErrors}
                        />
                        {loadingCategories && (
                            <div className="text-center text-sm text-black/60 mt-3">
                                Đang tải danh sách danh mục...
                            </div>
                        )}

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                {loading ? 'Đang xử lý...' : 'Gửi yêu cầu duyệt'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

export default OwnerRegisterScreen;