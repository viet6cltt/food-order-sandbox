import React from 'react';
import { ExclamationTriangleIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export interface Report {
    id: string;
    reporter: string; // Người báo cáo
    target: string;   // Đối tượng bị báo cáo (Shipper/Nhà hàng/Món ăn)
    reason: string;
    status: 'pending' | 'resolved' | 'dismissed';
    date: string;
    details: string;  // Nội dung chi tiết
}

interface Props {
    reports: Report[];
    selectedId: string | null;
    onSelect: (report: Report) => void;
}

const ReportList: React.FC<Props> = ({ reports, selectedId, onSelect }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-gray-800">Danh sách báo cáo ({reports.length})</h3>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-gray-100">
                {reports.map((report) => (
                    <div
                        key={report.id}
                        onClick={() => onSelect(report)}
                        className={`p-4 cursor-pointer hover:bg-green-50 transition-colors
                            ${selectedId === report.id ? 'bg-green-50 border-l-4 border-green-600' : 'border-l-4 border-transparent'}
                        `}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-sm text-gray-900 line-clamp-1">{report.reason}</span>
                            <span className="text-xs text-gray-400 whitespace-nowrap">{report.date}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">Từ: {report.reporter}</p>

                        <div className="flex items-center">
                            {report.status === 'pending' && (
                                <span className="flex items-center text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                                    <ExclamationTriangleIcon className="w-3 h-3 mr-1" /> Chờ xử lý
                                </span>
                            )}
                            {report.status === 'resolved' && (
                                <span className="flex items-center text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                    <CheckCircleIcon className="w-3 h-3 mr-1" /> Đã giải quyết
                                </span>
                            )}
                            {report.status === 'dismissed' && (
                                <span className="flex items-center text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                                    <XCircleIcon className="w-3 h-3 mr-1" /> Đã hủy
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReportList;