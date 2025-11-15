import React, { useEffect, useState } from 'react'
import RestaurantCard, { type Restaurant } from './RestaurantCard'
import { getRestaurants } from '../api'

const COLUMNS = 4
const INITIAL_ROWS = 4
const PAGE_SIZE = COLUMNS * INITIAL_ROWS

const RestaurantCardList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)

    async function fetchPage(p: number) {
      try {
        const { items, meta } = await getRestaurants(p, PAGE_SIZE)
        if (!mounted) return
        setTotal(meta?.total ?? null)
        if (p === 1) {
          setRestaurants(items)
        } else {
          // append next page
          setRestaurants(prev => [...prev, ...items])
        }
      } catch (err: any) {
        if (!mounted) return
        setError(err?.message ?? 'Failed to load restaurants')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchPage(page)
    return () => {
      mounted = false
    }
  }, [page])

  function handleSeeMore() {
    // nếu đã biết tổng và đủ thì không request thêm
    if (total !== null && restaurants.length >= total) return
    setPage(p => p + 1)
  }

  function handleShowLess() {
    // quay về trang 1 (giữ pageSize ban đầu)
    setPage(1)
    // khi page change effect sẽ fetch page 1 và replace restaurants
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

      <div className="mt-6 flex items-center justify-center space-x-4">
        {loading && restaurants.length > 0 && <div className="text-sm text-gray-500">Loading...</div>}

        {!loading && total !== null && restaurants.length < total && (
          <button
            onClick={handleSeeMore}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            See more
          </button>
        )}

        {!loading && total !== null && restaurants.length >= (total ?? 0) && total > PAGE_SIZE && (
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