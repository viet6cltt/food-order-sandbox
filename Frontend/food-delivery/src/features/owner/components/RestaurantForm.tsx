import React, { useEffect, useMemo, useState } from 'react';
import { uploadMyRestaurantPaymentQr, uploadRestaurantBanner, type NormalizedCategory } from '../api';

interface RestaurantFormProps {
    className?: string;
    restaurantId?: string;
    bannerUrl?: string;
    onBannerUploaded?: (url: string) => void;
    onBannerFileChange?: (file: File | null) => void;
    name: string;
    description: string;
    address: {
        full: string;
        street?: string;
        ward?: string;
        district?: string;
        city?: string;
    };
    phone: string;
    categoryId: string;
    categories: NormalizedCategory[];
    onNameChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onAddressChange: (field: 'full' | 'street' | 'ward' | 'district' | 'city', value: string) => void;
    onPhoneChange: (value: string) => void;
    onCategoryChange: (value: string) => void;

    // Optional: payment info section (used in owner settings screen)
    showPaymentInfoSection?: boolean;
    bankName?: string;
    bankAccountNumber?: string;
    bankAccountName?: string;
    qrImageUrl?: string;
    onBankNameChange?: (value: string) => void;
    onBankAccountNumberChange?: (value: string) => void;
    onBankAccountNameChange?: (value: string) => void;
    onQrUploaded?: (url: string) => void;
    errors?: {
        name?: string;
        description?: string;
        address?: string;
        phone?: string;
        categoryId?: string;
    };
}

const RestaurantForm: React.FC<RestaurantFormProps> = ({ 
    className = '',
    restaurantId,
    bannerUrl,
    onBannerUploaded,
    onBannerFileChange,
    name,
    description,
    address,
    phone,
    categoryId,
    categories,
    onNameChange,
    onDescriptionChange,
    onAddressChange,
    onPhoneChange,
    onCategoryChange,
    showPaymentInfoSection = false,
    bankName = '',
    bankAccountNumber = '',
    bankAccountName = '',
    qrImageUrl = '',
    onBankNameChange,
    onBankAccountNumberChange,
    onBankAccountNameChange,
    onQrUploaded,
    errors = {}
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const previewUrl = useMemo(() => {
        if (restaurantId) return '';
        if (!selectedFile) return '';
        return URL.createObjectURL(selectedFile);
    }, [restaurantId, selectedFile]);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const [selectedQrFile, setSelectedQrFile] = useState<File | null>(null);
    const [uploadingQr, setUploadingQr] = useState(false);
    const [uploadQrError, setUploadQrError] = useState<string | null>(null);

    const handleUploadBanner = async () => {
        if (!restaurantId) {
            setUploadError('Thiếu restaurantId. Vui lòng tải lại trang.');
            return;
        }
        if (!selectedFile) {
            setUploadError('Vui lòng chọn ảnh banner.');
            return;
        }

        try {
            setUploadError(null);
            setUploading(true);
            const updated = await uploadRestaurantBanner(restaurantId, selectedFile);
            const url = updated.bannerUrl || '';
            if (url && onBannerUploaded) onBannerUploaded(url);
            setSelectedFile(null);
        } catch (e) {
            console.error(e);
            setUploadError('Upload banner thất bại. Vui lòng thử lại.');
        } finally {
            setUploading(false);
        }
    };

    const handleUploadQr = async () => {
        if (!restaurantId) {
            setUploadQrError('Thiếu restaurantId. Vui lòng tải lại trang.');
            return;
        }
        if (!selectedQrFile) {
            setUploadQrError('Vui lòng chọn ảnh QR.');
            return;
        }

        try {
            setUploadQrError(null);
            setUploadingQr(true);
            const updated = await uploadMyRestaurantPaymentQr(restaurantId, selectedQrFile);
            const url = updated.paymentInfo?.qrImageUrl || '';
            if (url && onQrUploaded) onQrUploaded(url);
            setSelectedQrFile(null);
        } catch (e) {
            console.error(e);
            setUploadQrError('Upload QR thất bại. Vui lòng thử lại.');
        } finally {
            setUploadingQr(false);
        }
    };

    return (
        <div className={className}>
            <form className="w-full">
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ảnh banner
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                setSelectedFile(file);
                                setUploadError(null);
                                if (!restaurantId) {
                                    onBannerFileChange?.(file);
                                }
                            }}
                            className="w-full sm:flex-1 block text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                        />
                        {restaurantId ? (
                            <button
                                type="button"
                                disabled={!selectedFile || uploading || !restaurantId}
                                onClick={handleUploadBanner}
                                className="px-4 py-2 rounded-md font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                            >
                                {uploading ? 'Đang tải...' : 'Tải lên'}
                            </button>
                        ) : (
                            <div className="text-xs text-gray-500">
                                Ảnh sẽ được tải lên khi bạn bấm “Gửi yêu cầu duyệt”.
                            </div>
                        )}
                    </div>

                    {uploadError && (
                        <p className="mt-2 text-sm text-red-600">{uploadError}</p>
                    )}

                    {(bannerUrl || previewUrl) && (
                        <div className="mt-3">
                            <img
                                src={bannerUrl || previewUrl}
                                alt="Banner"
                                className="w-full max-h-48 object-contain rounded-lg border border-gray-100"
                            />
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Tên nhà hàng <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        placeholder='Nhập tên nhà hàng'
                        value={name}
                        onChange={(e) => onNameChange(e.target.value)}
                        required
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-sm placeholder:text-gray-400 placeholder:opacity-70 ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Mô tả
                    </label>
                    <textarea
                        id="description"
                        placeholder='Nhập mô tả về nhà hàng'
                        value={description}
                        onChange={(e) => onDescriptionChange(e.target.value)}
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-sm placeholder:text-gray-400 placeholder:opacity-70 ${
                            errors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="address-full" className="block text-sm font-medium text-gray-700 mb-1">
                        Địa chỉ đầy đủ <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="address-full"
                        placeholder='Nhập địa chỉ đầy đủ'
                        value={address.full}
                        onChange={(e) => onAddressChange('full', e.target.value)}
                        required
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-sm placeholder:text-gray-400 placeholder:opacity-70 ${
                            errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.address && (
                        <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại nhà hàng <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        placeholder='Nhập số điện thoại'
                        value={phone}
                        onChange={(e) => onPhoneChange(e.target.value)}
                        required
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-sm placeholder:text-gray-400 placeholder:opacity-70 ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        Danh mục <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="category"
                        value={categoryId}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        required
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                            errors.categoryId ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {errors.categoryId && (
                        <p className="mt-1 text-sm text-red-500">{errors.categoryId}</p>
                    )}
                </div>

                {showPaymentInfoSection && (
                    <div className="mt-8 border-t border-gray-100 pt-6">
                        <div className="mb-4">
                            <h3 className="text-base font-bold text-gray-900">Thông tin thanh toán (Chuyển khoản)</h3>
                            <p className="text-sm text-gray-500 mt-1">Thông tin này sẽ hiển thị khi khách chọn thanh toán bằng ngân hàng.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên ngân hàng</label>
                                <input
                                    type="text"
                                    value={bankName}
                                    onChange={(e) => onBankNameChange?.(e.target.value)}
                                    placeholder="VD: Vietcombank"
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-sm placeholder:text-gray-400 placeholder:opacity-70 border-gray-300"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số tài khoản</label>
                                <input
                                    type="text"
                                    value={bankAccountNumber}
                                    onChange={(e) => onBankAccountNumberChange?.(e.target.value)}
                                    placeholder="Nhập số tài khoản"
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-sm placeholder:text-gray-400 placeholder:opacity-70 border-gray-300"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên chủ tài khoản</label>
                                <input
                                    type="text"
                                    value={bankAccountName}
                                    onChange={(e) => onBankAccountNameChange?.(e.target.value)}
                                    placeholder="Nhập tên chủ tài khoản"
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-sm placeholder:text-gray-400 placeholder:opacity-70 border-gray-300"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mã QR chuyển khoản</label>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setSelectedQrFile(file);
                                        setUploadQrError(null);
                                    }}
                                    className="w-full sm:flex-1 block text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                                />
                                <button
                                    type="button"
                                    disabled={!selectedQrFile || uploadingQr}
                                    onClick={handleUploadQr}
                                    className="px-4 py-2 rounded-md font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                                >
                                    {uploadingQr ? 'Đang tải...' : 'Tải QR lên'}
                                </button>
                            </div>

                            {uploadQrError && <p className="mt-2 text-sm text-red-600">{uploadQrError}</p>}

                            {qrImageUrl && (
                                <div className="mt-3">
                                    <img
                                        src={qrImageUrl}
                                        alt="QR thanh toán"
                                        className="w-48 h-48 object-contain rounded-lg border border-gray-100"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}

export default RestaurantForm;