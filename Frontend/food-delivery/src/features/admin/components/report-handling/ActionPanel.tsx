import React, { useState, useEffect } from 'react';
import { 
    type Report, 
    type ReportedReview, 
    type ReportedRestaurant 
} from '../../../../types/report'; 
import { StarIcon, MapPinIcon, ChatBubbleLeftRightIcon, UserIcon, FlagIcon } from '@heroicons/react/24/solid';

interface Props {
    report: Report | null;
    onResolve: (id: string, adminNote: string, action: string) => void;
    onDismiss: (id: string) => void;
}

const ActionPanel: React.FC<Props> = ({ report, onResolve, onDismiss }) => {
    const [adminNote, setAdminNote] = useState('');

    useEffect(() => {
        setAdminNote('');
    }, [report]);

    if (!report) {
        return (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 h-[600px] flex items-center justify-center text-gray-400 flex-col">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-300" />
                </div>
                <p className="font-medium">Chọn một báo cáo để xem chi tiết và xử lý</p>
            </div>
        );
    }

    const isPending = report.status === 'PENDING';
    const targetType = report.targetType;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-[600px] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 mb-1">{report.reason}</h2>
                        <p className="text-xs font-mono text-gray-400">ID: {report._id}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider
                        ${report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        report.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}
                    `}>
                        {report.status}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
                {/* Thông tin 2 bên */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-[10px] text-gray-400 uppercase font-black mb-2 flex items-center gap-1">
                            <UserIcon className="w-3 h-3" /> Người báo cáo
                        </p>
                        <p className="font-bold text-gray-900 text-sm">
                            {report.reportedBy?.username || 'N/A'}
                        </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-[10px] text-gray-400 uppercase font-black mb-2 flex items-center gap-1">
                            <FlagIcon className="w-3 h-3" /> Loại đối tượng
                        </p>
                        <p className="font-bold text-emerald-600 text-sm">{targetType}</p>
                    </div>
                </div>

                {/* Nội dung đối tượng bị báo cáo (Dữ liệu đa hình) */}
                <div className="space-y-3">
                    <p className="text-sm font-black text-gray-900">Nội dung bị báo cáo:</p>
                    <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                        {targetType === 'REVIEW' && typeof report.targetId === 'object' ? (
                            // Ép kiểu sang ReportedReview
                            (() => {
                                const review = report.targetId as ReportedReview;
                                return (
                                    <div className="space-y-2">
                                        <div className="flex text-yellow-400 gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                                            ))}
                                        </div>
                                        <p className="text-gray-700 text-sm italic">"{review.comment}"</p>
                                        <p className="text-[10px] text-gray-400">
                                            Tác giả: {typeof review.userId === 'object' ? review.userId.username : 'N/A'}
                                        </p>
                                    </div>
                                );
                            })()
                        ) : targetType === 'RESTAURANT' && typeof report.targetId === 'object' ? (
                            // Ép kiểu sang ReportedRestaurant
                            (() => {
                                const restaurant = report.targetId as ReportedRestaurant;
                                return (
                                    <div className="space-y-1">
                                        <p className="font-bold text-gray-900">{restaurant.name}</p>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <MapPinIcon className="w-3 h-3" /> {restaurant.address}
                                        </p>
                                    </div>
                                );
                            })()
                        ) : (
                            <p className="text-sm text-gray-500 italic">Dữ liệu không khả dụng (Đã bị xóa hoặc chưa được xử lý)</p>
                        )}
                    </div>
                </div>

                {/* Mô tả từ người báo cáo */}
                <div>
                    <p className="text-sm font-black text-gray-900 mb-2">Chi tiết vi phạm từ User:</p>
                    <div className="p-4 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm leading-relaxed shadow-sm">
                        {report.description || 'Không có mô tả chi tiết.'}
                    </div>
                </div>

                {/* Nhập ghi chú xử lý */}
                {isPending && (
                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-900 italic">Ghi chú của Admin:</label>
                        <textarea
                            rows={3}
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition-all"
                            placeholder="Nhập lý do xử lý hoặc bác bỏ..."
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                        />
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-50 bg-white flex justify-end gap-3">
                {isPending ? (
                    <>
                        <button
                            onClick={() => onDismiss(report._id)}
                            className="px-6 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all text-sm"
                        >
                            Bác bỏ báo cáo
                        </button>
                        
                        <button
                            onClick={() => onResolve(
                                report._id, 
                                adminNote, 
                                targetType === 'REVIEW' ? 'HIDE_REVIEW' : 'BLOCK_RESTAURANT'
                            )}
                            disabled={!adminNote.trim()}
                            className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all disabled:opacity-30 shadow-lg shadow-red-100 text-sm"
                        >
                            {targetType === 'REVIEW' ? 'Chấp nhận & Ẩn Review' : 'Chấp nhận & Khóa Quán'}
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-gray-400 italic text-xs">
                            Đã xử lý lúc {new Date(report.updatedAt).toLocaleString('vi-VN')}
                        </span>
                        {report.adminNote && (
                            <span className="text-gray-600 text-sm font-medium">Ghi chú: {report.adminNote}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActionPanel;