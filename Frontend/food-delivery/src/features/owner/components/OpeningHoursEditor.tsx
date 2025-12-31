// src/features/owner/components/OpeningHoursEditor.tsx
import React, { useState } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];

const OpeningHoursEditor: React.FC = () => {
    // State giả lập giờ mở cửa (mặc định 8h sáng - 10h tối)
    const [schedule, setSchedule] = useState(
        DAYS.map(day => ({ day, open: '08:00', close: '22:00', isClosed: false }))
    );

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <ClockIcon className="w-6 h-6 text-green-600 mr-2" />
                Giờ Hoạt Động
            </h2>

            <div className="space-y-3">
                {schedule.map((item, index) => (
                    <div key={item.day} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <span className="font-medium text-gray-700 w-20">{item.day}</span>

                        <div className="flex items-center space-x-2">
                            <input
                                type="time"
                                value={item.open}
                                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-green-500 focus:border-green-500"
                                onChange={() => { }} // Thêm logic onChange sau
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="time"
                                value={item.close}
                                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-green-500 focus:border-green-500"
                                onChange={() => { }}
                            />
                        </div>

                        <label className="flex items-center space-x-2 text-sm text-gray-500 cursor-pointer">
                            <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                            <span>Nghỉ</span>
                        </label>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t">
                <button className="w-full py-2 bg-green-50 text-green-700 font-semibold rounded-lg hover:bg-green-100 transition">
                    Cập nhật giờ mở cửa
                </button>
            </div>
        </div>
    );
};

export default OpeningHoursEditor;