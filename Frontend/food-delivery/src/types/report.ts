// types/report.ts
export interface Report {
    _id: string; // MongoDB dùng _id
    reviewId: {
        _id: string;
        content: string; // Nội dung review bị báo cáo
    } | string;
    reportedBy: {
        _id: string;
        username: string; // Tên người báo cáo sau khi populate
        firstname?: string;
        lastname?: string;
    };
    reason: string;
    adminNote: string | null;
    status: 'PENDING' | 'RESOLVED' | 'REJECTED';
    createdAt: string;
}