import React from 'react'
import { StarIcon } from '@heroicons/react/24/solid'

export type Restaurant = {
    id: number
    bannerUrl: string
    name: string
    address: string
    rating: number
}

const RestaurantCard: React.FC<{ restaurant: Restaurant; className?: string }> = ({ restaurant, className = '' }) => {
    return (
        <article className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
            <img
                src={restaurant.bannerUrl}
                alt={restaurant.name}
                className="w-full h-40 object-cover"
                loading="lazy"
            />

            <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-800 truncate">{restaurant.name}</h3>
                <p className="text-xs text-gray-500 mt-1 truncate">{restaurant.address}</p>

                <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <StarIcon className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm text-gray-700">{restaurant.rating.toFixed(1)}</span>
                    </div>

                    <a href={`/restaurant/${restaurant.id}`} className="text-sm text-indigo-600 hover:underline">
                        View
                    </a>
                </div>
            </div>
        </article>
    )
}

export default RestaurantCard