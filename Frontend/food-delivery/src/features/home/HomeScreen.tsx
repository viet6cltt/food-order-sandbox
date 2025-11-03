import React from 'react';
import AppLayout from '../../layouts/AppLayout';
import HeroSlider from './components/HeroSlider';

const HomeScreen: React.FC = () => {
  return (
    <AppLayout>
        <HeroSlider />
        <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold">Featured Restaurants</h2>
            {/* Add restaurant cards or listings here */}
        </div>
    </AppLayout>
  );
};

export default HomeScreen;