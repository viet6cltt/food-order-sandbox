import React from 'react';
import AppLayout from '../../layouts/AppLayout';

const HomeScreen: React.FC = () => {
  return (
    <AppLayout>
        <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome to Food Delivery</h1>
            <p className="mt-4 text-gray-600">This is a placeholder home screen.</p>
        </div>
        <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold">Featured Restaurants</h2>
            {/* Add restaurant cards or listings here */}
        </div>
    </AppLayout>
  );
};

export default HomeScreen;