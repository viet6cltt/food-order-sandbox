import React from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import type { Restaurant } from '../../home/components/RestaurantCard'

function isFalseLike(v: unknown) {
    return v === false || v === 0 || v === '0'
}

function isTrueLike(v: unknown) {
    return v === true || v === 1 || v === '1'
}

const RestaurantHeader: React.FC<{ data: Restaurant }> = ({ data }) => {
    const isBlocked = data.status === 'BLOCKED' || isTrueLike((data as unknown as { isBlock?: unknown }).isBlock);
    const isTemporarilyClosed = !isBlocked && (isFalseLike(data.isActive) || isFalseLike(data.isAcceptingOrders));

    return (
        <header className="mb-0 w-full flex flex-col md:w-2/3 md:mb-6">
            <div className="flex items-start justify-between mb-4">
                <div className='flex flex-row gap-2'>
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
                        {(isBlocked || isTemporarilyClosed) && (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${isBlocked ? 'bg-red-500' : 'bg-gray-500'}`}>
                                {isBlocked ? 'Bị khóa' : 'Tạm đóng cửa'}
                            </span>
                        )}
                    </div>
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
                <div className="w-full min-h-[256px] rounded-lg overflow-hidden">
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