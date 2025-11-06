import React, { useEffect, useMemo, useState } from 'react'
import FoodBanner from '../../../assets/picture/Foodbanner_1.png'
import FoodBanner2 from '../../../assets/picture/Foodbanner_2.png'
import RestaurantCard, { type Restaurant } from './RestaurantCard'


{/** Mock Data Configuration, delete this when call API */}
const TOTAL_MOCK = 20 // total mock restaurants
const COLUMNS = 4
const INITIAL_ROWS = 4 // initial 4 rows => 16 items

function generateMockRestaurants(count = TOTAL_MOCK): Restaurant[] {
    const banners = [FoodBanner, FoodBanner2]
    return Array.from({ length: count }).map((_, i) => ({
        id: i + 1,
        bannerUrl: banners[i % banners.length],
        name: `Restaurant ${i + 1}`,
        address: `Some address ${i + 1}`,
        rating: Math.round((3 + Math.random() * 2) * 10) / 10,
    }))
}

export default function RestaurantCardList() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([])
    const [loading, setLoading] = useState(true)
    const [rows, setRows] = useState(INITIAL_ROWS)

    // simulated fetch
    useEffect(() => {
        setLoading(true)
        const t = setTimeout(() => {
            setRestaurants(generateMockRestaurants(TOTAL_MOCK))
            setLoading(false)
        }, 300)
        return () => clearTimeout(t)
    }, [])

    const visibleCount = useMemo(() => Math.max(0, Math.min(restaurants.length, rows * COLUMNS)), [rows, restaurants])

    function handleSeeMore() {
        // load 4 more rows
        setRows((r) => r + 4)
    }

    function handleShowLess() {
        setRows(INITIAL_ROWS)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (loading) return <div className="py-8">Loading restaurants...</div>

    return (
        <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {restaurants.slice(0, visibleCount).map((r) => (
                    <RestaurantCard key={r.id} restaurant={r} />
                ))}
            </div>

            <div className="mt-6 flex justify-center">
                {visibleCount < restaurants.length ? (
                    <button
                        onClick={handleSeeMore}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        See more
                    </button>
                ) : (
                    <button
                        onClick={handleShowLess}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Show less
                    </button>
                )}
            </div>
        </section>
    )
}