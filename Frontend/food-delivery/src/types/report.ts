// types/report.ts

export type ReportStatus = 'PENDING' | 'RESOLVED' | 'REJECTED';
export type TargetType = 'REVIEW' | 'RESTAURANT' | 'USER';
export type ResolutionAction = 'NONE' | 'HIDE_REVIEW' | 'BLOCK_USER' | 'BLOCK_RESTAURANT' | 'REJECT_REPORT';

export interface UserBasicInfo {
    _id: string;
    username: string;
    firstname?: string;
    lastname?: string;
    avatarUrl?: string;
}

// Nội dung Review bị báo cáo (Sau khi populate)
export interface ReportedReview {
    _id: string;
    comment: string;
    rating: number;
    userId?: UserBasicInfo | string;
}

// Thông tin Nhà hàng bị báo cáo (Sau khi populate)
export interface ReportedRestaurant {
    _id: string;
    name: string;
    address: string;
    logo?: string;
}

export interface Report {
    _id: string;
    
    // targetId có thể là ID (string) hoặc đã được Populate thành Object tùy theo targetType
    targetId: ReportedReview | ReportedRestaurant | string;
    targetType: TargetType;

    reportedBy: UserBasicInfo; // Luôn được populate username ở Repo
    
    reason: string;
    description: string | null;
    
    status: ReportStatus;
    adminNote: string | null;
    resolvedAction: ResolutionAction;
    
    resolvedBy?: UserBasicInfo | string | null;
    resolvedAt?: string | null;
    
    createdAt: string;
    updatedAt: string;
}