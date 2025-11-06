import React from 'react'

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
                        <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.462a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.388 2.463c-.784.57-1.838-.197-1.539-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.607 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69L9.05 2.927z" />
                        </svg>
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