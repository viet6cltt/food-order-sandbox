import React from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import type { Restaurant } from '../../home/components/RestaurantCard'

const RestaurantHeader: React.FC<{ data: Restaurant }> = ({ data }) => {
    return (
        <header className="mb-6 w-2/3 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
                <div className='flex flex-row gap-2'>
                    <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
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
            {data.bannerUrl && (
                <div className="w-full flex-1 min-h-[256px] rounded-lg overflow-hidden mt-auto">
                    <img
                        src={data.bannerUrl}
                        alt={data.name}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
        </header>
    );
}

export default RestaurantHeader;