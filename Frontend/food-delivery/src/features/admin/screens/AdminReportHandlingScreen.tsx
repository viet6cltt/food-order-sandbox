import React, { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout'; // Layout chuẩn
import ReportList, { type Report } from '../components/report-handling/ReportList';
import ActionPanel from '../components/report-handling/ActionPanel';
import { FlagIcon } from '@heroicons/react/24/outline';

// Mock Data
const MOCK_REPORTS: Report[] = [
    {
        id: 'RP001',
        reporter: 'Nguyễn Văn A',
        target: 'Quán Cơm Tấm Sài Gòn',
        reason: 'Vệ sinh an toàn thực phẩm',
        status: 'pending',
        date: '29/12/2025',
        details: 'Tôi thấy trong cơm có dị vật lạ giống như tóc. Đề nghị quán kiểm tra lại quy trình đóng gói.'
    },
    {
        id: 'RP002',
        reporter: 'Trần Thị B',
        target: 'Shipper Hùng',
        reason: 'Thái độ phục vụ',
        status: 'pending',
        date: '28/12/2025',
        details: 'Shipper ném đồ ăn trước cửa và không gọi điện báo trước, thái độ rất cộc lốc khi tôi nhắn tin hỏi.'
    },
    {
        id: 'RP003',
        reporter: 'Lê Văn C',
        target: 'Trà Sữa DingTea',
        reason: 'Sai món',
        status: 'resolved',
        date: '27/12/2025',
        details: 'Tôi đặt 50% đường nhưng quán giao 100% đường, quá ngọt không uống được.'
    },
];

const AdminReportHandlingScreen: React.FC = () => {
    const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Lấy report đang chọn
    const selectedReport = reports.find(r => r.id === selectedId) || null;

    // Xử lý: Giải quyết
    const handleResolve = (id: string, reply: string) => {
        if (window.confirm('Xác nhận đã giải quyết khiếu nại này?')) {
            setReports(prev => prev.map(r =>
                r.id === id ? { ...r, status: 'resolved' } : r
            ));
            alert(`Đã gửi phản hồi: "${reply}"`);
        }
    };

    // Xử lý: Hủy bỏ
    const handleDismiss = (id: string) => {
        if (window.confirm('Bạn có chắc muốn hủy bỏ báo cáo này?')) {
            setReports(prev => prev.map(r =>
                r.id === id ? { ...r, status: 'dismissed' } : r
            ));
        }
    };

    return (
        <AdminLayout className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center">
                <div className="p-2 bg-red-100 rounded-lg mr-3">
                    <FlagIcon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Xử lý Khiếu nại</h1>
                    <p className="text-gray-500 text-sm">Tiếp nhận và xử lý báo cáo từ người dùng.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cột trái: Danh sách (1 phần) */}
                <div className="lg:col-span-1">
                    <ReportList
                        reports={reports}
                        selectedId={selectedId}
                        onSelect={(r) => setSelectedId(r.id)}
                    />
                </div>

                {/* Cột phải: Action Panel (2 phần) */}
                <div className="lg:col-span-2">
                    <ActionPanel
                        report={selectedReport}
                        onResolve={handleResolve}
                        onDismiss={handleDismiss}
                    />
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminReportHandlingScreen;

