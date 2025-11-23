import React from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { useNavigate } from 'react-router-dom'

export type AddressShape = {
    full?: string
    street?: string
    ward?: string
    district?: string
    city?: string
    geo?: unknown
}

export type Restaurant = {
    id?: number | string
    _id?: string | { $oid?: string } // MongoDB _id field
    bannerUrl?: string
    name: string
    address: string | AddressShape
    rating: number
    description?: string
    phone?: string
    opening_time?: string
    closing_time?: string
    reviewCount?: number
    estimatedDeliveryTime?: number
    // Các field khác từ backend
    isAcceptingOrders?: boolean
    isActive?: boolean
    ownerId?: string
    categoriesId?: string[]
    shippingPolicy?: string
    baseShippingFee?: number
    shippingPerKm?: number
    paymentInfo?: {
        bankName?: string
        bankAccountNumber?: string
        bankAccountName?: string
        qrImageUrl?: string
    }
    createdAt?: string
    updatedAt?: string
}

const RestaurantCard: React.FC<{ restaurant: Restaurant; className?: string }> = ({ restaurant, className = '' }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        const restaurantId = restaurant.id || restaurant._id || (typeof restaurant._id === 'object' ? restaurant._id.$oid : undefined)
        if (restaurantId) {
            navigate(`/restaurant/${restaurantId}`);
        }
    }

    return (
        <button className="hover:shadow-lg transition-shadow rounded-lg" onClick={handleClick}>
            <article className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
                <img
                    src={restaurant.bannerUrl}
                    alt={restaurant.name}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                />

                <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-800 truncate">{restaurant.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 truncate">{renderAddress(restaurant.address)}</p>

                    <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <StarIcon className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm text-gray-700">{restaurant.rating.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            </article>
        </button>
    )
}

export default RestaurantCard

function renderAddress(a: string | AddressShape | undefined) {
    if (!a) return ''
    if (typeof a === 'string') return a
    if (a.full) return a.full
    const parts: string[] = []
    if (a.street) parts.push(a.street)
    if (a.ward) parts.push(a.ward)
    if (a.district) parts.push(a.district)
    if (a.city) parts.push(a.city)
    return parts.join(', ')
}