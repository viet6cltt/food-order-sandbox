import React from 'react';

interface OwnerRegisterFormProps {
    className?: string;
    username: string;
    email: string;
    phone: string;
    onUsernameChange: (value: string) => void;
    onEmailChange: (value: string) => void;
    onPhoneChange: (value: string) => void;
    errors?: {
        username?: string;
        email?: string;
        phone?: string;
    };
}

const OwnerRegisterForm: React.FC<OwnerRegisterFormProps> = ({ 
    className = '',
    username,
    email,
    phone,
    onUsernameChange,
    onEmailChange,
    onPhoneChange,
    errors = {}
}) => {
    return (
        <div className={className}>
            <form className="max-w-md mx-auto p-4 border border-gray-300 rounded-lg shadow-sm">
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                        Tên người dùng <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="username"
                        placeholder='Nhập tên người dùng'
                        value={username}
                        onChange={(e) => onUsernameChange(e.target.value)}
                        required
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-sm placeholder:text-gray-400 placeholder:opacity-70 ${
                            errors.username ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.username && (
                        <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        placeholder='Nhập email'
                        value={email}
                        onChange={(e) => onEmailChange(e.target.value)}
                        required
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-sm placeholder:text-gray-400 placeholder:opacity-70 ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại <span className="text-red-500">*</span>
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
            </form>
        </div>
    )
}

export default OwnerRegisterForm;