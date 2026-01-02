import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import RestaurantCardList from './components/RestaurantCardList';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const CategoryRestaurantsScreen: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="mt-8 text-left px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Quay lại trang chủ</span>
        </button>
        <h2 className="text-2xl font-bold mb-4">Nhà hàng theo danh mục</h2>
        <RestaurantCardList categoryId={categoryId} />
      </div>
    </AppLayout>
  );
};

export default CategoryRestaurantsScreen;

