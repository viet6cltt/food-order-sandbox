import React, { useEffect, useState } from 'react'
import RestaurantCard, { type Restaurant } from './RestaurantCard'
import { getRestaurants, searchRestaurants } from '../api'
import { getMe } from '../../profile/api'

const COLUMNS = 4
const INITIAL_ROWS = 4
const PAGE_SIZE = COLUMNS * INITIAL_ROWS

interface RestaurantCardListProps {
  searchKeyword?: string;
}

const RestaurantCardList: React.FC<RestaurantCardListProps> = ({ searchKeyword }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Get user location from profile or browser geolocation
  useEffect(() => {
    async function getUserLocation() {
      try {
        const user = await getMe()
        if (user?.address?.geo?.coordinates) {
          const [lng, lat] = user.address.geo.coordinates
          if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
            setLocation({ lat, lng })
            return
          }
        }
      } catch (err) {
        console.log('Could not get user location from profile:', err)
      }

      // Fallback to browser geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
          },
          (err) => {
            console.log('Geolocation error:', err)
          }
        )
      }
    }

    getUserLocation()
  }, [])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)
    if (searchKeyword) {
      setPage(1) // Reset to page 1 when search keyword changes
    }

    async function fetchData() {
      try {
        if (searchKeyword && searchKeyword.trim()) {
          const searchOptions: { page: number; limit: number; lat?: number; lng?: number } = {
            page,
            limit: PAGE_SIZE,
          }
          if (location) {
            searchOptions.lat = location.lat
            searchOptions.lng = location.lng
          }

          const items = await searchRestaurants(searchKeyword, searchOptions)
          if (!mounted) return
          
          if (page === 1) {
            setRestaurants(items)
          } else {
            // Append next page for search results
            setRestaurants(prev => [...prev, ...items])
          }
          setTotal(null)
        } else {
          const { items, meta } = await getRestaurants(page, PAGE_SIZE)
          if (!mounted) return
          setTotal(meta?.total ?? null)
          if (page === 1) {
            setRestaurants(items)
          } else {
            // append next page
            setRestaurants(prev => [...prev, ...items])
          }
        }
      } catch (err: any) {
        if (!mounted) return
        setError(err?.message ?? 'Failed to load restaurants')
        setRestaurants([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchData()
    return () => {
      mounted = false
    }
  }, [page, searchKeyword, location])

  function handleSeeMore() {
    if (searchKeyword) {
      setPage(p => p + 1)
      return
    }
    if (total !== null && restaurants.length >= total) return
    setPage(p => p + 1)
  }

  function handleShowLess() {
    setPage(1)
  }

  return (
    <section>
      {error && (
        <div className="text-red-500 text-sm mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {restaurants.map(r => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}

        {/* loading skeleton placeholders when initial load */}
        {loading && restaurants.length === 0 &&
          Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={`skeleton-${i}`} className="bg-white rounded-lg shadow-sm animate-pulse h-56" />
          ))
        }
      </div>

      {searchKeyword && restaurants.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          Không tìm thấy nhà hàng nào với từ khóa "{searchKeyword}"
        </div>
      )}

      {searchKeyword && restaurants.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Tìm thấy {restaurants.length} nhà hàng
        </div>
      )}

      <div className="mt-6 flex items-center justify-center space-x-4">
        {loading && restaurants.length > 0 && <div className="text-sm text-gray-500">Loading...</div>}

        {searchKeyword && !loading && restaurants.length > 0 && restaurants.length >= PAGE_SIZE && (
          <button
            onClick={handleSeeMore}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Xem thêm
          </button>
        )}

        {!searchKeyword && !loading && total !== null && restaurants.length < total && (
          <button
            onClick={handleSeeMore}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            See more
          </button>
        )}

        {!searchKeyword && !loading && total !== null && restaurants.length >= (total ?? 0) && total > PAGE_SIZE && (
          <button
            onClick={handleShowLess}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Show less
          </button>
        )}
      </div>
    </section>
  )
}

export default RestaurantCardList