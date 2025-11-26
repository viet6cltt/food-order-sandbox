import React from 'react'
import { MapPinIcon, PhoneIcon, ClockIcon } from '@heroicons/react/24/outline'
import type { Restaurant } from '../../home/components/RestaurantCard'

function renderAddress(a: string | Restaurant['address'] | undefined) {
    if (!a) return 'Chưa cập nhật địa chỉ'
    if (typeof a === 'string') return a
    if (a.full) return a.full
    const parts: string[] = []
    if (a.street) parts.push(a.street)
    if (a.ward) parts.push(a.ward)
    if (a.district) parts.push(a.district)
    if (a.city) parts.push(a.city)
    return parts.length > 0 ? parts.join(', ') : 'Chưa cập nhật địa chỉ'
}

const RestaurantInfo: React.FC<{ data: Restaurant }> = ({ data }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 w-full">
            {data.description && (
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Mô tả</h2>
                    <p className="text-gray-700 leading-relaxed">{data.description}</p>
                </div>
            )}

            <div className="space-y-4">
                <div className="flex items-start space-x-3">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Địa chỉ</h3>
                        <p className="text-gray-900">{renderAddress(data.address)}</p>
                    </div>
                </div>

                {data.phone && (
                    <div className="flex items-start space-x-3">
                        <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Số điện thoại</h3>
                            <p className="text-gray-900">{data.phone}</p>
                        </div>
                    </div>
                )}

                {(data.opening_time || data.closing_time) && (
                    <div className="flex items-start space-x-3">
                        <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Giờ mở cửa</h3>
                            <p className="text-gray-900">
                                {data.opening_time || '--'} - {data.closing_time || '--'}
                            </p>
                        </div>
                    </div>
                )}

                {data.estimatedDeliveryTime && (
                    <div className="flex items-start space-x-3">
                        <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Thời gian giao hàng ước tính</h3>
                            <p className="text-gray-900">{data.estimatedDeliveryTime} phút</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RestaurantInfo;

