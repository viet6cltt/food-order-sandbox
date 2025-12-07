// src/features/promotion/components/PromotionForm.tsx
import React, { useState } from 'react';
import type { Promotion } from '../../../types/promotion';

interface Props {
    initialData?: Promotion | null;
    onCancel: () => void;
    // Thêm hàm này để gửi dữ liệu về cho cha
    onSave: (data: Promotion) => void;
}

const PromotionForm: React.FC<Props> = ({ initialData, onCancel, onSave }) => {

    // Khởi tạo state
    const [formData, setFormData] = useState<Partial<Promotion>>(initialData || {
        code: '',
        name: '',
        type: 'amount',
        value: 0,
        startDate: '',
        endDate: '',
        isActive: true,
        description: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // Xử lý riêng cho trường 'value' để đảm bảo nó là số
        const finalValue = name === 'value' ? Number(value) : value;
        setFormData({ ...formData, [name]: finalValue });
    };

    // Hàm xử lý khi bấm Lưu
    const handleSubmit = () => {
        // 1. Validate sơ bộ (bắt buộc phải có mã và tên)
        if (!formData.code || !formData.name) {
            alert("Vui lòng nhập Mã khuyến mãi và Tên chương trình!");
            return;
        }

        // 2. Tạo object hoàn chỉnh
        const finalData: Promotion = {
            // Nếu sửa thì giữ ID cũ, nếu mới thì tạo ID ngẫu nhiên bằng thời gian hiện tại
            id: initialData?.id || Date.now().toString(),
            code: formData.code!,
            name: formData.name!,
            type: formData.type as 'percent' | 'amount' || 'amount',
            value: Number(formData.value) || 0,
            startDate: formData.startDate || '',
            endDate: formData.endDate || '',
            isActive: formData.isActive !== undefined ? formData.isActive : true,
            description: formData.description || ''
        };

        // 3. Gửi lên cho cha
        onSave(finalData);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
                {initialData ? 'Chỉnh sửa Khuyến mãi' : 'Tạo Khuyến mãi mới'}
            </h2>

            <form className="space-y-5">
                {/* Các trường nhập liệu giữ nguyên như cũ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mã khuyến mãi</label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            placeholder="VD: SALE50"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-green-500 focus:border-green-500 uppercase"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tên chương trình</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="VD: Siêu sale giữa tháng"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Loại giảm giá</label>
                        <select
                            name="type"
                            // @ts-ignore
                            value={formData.type}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-green-500 focus:border-green-500 bg-white"
                        >
                            <option value="amount">Số tiền (VNĐ)</option>
                            <option value="percent">Phần trăm (%)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Giá trị giảm</label>
                        <input
                            type="number"
                            name="value"
                            value={formData.value}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-3" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ngày kết thúc</label>
                        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-3" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Mô tả chi tiết</label>
                    <textarea
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-green-500 focus:border-green-500"
                    ></textarea>
                </div>

                <div className="flex justify-end pt-4 border-t space-x-3">
                    <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                        Hủy bỏ
                    </button>
                    {/* Sửa onClick thành handleSubmit */}
                    <button type="button" onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium">
                        {initialData ? 'Cập nhật' : 'Tạo mới'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PromotionForm;