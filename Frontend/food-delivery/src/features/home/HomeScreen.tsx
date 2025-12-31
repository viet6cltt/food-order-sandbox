import React from 'react';
import AppLayout from '../../layouts/AppLayout';
import HeroSlider from './components/HeroSlider';
import CategoryGrid from './components/CategoryGrid';
import RecommendList from './components/RecommendList';

const HomeScreen: React.FC = () => {
  return (
    <AppLayout>
        <HeroSlider />
        <div className="mt-12 text-left px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold mb-4">Nhà hàng đề xuất</h2>
              <RecommendList />
            </div>
        <div className="mt-8 text-left px-4 sm:px-6 lg:px-8 mb-12">
            <h2 className="text-2xl font-bold mb-4">Danh mục món ăn</h2>
            <CategoryGrid />
        </div>
    </AppLayout>
  );
};

export default HomeScreen;