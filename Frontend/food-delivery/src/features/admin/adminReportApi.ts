import api from '../../services/apiClient';

/**
 * Định nghĩa các hằng số để dùng chung trong toàn bộ FE, 
 * giúp tránh lỗi typos và lệch Case chữ (hoa/thường)
 */
export const ReportTargetType = {
    REVIEW: "REVIEW",
    RESTAURANT: "RESTAURANT",
    USER: "USER"
} as const;

export const ReportStatus = {
    PENDING: "PENDING",
    RESOLVED: "RESOLVED",
    REJECTED: "REJECTED"
} as const;

/**
 * Lấy danh sách tất cả báo cáo (Dành cho Admin)
 */
export const getAllReports = async (params: { 
  page?: number, 
  limit?: number, 
  // Chỉnh lại type để đồng bộ với hằng số CHỮ HOA
  targetType?: 'review' | 'restaurant' | 'user' | 'REVIEW' | 'RESTAURANT' | 'USER', 
  status?: 'PENDING' | 'RESOLVED' | 'REJECTED' 
} = {}) => {
    // Tự động chuẩn hóa targetType và status sang chữ HOA trước khi gửi lên BE
    const normalizedParams = {
        ...params,
        targetType: params.targetType?.toUpperCase(),
        status: params.status?.toUpperCase() || 'PENDING'
    };

    const response = await api.get('/admin/reports', { params: normalizedParams });
    console.log(response);
    return response.data.data; 
};

/**
 * Lấy chi tiết một báo cáo cụ thể
 */
export const getReportDetail = async (reportId: string) => {
    const response = await api.get(`/admin/reports/${reportId}`);
    return response.data.data;
};

/**
 * Xử lý báo cáo
 */
export const resolveReport = async (
    reportId: string, 
    data: { 
        status: 'RESOLVED' | 'REJECTED', 
        adminNote: string, 
        resolvedAction?: 'NONE' | 'HIDE_REVIEW' | 'BLOCK_RESTAURANT' | 'BLOCK_USER' | 'REJECT_REPORT'
    }
) => {
    // Đảm bảo status gửi lên luôn là chữ HOA
    const payload = {
        ...data,
        status: data.status.toUpperCase(),
        resolvedAction: data.resolvedAction || 'NONE'
    };

    const response = await api.patch(`/admin/reports/${reportId}/handle`, payload);
    return response.data;
};