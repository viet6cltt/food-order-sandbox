import React, { useState, useEffect } from 'react';
import AppLayout from "../../layouts/AppLayout";
import RestaurantForm from "./components/RestaurantForm";
import { useNavigate } from "react-router-dom";
import { getCategories, submitRestaurantRequest, getMyRestaurantRequest, type NormalizedCategory, type RestaurantRequestResponse } from './api';
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
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [categories, setCategories] = useState<NormalizedCategory[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [documentFiles, setDocumentFiles] = useState<File[]>([]);
    const [restaurantErrors, setRestaurantErrors] = useState<{
        name?: string;
        description?: string;
        address?: string;
        phone?: string;
        categoryId?: string;
        latitude?: string;
        longitude?: string;
    }>({});

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [requests, setRequests] = useState<RestaurantRequestResponse[]>([]);
    const [checkingRequest, setCheckingRequest] = useState(true);
    const [activeTab, setActiveTab] = useState<'list' | 'form'>('list');

    // Check for pending request on component mount
    useEffect(() => {
        const checkPendingRequest = async () => {
            setCheckingRequest(true);
            try {
                const data = await getMyRestaurantRequest();
                setRequests(Array.isArray(data) ? data : []);
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
            latitude?: string;
            longitude?: string;
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

        // Validate số lượng documents
        if (documentFiles.length === 0) {
            toast.warning('Vui lòng tải lên ít nhất 1 ảnh giấy phép/giấy tờ');
            return false;
        }

        if (documentFiles.length > 5) {
            toast.error('Tối đa chỉ được tải lên 5 ảnh giấy tờ');
            return false;
        }

        const lat = Number(latitude);
        const lng = Number(longitude);

        if (!latitude.trim()) {
            errors.latitude = 'Vui lòng nhập latitude';
        } else if (Number.isNaN(lat) || lat < -90 || lat > 90) {
            errors.latitude = 'Latitude phải nằm trong khoảng [-90, 90]';
        }

        if (!longitude.trim()) {
            errors.longitude = 'Vui lòng nhập longitude';
        } else if (Number.isNaN(lng) || lng < -180 || lng > 180) {
            errors.longitude = 'Longitude phải nằm trong khoảng [-180, 180]';
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
            const lat = Number(latitude);
            const lng = Number(longitude);
            const payload = {
                restaurantName: name,
                description: description || undefined,
                address: {
                    full: address.full,
                    street: address.street || undefined,
                    ward: address.ward || undefined,
                    district: address.district || undefined,
                    city: address.city || undefined,
                    geo: {
                        type: 'Point' as const,
                        coordinates: [lng, lat] as [number, number], // Backend cần [Long, Lat]
                    },
                },
                phone: restaurantPhone,
                categoriesId: [categoryId],
            };

            await submitRestaurantRequest(payload, bannerFile || undefined, documentFiles);
            
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

    // determine whether any request is pending
    const hasPending = requests.some(r => r.status === 'pending');

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

    

    return (
        <AppLayout>
            <div className={`min-h-screen flex flex-col items-center bg-white px-4 sm:px-6 lg:px-8 py-6 ${className}`}>
                <div className="w-full max-w-2xl">
                    <div className="mb-2 flex items-center justify-between">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setActiveTab('list')}
                                className={`px-3 py-1 rounded-md border ${activeTab === 'list' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-gray-50 border-gray-100 text-black/70'}`}
                            >
                                Danh sách yêu cầu
                            </button>
                            {!hasPending && (
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('form')}
                                    className={`px-3 py-1 rounded-md border ${activeTab === 'form' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-gray-50 border-gray-100 text-black/70'}`}
                                >
                                    Đăng ký mới
                                </button>
                            )}
                        </div>
                    </div>

                    {hasPending && (
                        <div className="mb-3 p-3 rounded-md bg-amber-50 border border-amber-100 text-amber-800 text-sm">
                            Yêu cầu của bạn đã được gửi thành công và đang chờ quản trị viên phê duyệt. Chúng mình sẽ phản hồi bạn trong thời gian sớm nhất!
                        </div>
                    )}

                    {activeTab === 'list' && (
                        <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-4 sm:p-6 mt-0">
                            <h3 className="text-lg font-semibold mb-3">Các yêu cầu đã gửi</h3>
                            {requests.length === 0 ? (
                                <p className="text-sm text-black/60">Bạn chưa gửi yêu cầu nào.</p>
                            ) : (
                                <div className="space-y-3">
                                    {requests.map((req) => {
                                        const statusMap: Record<string, string> = {
                                            pending: 'Đang chờ duyệt',
                                            approved: 'Đã duyệt',
                                            rejected: 'Bị từ chối',
                                        };
                                        const statusColor = req.status === 'pending'
                                            ? 'bg-amber-100 text-amber-800'
                                            : req.status === 'approved'
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-red-100 text-red-800';

                                        return (
                                            <div key={req._id} className="p-3 border rounded-lg flex gap-4 items-center">
                                                {req.bannerUrl ? (
                                                    <img src={req.bannerUrl} alt={req.restaurantName} className="w-20 h-20 object-cover rounded-md" />
                                                ) : (
                                                    <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-400">Ảnh</div>
                                                )}

                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <div className="pr-4">
                                                            <div className="font-semibold text-black">{req.restaurantName}</div>
                                                            {req.description && <div className="text-sm text-black/60 mt-1">{req.description}</div>}
                                                            <div className="text-sm text-black/60 mt-2">{req.address?.full}</div>
                                                            {req.phone && <div className="text-sm text-black/60">SĐT: {req.phone}</div>}
                                                            {Array.isArray(req.categoriesId) && req.categoriesId.length > 0 && (
                                                                <div className="text-xs text-black/50 mt-1">Danh mục: {req.categoriesId.join(', ')}</div>
                                                            )}
                                                            {Array.isArray(req.documents) && (
                                                                <div className="text-xs text-black/50 mt-1">Ảnh hồ sơ: {req.documents.length}</div>
                                                            )}
                                                        </div>

                                                        <div className="text-right">
                                                            <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                                                                {statusMap[req.status] || req.status}
                                                            </div>
                                                            <div className="text-xs text-black/50 mt-2">{new Date(req.createdAt).toLocaleString('vi-VN')}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 bg-white border border-black/10 text-black rounded-2xl">
                            {error}
                        </div>
                    )}

                    {activeTab === 'form' && (
                        <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6 sm:p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-center text-black">
                                Tạo nhà hàng
                            </h2>
                            <p className="text-center text-sm text-black/70 mt-2">
                                Nhập thông tin nhà hàng và vị trí (latitude/longitude) để gửi yêu cầu duyệt.
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

                        <div className="mt-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Hồ sơ pháp lý (Giấy phép kinh doanh, ATTP...) <span className="text-red-500">*</span>
                            </label>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-emerald-500 transition-colors bg-gray-50/50">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            setDocumentFiles(Array.from(e.target.files));
                                        }
                                    }}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                                />
                                {documentFiles.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {documentFiles.map((file, idx) => (
                                            <div key={idx} className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md border border-emerald-200">
                                                {file.name.length > 15 ? file.name.substring(0, 15) + '...' : file.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <p className="mt-2 text-[11px] text-gray-400 italic">Tối đa 5 ảnh, định dạng JPG/PNG</p>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-black mb-1">Latitude</label>
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    step="any"
                                    value={latitude}
                                    onChange={(e) => setLatitude(e.target.value)}
                                    className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                                        restaurantErrors.latitude ? 'border-black' : 'border-black/10'
                                    }`}
                                    placeholder="VD: 10.8231"
                                />
                                {restaurantErrors.latitude && (
                                    <p className="mt-1 text-sm text-black/70">{restaurantErrors.latitude}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black mb-1">Longitude</label>
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    step="any"
                                    value={longitude}
                                    onChange={(e) => setLongitude(e.target.value)}
                                    className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                                        restaurantErrors.longitude ? 'border-black' : 'border-black/10'
                                    }`}
                                    placeholder="VD: 106.6297"
                                />
                                {restaurantErrors.longitude && (
                                    <p className="mt-1 text-sm text-black/70">{restaurantErrors.longitude}</p>
                                )}
                            </div>
                        </div>

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
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

export default OwnerRegisterScreen;