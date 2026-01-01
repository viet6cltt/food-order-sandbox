import React, { useState, useEffect } from 'react';
import type { Report } from '../../../../types/report';

interface Props {
    report: Report | null;
    onResolve: (id: string, reply: string) => void;
    onDismiss: (id: string) => void;
}

const ActionPanel: React.FC<Props> = ({ report, onResolve, onDismiss }) => {
    const [replyText, setReplyText] = useState('');

    // Reset text khi chuyển sang report khác
    useEffect(() => {
        setReplyText('');
    }, [report]);

    if (!report) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex items-center justify-center text-gray-400 flex-col">
                <span className="text-4xl mb-4">📝</span>
                <p>Chọn một báo cáo để xem chi tiết và xử lý</p>
            </div>
        );
    }

    const isProcessed = report.status !== 'PENDING';

    const reporterName =
        report.reportedBy?.username ||
        [report.reportedBy?.lastname, report.reportedBy?.firstname].filter(Boolean).join(' ') ||
        'N/A';

    const reviewContent =
        typeof report.reviewId === 'object' && report.reviewId !== null
            ? report.reviewId.content
            : '';

    const date = report.createdAt ? new Date(report.createdAt).toLocaleString('vi-VN') : '';

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">{report.reason}</h2>
                        <p className="text-sm text-gray-500">Mã: #{report._id} • Ngày gửi: {date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                        ${report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                            report.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}
                    `}>
                        {report.status}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Người báo cáo</p>
                        <p className="font-medium text-gray-900">{reporterName}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Đối tượng bị báo cáo</p>
                        <p className="font-medium text-gray-900">Review</p>
                    </div>
                </div>

                <div className="mb-6">
                    <p className="text-sm font-bold text-gray-900 mb-2">Nội dung chi tiết:</p>
                    <div className="p-4 bg-gray-50 rounded-lg text-gray-700 border border-gray-200 text-sm leading-relaxed">
                        {reviewContent || '(Không có nội dung review)'}
                    </div>
                </div>

                {/* Form xử lý */}
                {!isProcessed && (
                    <div className="mt-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Phản hồi tới User / Ghi chú xử lý:</label>
                        <textarea
                            rows={4}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
                            placeholder="Nhập nội dung phản hồi..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                        />
                    </div>
                )}

                {isProcessed && (
                    <div className="p-4 bg-green-50 border border-green-100 rounded-lg text-green-800 text-sm text-center">
                        Báo cáo này đã được xử lý xong. Không thể thao tác thêm.
                    </div>
                )}
            </div>

            {/* Footer Action Buttons */}
            {!isProcessed && (
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
                    <button
                        onClick={() => onDismiss(report._id)}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
                    >
                        Hủy báo cáo
                    </button>
                    <button
                        onClick={() => onResolve(report._id, replyText)}
                        disabled={!replyText.trim()}
                        className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        Xác nhận & Giải quyết
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActionPanel;