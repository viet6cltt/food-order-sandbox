import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import ReportList from '../components/report-handling/ReportList';
import ActionPanel from '../components/report-handling/ActionPanel';
import { FlagIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { getReviewReports, handleReviewReport } from '../api'; // Giả định file api của bạn
import { type Report } from '../../../types/report';

const AdminReportHandlingScreen: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Fetch dữ liệu từ API
    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const data = await getReviewReports(); // GET /review-reports
            setReports(data);
        } catch (error) {
            console.error("Lỗi lấy danh sách báo cáo:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const selectedReport = reports.find(r => r._id === selectedId) || null;

    // 2. Xử lý: Giải quyết (RESOLVED)
    const handleResolve = async (id: string, adminNote: string) => {
        try {
            // PATCH /review-reports/:reportId { status: 'RESOLVED', adminNote }
            await handleReviewReport(id, { status: 'RESOLVED', adminNote });
            
            // Cập nhật state tại chỗ để UI mượt mà
            setReports(prev => prev.map(r => 
                r._id === id ? { ...r, status: 'RESOLVED' as const, adminNote } : r
            ));
            alert('Đã xử lý khiếu nại thành công.');
        } catch (error) {
            alert('Không thể cập nhật trạng thái.');
        }
    };

    // 3. Xử lý: Từ chối/Hủy bỏ (REJECTED)
    const handleDismiss = async (id: string) => {
        if (!window.confirm('Bạn có chắc muốn bác bỏ báo cáo này?')) return;
        
        try {
            await handleReviewReport(id, { status: 'REJECTED' });
            setReports(prev => prev.map(r => 
                r._id === id ? { ...r, status: 'REJECTED' as const } : r
            ));
        } catch (error) {
            alert('Thao tác thất bại.');
        }
    };

    return (
        <AdminLayout className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg mr-3">
                        <FlagIcon className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Xử lý Khiếu nại Review</h1>
                        <p className="text-gray-500 text-sm">Quản lý các báo cáo vi phạm nội dung đánh giá.</p>
                    </div>
                </div>
                <button 
                    onClick={fetchReports}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    title="Làm mới"
                >
                    <ArrowPathIcon className={`w-5 h-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <ReportList
                            reports={reports}
                            selectedId={selectedId}
                            onSelect={(r) => setSelectedId(r._id)}
                        />
                    </div>

                    <div className="lg:col-span-2">
                        <ActionPanel
                            report={selectedReport}
                            onResolve={handleResolve}
                            onDismiss={handleDismiss}
                        />
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminReportHandlingScreen;