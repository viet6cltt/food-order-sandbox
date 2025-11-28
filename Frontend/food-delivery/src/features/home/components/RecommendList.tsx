import React from 'react';
import RestaurantCard, { type Restaurant } from './RestaurantCard';

const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 1,
    name: 'Phở Thìn Lò Đúc',
    address: '13 Lò Đúc, Hà Nội',
    bannerUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
    rating: 4.5
  },
  {
    id: 2,
    name: 'Bánh Mì Dân Tổ',
    address: 'Cao Thắng, Hà Nội',
    bannerUrl: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=800&q=80',
    rating: 4.2
  },
  {
    id: 3,
    name: 'Cơm Tấm Sài Gòn',
    address: 'Quận 1, TP.HCM',
    bannerUrl: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80',
    rating: 4.8
  },
  {
    id: 4,
    name: 'Trà Sữa Phúc Long',
    address: 'Hàng Điếu, Hà Nội',
    bannerUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
    rating: 4.6
  },
];

const RecommendList: React.FC = () => {
  return (
    <div className="w-full py-4">
      <div className="flex overflow-x-auto space-x-4 pb-4 px-1 scrollbar-hide">
        {MOCK_RESTAURANTS.map((res) => (
          <div key={res.id} className="w-64 flex-shrink-0">
            <RestaurantCard restaurant={res} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendList;