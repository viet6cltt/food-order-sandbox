import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import OwnerLayout from '../../../layouts/OwnerLayout';
import { getMyRestaurant, type Restaurant } from '../api';
import { getMenuItemsByRestaurant } from '../../restaurant/api';
import type { MenuItemDto } from '../../restaurant/components/FoodItem';
import { deleteMenuItem } from '../menuItemApi';

const OwnerMenuListScreen: React.FC = () => {
  const navigate = useNavigate();
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [items, setItems] = useState<MenuItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingIds, setDeletingIds] = useState<Record<string, boolean>>({});

  console.log("OwnerMenuListScreen restaurantId:", restaurantId);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const myRestaurant = await getMyRestaurant(restaurantId);
        setRestaurant(myRestaurant);

        const id = myRestaurant?._id || myRestaurant?.id;
        if (!id) {
          setItems([]);
          return;
        }

        const menuItems = await getMenuItemsByRestaurant(id);
        setItems(menuItems);
      } catch (e: unknown) {
        const msg =
          (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          (e as Error).message ||
          'Không thể tải danh sách món ăn.';
        setError(msg);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleDelete = async (menuItemId: string, menuItemName: string) => {
    const ok = window.confirm(`Xóa món “${menuItemName}”? Hành động này không thể hoàn tác.`);
    if (!ok) return;

    try {
      setDeletingIds((prev) => ({ ...prev, [menuItemId]: true }));
      await deleteMenuItem(menuItemId);
      setItems((prev) => prev.filter((x) => x._id !== menuItemId));
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (e as Error).message ||
        'Xóa món ăn thất bại.';
      window.alert(msg);
    } finally {
      setDeletingIds((prev) => {
        const next = { ...prev };
        delete next[menuItemId];
        return next;
      });
    }
  };

  return (
    <OwnerLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
              <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="text-emerald-600 hover:text-emerald-700 font-medium mb-4 inline-flex items-center"
              >
                  ← Quay lại
              </button>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Danh sách món ăn</h1>
              <p className="text-sm text-gray-500 mt-1">
                {restaurant?.name ? `Nhà hàng: ${restaurant.name}` : 'Quản lý menu của nhà hàng'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/owner/${restaurantId}/add-food`)}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              Thêm món ăn mới
            </button>
          </div>

          {loading ? (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-sm text-gray-500">
              Đang tải...
            </div>
          ) : error ? (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm text-red-600">{error}</p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => navigate(0)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200"
                >
                  Thử lại
                </button>
              </div>
            </div>
          ) : !restaurantId ? (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600">Bạn chưa có nhà hàng để quản lý menu.</p>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600">Chưa có món ăn nào.</p>
              <p className="text-xs text-gray-500 mt-1">Nhấn “Thêm món ăn mới” để tạo món đầu tiên.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <article
                  key={item._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="h-36 bg-gray-100 overflow-hidden flex items-center justify-center">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-xs text-gray-400">No image</div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-sm font-semibold text-gray-900 line-clamp-2">{item.name}</h2>
                      <span
                        className={`shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${
                          item.isAvailable === false
                            ? 'bg-red-50 text-red-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {item.isAvailable === false ? 'Tạm ngưng' : 'Đang bán'}
                      </span>
                    </div>
                    {item.description ? (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">{item.description}</p>
                    ) : null}
                    <div className="mt-3 text-sm font-bold text-gray-900">{formatCurrency(item.price)}</div>

                    <div className="mt-4 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => handleDelete(item._id, item.name)}
                        disabled={Boolean(deletingIds[item._id])}
                        className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {deletingIds[item._id] ? 'Đang xóa...' : 'Xóa'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </OwnerLayout>
  );
};

export default OwnerMenuListScreen;
