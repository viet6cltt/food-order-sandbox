import React, { useEffect, useMemo, useState } from 'react';
import OwnerLayout from '../../../layouts/OwnerLayout';
import OpeningHoursEditor from '../components/OpeningHoursEditor';
import ToggleAcceptOrders from '../components/ToggleAcceptOrders';
import RestaurantForm from '../components/RestaurantForm';
import { toast } from 'react-toastify';
import { getCategories, getMyRestaurant, updateMyRestaurant, type NormalizedCategory } from '../api';
import { useNavigate, useParams } from 'react-router-dom';

const OwnerRestaurantInfoScreen: React.FC = () => {
    const navigate = useNavigate();
    const params = useParams();
    const routeRestaurantId = typeof params.restaurantId === 'string' ? params.restaurantId : null;
    const [categories, setCategories] = useState<NormalizedCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [restaurantId, setRestaurantId] = useState<string>('');
    const [bannerUrl, setBannerUrl] = useState<string>('');

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [restaurantPhone, setRestaurantPhone] = useState('');
    const [address, setAddress] = useState({ full: '', street: '', ward: '', district: '', city: '' });
    const [categoryId, setCategoryId] = useState('');

    const [bankName, setBankName] = useState('');
    const [bankAccountNumber, setBankAccountNumber] = useState('');
    const [bankAccountName, setBankAccountName] = useState('');
    const [qrImageUrl, setQrImageUrl] = useState('');

    const canSave = useMemo(() => {
        return Boolean(name.trim() && restaurantPhone.trim() && address.full.trim() && categoryId);
    }, [name, restaurantPhone, address.full, categoryId]);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const [cats, restaurant] = await Promise.all([
                    getCategories(1, 200),
                    getMyRestaurant(routeRestaurantId),
                ]);
                setCategories(cats);

                if (restaurant) {
                    setRestaurantId(restaurant._id || restaurant.id || '');
                    setBannerUrl(restaurant.bannerUrl || '');
                    setName(restaurant.name || '');
                    setDescription(restaurant.description || '');
                    setRestaurantPhone(restaurant.phone || '');
                    setAddress({
                        full: restaurant.address?.full || '',
                        street: restaurant.address?.street || '',
                        ward: restaurant.address?.ward || '',
                        district: restaurant.address?.district || '',
                        city: restaurant.address?.city || '',
                    });

                    const firstCategory = Array.isArray(restaurant.categoriesId) ? restaurant.categoriesId[0] : '';
                    setCategoryId(typeof firstCategory === 'string' ? firstCategory : '');

                    setBankName(restaurant.paymentInfo?.bankName || '');
                    setBankAccountNumber(restaurant.paymentInfo?.bankAccountNumber || '');
                    setBankAccountName(restaurant.paymentInfo?.bankAccountName || '');
                    setQrImageUrl(restaurant.paymentInfo?.qrImageUrl || '');
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const handleSaveRestaurantInfo = async () => {
        if (!canSave || !restaurantId) return;
        try {
            setSaving(true);
            await updateMyRestaurant(restaurantId, {
                name,
                description,
                phone: restaurantPhone,
                address,
                categoriesId: [categoryId],
                paymentInfo: {
                    bankName: bankName || null,
                    bankAccountNumber: bankAccountNumber || null,
                    bankAccountName: bankAccountName || null,
                    qrImageUrl: qrImageUrl || null,
                },
            });
            toast.success('Lưu thông tin nhà hàng thành công!');    
        } catch (e) {
            console.error(e);
            toast.error('Lưu thất bại. Vui lòng thử lại.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <OwnerLayout>
            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-6">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="text-emerald-600 hover:text-emerald-700 font-medium mb-4 inline-flex items-center"
                        >
                            ← Quay lại
                        </button>
                    </div>

                    {/* Header của trang */}
                    <div className="mb-8 flex flex-row justify-between items-center">
                        <div className="mb-4">
                            <h1 className="text-2xl font-bold text-gray-900">Thiết lập Nhà hàng</h1>
                            <p className="text-gray-500 mt-1">Quản lý thông tin, giờ hoạt động và cấu hình phí vận chuyển.</p>
                        </div>

                        <div>
                            <ToggleAcceptOrders />
                        </div>
                    </div>

                    {/* Hours */}
                    <div className="mb-8 max-w-none">
                        <OpeningHoursEditor />
                    </div>

                    {/* Restaurant info */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Thông tin nhà hàng</h2>
                            <p className="text-sm text-gray-500 mt-1">Cập nhật thông tin hiển thị cho khách hàng.</p>
                        </div>

                        {loading ? (
                            <div className="text-sm text-gray-500">Đang tải dữ liệu...</div>
                        ) : (
                            <>
                                <RestaurantForm
                                    className="max-w-none"
                                    restaurantId={restaurantId}
                                    bannerUrl={bannerUrl}
                                    onBannerUploaded={(url) => setBannerUrl(url)}
                                    name={name}
                                    description={description}
                                    address={address}
                                    phone={restaurantPhone}
                                    categoryId={categoryId}
                                    categories={categories}
                                    onNameChange={setName}
                                    onDescriptionChange={setDescription}
                                    onAddressChange={(field, value) =>
                                        setAddress((prev) => ({ ...prev, [field]: value }))
                                    }
                                    onPhoneChange={setRestaurantPhone}
                                    onCategoryChange={setCategoryId}

                                    showPaymentInfoSection
                                    bankName={bankName}
                                    bankAccountNumber={bankAccountNumber}
                                    bankAccountName={bankAccountName}
                                    qrImageUrl={qrImageUrl}
                                    onBankNameChange={setBankName}
                                    onBankAccountNumberChange={setBankAccountNumber}
                                    onBankAccountNameChange={setBankAccountName}
                                    onQrUploaded={(url) => setQrImageUrl(url)}
                                />

                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="button"
                                        disabled={!canSave || saving}
                                        onClick={handleSaveRestaurantInfo}
                                        className="px-5 py-2.5 rounded-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                                    >
                                        {saving ? 'Đang lưu...' : 'Lưu thông tin'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Nội dung chính: Form Phí Ship
                    <ShippingFeeForm /> */}

                </div>
            </div>
        </OwnerLayout>
    );
};

export default OwnerRestaurantInfoScreen;