import React, { useEffect, useState } from 'react'
import RestaurantCard, { type Restaurant } from './RestaurantCard'
import { getRestaurants, getRestaurantsByCategory, searchRestaurants } from '../api'
import useUser from '../../../hooks/useUser'

const COLUMNS = 4
const INITIAL_ROWS = 4
const PAGE_SIZE = COLUMNS * INITIAL_ROWS

interface RestaurantCardListProps {
  searchKeyword?: string;
  categoryId?: string;
}

const RestaurantCardList: React.FC<RestaurantCardListProps> = ({ searchKeyword, categoryId }) => {
  const { user } = useUser(); // Lấy user từ Context
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)

  // 1. Đồng bộ vị trí từ User Profile hoặc Trình duyệt
  useEffect(() => {
    // Ưu tiên lấy tọa độ từ Profile đã có trong Context
    if (user?.address?.geo?.coordinates) {
      const [lng, lat] = user.address.geo.coordinates;
      if (typeof lat === 'number' && typeof lng === 'number') {
        setLocation({ lat, lng });
        return; // Dừng lại nếu đã lấy được từ Profile
      }
    }

    // Fallback: Nếu profile không có địa chỉ, xin quyền trình duyệt
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => console.log('Geolocation error:', err)
      );
    }
  }, [user]); // Chạy lại khi user profile thay đổi (ví dụ khi user vừa cập nhật địa chỉ)

  // 2. Reset Page khi thay đổi bộ lọc
  useEffect(() => {
    setPage(1);
  }, [searchKeyword, categoryId]);

  // 3. Fetch dữ liệu
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    async function fetchData() {
      try {
        let items = [];
        let meta = null;

        // TRƯỜNG HỢP 1: TÌM KIẾM THEO TỪ KHÓA (CÓ KÈM TỌA ĐỘ)
        if (searchKeyword && searchKeyword.trim()) {
          items = await searchRestaurants(searchKeyword, {
            page,
            limit: PAGE_SIZE,
            lat: location?.lat,
            lng: location?.lng,
          });
        } 
        // TRƯỜNG HỢP 2: LỌC THEO CATEGORY (SẮP XẾP THEO RATING TẠI BE)
        else if (categoryId) {
          const res = await getRestaurantsByCategory(categoryId, page, PAGE_SIZE);
          items = res.items;
          meta = res.meta;
        } 
        // TRƯỜNG HỢP 3: LẤY TẤT CẢ (TRANG CHỦ)
        else {
          const res = await getRestaurants(page, PAGE_SIZE);
          items = res.items;
          meta = res.meta;
        }

        if (!mounted) return;
setTotal(meta?.total ?? null);
        
        if (page === 1) {
          setRestaurants(items);
        } else {
          setRestaurants(prev => [...prev, ...items]);
        }
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || 'Không thể tải danh sách nhà hàng');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();
    return () => { mounted = false; };
  }, [page, searchKeyword, categoryId, location]);

  function handleSeeMore() {
    if (searchKeyword || categoryId) {
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

      {categoryId && restaurants.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          Không có nhà hàng nào trong danh mục này
        </div>
      )}

      {searchKeyword && restaurants.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Tìm thấy {restaurants.length} nhà hàng
        </div>
      )}

      <div className="mt-6 flex items-center justify-center space-x-4">
        {loading && restaurants.length > 0 && <div className="text-sm text-gray-500">Loading...</div>}

        {(searchKeyword || categoryId) && !loading && restaurants.length > 0 && restaurants.length >= PAGE_SIZE && (
          <button
            onClick={handleSeeMore}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Xem thêm
          </button>
        )}

        {!searchKeyword && !categoryId && !loading && total !== null && restaurants.length < total && (
          <button
            onClick={handleSeeMore}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            See more
          </button>
        )}

        {!searchKeyword && !categoryId && !loading && total !== null && restaurants.length >= (total ?? 0) && total > PAGE_SIZE && (
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

export default RestaurantCardList;