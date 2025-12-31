import React from 'react';
import { useSearchParams } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import RestaurantCardList from './components/RestaurantCardList';
import RecommendList from './components/RecommendList';
import CategoryList from './components/CategoryList'; // Component chứa các ô Pasta, Pizza...

const SearchScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  // Lấy cả 2 tham số: từ khóa tìm kiếm HOẶC id danh mục
  const searchKeyword = searchParams.get('search') || undefined;
  const categoryId = searchParams.get('category') || undefined;

  // Header động dựa trên việc người dùng đang làm gì
  const renderHeader = () => {
    if (searchKeyword) return `Kết quả tìm kiếm cho: "${searchKeyword}"`;
    if (categoryId) return `Danh mục món ăn`; // Có thể fetch thêm tên Category để hiện ở đây
    return "Khám phá món ăn";
  };

  return (
    <AppLayout>
      <div className="mt-8 text-left px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* TRƯỜNG HỢP 1: TRANG TRỐNG (Chưa search, chưa chọn category) */}
        {!searchKeyword && !categoryId && (
          <>
            <h2 className="text-2xl font-bold mb-6">Tất cả danh mục</h2>
            <CategoryList />
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Gợi ý dành cho bạn</h2>
              <RecommendList />
            </div>
          </>
        )}

        {/* TRƯỜNG HỢP 2: ĐANG SEARCH HOẶC ĐANG XEM THEO CATEGORY */}
        {(searchKeyword || categoryId) && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className='text-2xl font-bold'>
                {renderHeader()}
              </h2>
              {/* Nút quay lại nhanh */}
              <button 
                onClick={() => window.history.back()}
                className="text-green-600 font-semibold text-sm hover:underline"
              >
                Quay lại
              </button>
            </div>

            {/* RestaurantCardList đã có sẵn logic nhận searchKeyword và categoryId */}
            <RestaurantCardList 
              searchKeyword={searchKeyword} 
              categoryId={categoryId} 
            />
          </>
        )}
      </div>
    </AppLayout>
  );
};


export default SearchScreen;
