// src/features/food/components/FoodForm.tsx
import React, { useEffect, useState } from 'react';
import ImageUploader from './ImageUploader';
import { toast } from 'react-toastify';
import { getCategories, getMyRestaurant, type NormalizedCategory } from '../../owner/api';
import { createMenuItem } from '../../owner/menuItemApi.ts';
import { useNavigate } from 'react-router-dom';

const FoodForm: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [categories, setCategories] = useState<NormalizedCategory[]>([]);
    const [categoryId, setCategoryId] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const run = async () => {
            try {
                const cats = await getCategories(1, 100);
                setCategories(cats);
                if (!categoryId && cats.length > 0) {
                    setCategoryId(cats[0].id);
                }
            } catch {
                // keep empty
            }
        };
        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryId) {
            toast.error('Vui lòng chọn danh mục');
            return;
        }

        try {
            setSubmitting(true);
            const restaurant = await getMyRestaurant();
            const restaurantId = restaurant?._id || restaurant?.id;
            if (!restaurantId) {
                toast.error('Không tìm thấy nhà hàng của bạn');
                return;
            }

            await createMenuItem(
                restaurantId,
                {
                    categoryId,
                    name,
                    price: Number(price),
                    description: description || undefined,
                    isAvailable: true,
                },
                image
            );

            toast.success(`Đã tạo món: ${name}`);
            navigate('/owner/menu-list');
            setName('');
            setPrice('');
            setDescription('');
            setImage(null);
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                (err as Error).message ||
                'Tạo món ăn thất bại';
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Thông tin món ăn</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tên món */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tên món ăn</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-green-500 focus:border-green-500"
                        placeholder="Ví dụ: Phở Bò Đặc Biệt"
                        required
                    />
                </div>

                {/* Giá & Danh mục */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Giá bán (VNĐ)</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-green-500 focus:border-green-500"
                            placeholder="0"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Danh mục</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-green-500 focus:border-green-500 bg-white"
                        >
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Mô tả */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mô tả ngắn</label>
                    <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-green-500 focus:border-green-500"
                        placeholder="Mô tả thành phần, hương vị..."
                    />
                </div>

                {/* Upload 1 Ảnh */}
                <ImageUploader onImageChange={(file: File | null) => setImage(file)} />

                {/* Nút Submit */}
                <div className="flex justify-end pt-4 border-t mt-4">
                    <button type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3">
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                        {submitting ? 'Đang lưu...' : 'Lưu Món Ăn'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FoodForm;