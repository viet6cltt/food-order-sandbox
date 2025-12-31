import React from 'react';
import AppLayout from '../../layouts/AppLayout';
import HeroSlider from './components/HeroSlider';
import CategoryList from './components/CategoryList';
import RecommendList from './components/RecommendList';

const HomeScreen: React.FC = () => {
  return (
    <AppLayout>
      <HeroSlider />
      
      <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Gợi ý */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Dành riêng cho bạn</h2>
              <p className="text-gray-500 text-sm">Những quán ăn ngon nhất dựa trên sở thích của bạn</p>
            </div>
            <button className="text-green-600 font-bold text-sm hover:underline">Xem tất cả</button>
          </div>
          <RecommendList />
        </section>

        {/* Category Section - Giống Grab nhất */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-extrabold text-gray-900">Khám phá theo danh mục</h2>
          </div>
          <CategoryList />
        </section>
        
      </div>
    </AppLayout>
  );
};

export default HomeScreen;