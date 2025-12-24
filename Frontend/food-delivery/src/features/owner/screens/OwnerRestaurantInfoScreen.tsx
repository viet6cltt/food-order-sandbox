import React from 'react';
import ShippingFeeForm from '../components/ShippingFeeForm';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import OwnerLayout from '../../../layouts/OwnerLayout';

const OwnerRestaurantInfoScreen: React.FC = () => {
    return (
        <OwnerLayout>
            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="max-w-2xl mx-auto">

                    {/* Header của trang */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex p-3 bg-white rounded-full shadow-sm mb-4">
                            <Cog6ToothIcon className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Thiết lập Nhà hàng</h1>
                        <p className="text-gray-500 mt-1">Quản lý phí vận chuyển và thông tin hoạt động.</p>
                    </div>

                    {/* Nội dung chính: Form Phí Ship */}
                    <ShippingFeeForm />

                </div>
            </div>
        </OwnerLayout>
    );
};

export default OwnerRestaurantInfoScreen;