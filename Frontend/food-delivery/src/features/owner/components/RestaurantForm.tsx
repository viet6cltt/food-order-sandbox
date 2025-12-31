import React from 'react';

interface RestaurantFormProps {
    className?: string;
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
    openingTime: string;
    closingTime: string;
    onNameChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onAddressChange: (field: 'full' | 'street' | 'ward' | 'district' | 'city', value: string) => void;
    onPhoneChange: (value: string) => void;
    onOpeningTimeChange: (value: string) => void;
    onClosingTimeChange: (value: string) => void;
    errors?: {
        name?: string;
        description?: string;
        address?: string;
        phone?: string;
        openingTime?: string;
        closingTime?: string;
    };
}

const RestaurantForm: React.FC<RestaurantFormProps> = ({ 
    className = '',
    name,
    description,
    address,
    phone,
    openingTime,
    closingTime,
    onNameChange,
    onDescriptionChange,
    onAddressChange,
    onPhoneChange,
    onOpeningTimeChange,
    onClosingTimeChange,
    errors = {}
}) => {
    return (
        <div className={className}>
            <form className="max-w-md mx-auto p-4 border border-gray-300 rounded-lg shadow-sm">
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
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-sm placeholder:text-gray-400 placeholder:opacity-70 ${
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
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-sm placeholder:text-gray-400 placeholder:opacity-70 ${
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
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-sm placeholder:text-gray-400 placeholder:opacity-70 ${
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
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-sm placeholder:text-gray-400 placeholder:opacity-70 ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="opening-time" className="block text-sm font-medium text-gray-700 mb-1">
                            Giờ mở cửa
                        </label>
                        <input
                            type="time"
                            id="opening-time"
                            value={openingTime}
                            onChange={(e) => onOpeningTimeChange(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                errors.openingTime ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.openingTime && (
                            <p className="mt-1 text-sm text-red-500">{errors.openingTime}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="closing-time" className="block text-sm font-medium text-gray-700 mb-1">
                            Giờ đóng cửa
                        </label>
                        <input
                            type="time"
                            id="closing-time"
                            value={closingTime}
                            onChange={(e) => onClosingTimeChange(e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                errors.closingTime ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.closingTime && (
                            <p className="mt-1 text-sm text-red-500">{errors.closingTime}</p>
                        )}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default RestaurantForm;