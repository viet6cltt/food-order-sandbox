import React, { useEffect, useState } from 'react';
import { getCategories } from '../api';
import { type Category } from '../../../types/category';
import { useNavigate } from 'react-router-dom';
const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategories() {
      try {
        // Hàm này giờ đây chỉ trả về những cái isActive: true
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Lỗi khi tải danh mục:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const handleCategoryClick = (id: string) => {
    navigate(`/restaurants?category=${id}`);
  };

  if (loading) return <CategorySkeleton />;
  if (categories.length === 0) return null;

  return (
    <div className="py-6">
      {/* Grid 4 cột trên desktop, 2 cột trên mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div 
            key={cat._id} 
            onClick={() => handleCategoryClick(cat._id)}
            className="group cursor-pointer flex flex-col items-start"
          >
            {/* Khung ảnh tỷ lệ 16:9 giống ảnh mẫu */}
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-md">
              <img
                src={cat.imageUrl || 'https://picsum.photos/300/169'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            {/* Tên danh mục in đậm phía dưới */}
            <h3 className="mt-3 text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">
              {cat.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

const CategorySkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 py-6">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="animate-pulse">
        <div className="w-full aspect-[16/9] bg-gray-200 rounded-2xl mb-3"></div>
        <div className="h-5 bg-gray-200 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

export default CategoryList;