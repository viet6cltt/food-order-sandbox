import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import ReportList from '../components/report-handling/ReportList';
import ActionPanel from '../components/report-handling/ActionPanel';
import { FlagIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { getAllReports, resolveReport, ReportTargetType } from '../adminReportApi'; 
import { type Report } from '../../../types/report';
import { toast } from 'react-toastify';

// Tab ở FE dùng chữ thường để URL đẹp, nhưng API cần chữ HOA
type ReportTab = 'review' | 'restaurant';

const AdminReportHandlingScreen: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [activeTab, setActiveTab] = useState<ReportTab>('review');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchReports = useCallback(async () => {
        setIsLoading(true);
        setSelectedId(null); 
        try {
            // Chuyển đổi tab 'review' -> 'REVIEW' để khớp với Backend Enum
            const targetType = activeTab === 'review' ? ReportTargetType.REVIEW : ReportTargetType.RESTAURANT;
            
            const data = await getAllReports({ 
                targetType, 
                status: 'PENDING' 
            });
            
            setReports(data.items || []);
        } catch (error) {
            toast.error("Lỗi lấy danh sách báo cáo");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    // Tìm report đang được chọn để truyền dữ liệu chi tiết vào ActionPanel
    const selectedReport = reports.find(r => r._id === selectedId) || null;

    const handleAction = async (id: string, status: 'RESOLVED' | 'REJECTED', adminNote?: string, action?: any) => {
        try {
            await resolveReport(id, { 
                status, 
                adminNote: adminNote || '', 
                resolvedAction: action || 'NONE' 
            });
            
            // UI Update: Xóa bản ghi đã xử lý khỏi danh sách
            setReports(prev => prev.filter(r => r._id !== id));
            setSelectedId(null);
            toast.success(`Đã xử lý báo cáo thành công.`);
        } catch (error) {
            toast.error('Thao tác xử lý thất bại.');
        }
    };

    return (
        <AdminLayout className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg mr-3 shadow-sm">
                        <FlagIcon className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý Báo cáo vi phạm</h1>
                        <p className="text-gray-500 text-sm">Xem và xử lý các khiếu nại về nội dung trên hệ thống.</p>
                    </div>
                </div>
                <button 
                    onClick={fetchReports}
                    disabled={isLoading}
                    className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all disabled:opacity-50"
                    title="Làm mới danh sách"
                >
                    <ArrowPathIcon className={`w-5 h-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Tabs - Sử dụng kiểu dáng của Tailwind UI */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {(['review', 'restaurant'] as ReportTab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`
                                py-4 px-2 border-b-2 font-bold text-sm transition-all
                                ${activeTab === tab 
                                    ? 'border-red-600 text-red-600' 
                                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-300'}
                            `}
                        >
                            {tab === 'review' ? 'Báo cáo Đánh giá' : 'Báo cáo Nhà hàng'}
                        </button>
                    ))}
                </nav>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-red-600 border-t-transparent mb-4"></div>
                    <p className="text-gray-500 font-medium">Đang tải dữ liệu...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Danh sách bên trái */}
                    <div className="lg:col-span-1 space-y-4">
                        <ReportList
                            reports={reports}
                            selectedId={selectedId}
                            onSelect={(r) => setSelectedId(r._id)}
                        />
                        {reports.length === 0 && (
                            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                                <FlagIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-400 font-medium">Tuyệt vời! Không có báo cáo nào.</p>
                            </div>
                        )}
                    </div>

                    {/* Bảng điều khiển xử lý bên phải */}
                    <div className="lg:col-span-2">
                        {selectedReport ? (
                            <ActionPanel
                                report={selectedReport}
                                onResolve={(id, note, action) => handleAction(id, 'RESOLVED', note, action)}
                                onDismiss={(id) => handleAction(id, 'REJECTED')}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                                <div>
                                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ArrowPathIcon className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800">Chọn một báo cáo</h3>
                                    <p className="text-gray-500 max-w-xs mx-auto">Vui lòng chọn một báo cáo từ danh sách bên trái để xem nội dung chi tiết và xử lý.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminReportHandlingScreen;