import React from 'react';
import { useSearchParams } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import HeroSlider from './components/HeroSlider';
import RestaurantCardList from './components/RestaurantCardList';
import RecommendList from './components/RecommendList';

const HomeScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchKeyword = searchParams.get('search') || undefined;

  return (
    <AppLayout>
        <HeroSlider />
        <div className="mt-8 text-left px-4 sm:px-6 lg:px-8">
            {!searchKeyword && (
              <>
                <h2 className="text-2xl font-bold">Recommended Restaurants</h2>
                <RecommendList />
              </>
            )}
            <h2 className='text-2xl font-bold'>
              {searchKeyword ? `Kết quả tìm kiếm: "${searchKeyword}"` : 'Restaurants'}
            </h2>
            <RestaurantCardList searchKeyword={searchKeyword} />
        </div>
    </AppLayout>
  );
};

export default HomeScreen;