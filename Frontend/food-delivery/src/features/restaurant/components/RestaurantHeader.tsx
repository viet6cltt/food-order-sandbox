import React from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import type { Restaurant } from '../../home/components/RestaurantCard'

const RestaurantHeader: React.FC<{ data: Restaurant }> = ({ data }) => {
    return (
        <header className="mb-6">
            {data.bannerUrl && (
                <div className="w-full h-64 mb-4 rounded-lg overflow-hidden">
                    <img
                        src={data.bannerUrl}
                        alt={data.name}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.name}</h1>
                    <div className="flex items-center space-x-2">
                        <StarIcon className="h-5 w-5 text-yellow-400" />
                        <span className="text-lg font-semibold text-gray-700">
                            {data.rating.toFixed(1)}
                        </span>
                        {data.reviewCount !== undefined && (
                            <span className="text-sm text-gray-500">
                                ({data.reviewCount} đánh giá)
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default RestaurantHeader;