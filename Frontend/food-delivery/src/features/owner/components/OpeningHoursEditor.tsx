// src/features/owner/components/OpeningHoursEditor.tsx
import React, { useEffect, useMemo, useState } from 'react';
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
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [schedule, setSchedule] = useState<OpeningHour[]>(buildDefaultSchedule());

    const dayLabelByIndex = useMemo(() => DAYS, []);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                const restaurant = await getMyRestaurant();
                if (!alive) return;

                const fallbackOpen = restaurant?.opening_time || '08:00';
                const fallbackClose = restaurant?.closing_time || '22:00';
                const next = normalizeSchedule(restaurant?.openingHours, fallbackOpen, fallbackClose);
                setSchedule(next);
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
    }, []);

    const updateItem = (day: number, patch: Partial<OpeningHour>) => {
        setSchedule(prev => prev.map(it => (it.day === day ? { ...it, ...patch } : it)));
    };

    const onSave = async () => {
        try {
            setSaving(true);

            // Keep legacy fields in sync (use first non-closed day, else defaults)
            const firstOpenDay = schedule.find(s => !s.isClosed);
            const opening_time = firstOpenDay?.open || '08:00';
            const closing_time = firstOpenDay?.close || '22:00';

            await updateMyRestaurant({
                opening_time,
                closing_time,
                openingHours: schedule,
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
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <ClockIcon className="w-6 h-6 text-emerald-600 mr-2" />
                Giờ Hoạt Động
            </h2>

            <div className="space-y-3">
                {loading ? (
                    <div className="text-sm text-gray-500">Đang tải...</div>
                ) : (
                    schedule.map((item) => (
                    <div key={item.day} className="py-3 border-b border-gray-50 last:border-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <span className="font-medium text-gray-700">{dayLabelByIndex[item.day]}</span>

                            <div className="flex flex-wrap items-center gap-2">
                                <input
                                    type="time"
                                    value={item.open}
                                    disabled={item.isClosed}
                                    className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                                    onChange={(e) => updateItem(item.day, { open: e.target.value })}
                                />
                                <span className="text-gray-400">-</span>
                                <input
                                    type="time"
                                    value={item.close}
                                    disabled={item.isClosed}
                                    className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                                    onChange={(e) => updateItem(item.day, { close: e.target.value })}
                                />
                            </div>

                            <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={item.isClosed}
                                    onChange={(e) => updateItem(item.day, { isClosed: e.target.checked })}
                                    className="rounded text-emerald-600 focus:ring-emerald-500"
                                />
                                <span>Nghỉ</span>
                            </label>
                        </div>
                    </div>
                    ))
                )}
            </div>

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