import React from 'react';
import { useSearchParams } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import RestaurantCardList from './components/RestaurantCardList';
import RecommendList from './components/RecommendList';
import CategoryGrid from './components/CategoryGrid';

const SearchScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchKeyword = searchParams.get('search') || undefined;

  return (
    <AppLayout>
      <div className="mt-8 text-left px-4 sm:px-6 lg:px-8">
        {!searchKeyword && (
          <>
            <h2 className="text-2xl font-bold mb-4">Danh mục món ăn</h2>
            <CategoryGrid />
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Recommended Restaurants</h2>
              <RecommendList />
            </div>
          </>
        )}
        {searchKeyword && (
          <>
            <h2 className='text-2xl font-bold mb-4'>
              Kết quả tìm kiếm: "{searchKeyword}"
            </h2>
            <RestaurantCardList searchKeyword={searchKeyword} />
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default SearchScreen;

