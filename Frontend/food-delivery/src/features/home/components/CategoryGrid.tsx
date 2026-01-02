import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, type NormalizedCategory } from '../api';

const CategoryGrid: React.FC = () => {
  const [categories, setCategories] = useState<NormalizedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const data = await getCategories(1, 100);
        setCategories(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Không thể tải danh sách danh mục');
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={`skeleton-${i}`} className="bg-white rounded-lg shadow-sm animate-pulse h-32" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Không có danh mục nào
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 text-center group"
        >
          <div className="w-16 h-16 mx-auto mb-3 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
            <span className="text-2xl font-bold text-emerald-600">
              {category.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-gray-800 truncate w-full">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {category.description}
            </p>
          )}
        </button>
      ))}
    </div>
  );
};

export default CategoryGrid;

