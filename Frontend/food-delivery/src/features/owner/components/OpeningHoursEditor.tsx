// src/features/owner/components/OpeningHoursEditor.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ClockIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { getMyRestaurant, updateMyRestaurant } from '../api';

const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];

type OpeningHour = { day: number; open: string; close: string; isClosed: boolean };

function buildDefaultSchedule(open = '08:00', close = '22:00'): OpeningHour[] {
    return DAYS.map((_, idx) => ({ day: idx, open, close, isClosed: false }));
}

function normalizeSchedule(input: unknown, fallbackOpen: string, fallbackClose: string): OpeningHour[] {
    if (!Array.isArray(input)) return buildDefaultSchedule(fallbackOpen, fallbackClose);

    const safe: OpeningHour[] = [];
    for (const raw of input) {
        if (!raw || typeof raw !== 'object') continue;
        const r = raw as Partial<OpeningHour>;
        const day = Number(r.day);
        if (!Number.isInteger(day) || day < 0 || day > 6) continue;

        safe.push({
            day,
            open: typeof r.open === 'string' ? r.open : fallbackOpen,
            close: typeof r.close === 'string' ? r.close : fallbackClose,
            isClosed: Boolean(r.isClosed),
        });
    }

    const byDay = new Map<number, OpeningHour>();
    for (const item of safe) byDay.set(item.day, item);

    const schedule = buildDefaultSchedule(fallbackOpen, fallbackClose);
    for (const item of schedule) {
        const override = byDay.get(item.day);
        if (override) {
            item.open = override.open;
            item.close = override.close;
            item.isClosed = override.isClosed;
        }
    }

    return schedule;
}

const OpeningHoursEditor: React.FC = () => {
    const params = useParams();
    const restaurantId = typeof params.restaurantId === 'string' ? params.restaurantId : null;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [openTime, setOpenTime] = useState('08:00');
    const [closeTime, setCloseTime] = useState('22:00');

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                const restaurant = await getMyRestaurant(restaurantId);
                if (!alive) return;

                if (!restaurantId) {
                    toast.error('Thiếu mã nhà hàng');
                    return;
                }

                const fallbackOpen = restaurant?.opening_time || '08:00';
                const fallbackClose = restaurant?.closing_time || '22:00';

                // Prefer legacy top-level fields, fallback to openingHours[0] if present
                const normalized = normalizeSchedule(restaurant?.openingHours, fallbackOpen, fallbackClose);
                const first = normalized?.[0];
                setOpenTime(fallbackOpen || first?.open || '08:00');
                setCloseTime(fallbackClose || first?.close || '22:00');
            } catch (err) {
                console.error(err);
                toast.error('Không tải được giờ hoạt động');
            } finally {
                if (alive) setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [restaurantId]);

    const onSave = async () => {
        try {
            if (!restaurantId) {
                toast.error('Thiếu mã nhà hàng');
                return;
            }
            setSaving(true);

            const opening_time = openTime || '08:00';
            const closing_time = closeTime || '22:00';
            const openingHours = buildDefaultSchedule(opening_time, closing_time);

            await updateMyRestaurant(restaurantId, {
                opening_time,
                closing_time,
                openingHours,
            });

            toast.success('Đã cập nhật giờ hoạt động');
        } catch (err) {
            console.error(err);
            toast.error('Cập nhật giờ hoạt động thất bại');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                    <ClockIcon className="w-6 h-6 text-emerald-600 mr-2" />
                    Giờ Hoạt Động
                </h2>

                <div className="w-full sm:w-auto">
                    <div className="grid grid-cols-2 gap-2">
                        <label className="sr-only" htmlFor="opening-time">
                            Giờ mở cửa
                        </label>
                        <input
                            id="opening-time"
                            type="time"
                            value={openTime}
                            disabled={loading || saving}
                            className="w-full sm:w-36 border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold text-gray-800 focus:ring-emerald-500 focus:border-emerald-500"
                            onChange={(e) => setOpenTime(e.target.value)}
                        />

                        <label className="sr-only" htmlFor="closing-time">
                            Giờ đóng cửa
                        </label>
                        <input
                            id="closing-time"
                            type="time"
                            value={closeTime}
                            disabled={loading || saving}
                            className="w-full sm:w-36 border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold text-gray-800 focus:ring-emerald-500 focus:border-emerald-500"
                            onChange={(e) => setCloseTime(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="mt-4 text-sm text-gray-500">Đang tải...</div>
            ) : null}

            <div className="mt-4 pt-4 border-t">
                <button
                    disabled={loading || saving}
                    onClick={onSave}
                    className="w-full py-2 bg-emerald-50 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition disabled:opacity-60"
                >
                    Cập nhật giờ mở cửa
                </button>
            </div>
        </div>
    );
};

export default OpeningHoursEditor;