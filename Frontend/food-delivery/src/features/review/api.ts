import apiClient from '../../services/apiClient';

// --- Interfaces ---

export interface Review {
  _id: string;
  userId: string | {
    _id: string;
    firstname?: string;
    lastname?: string;
    avatarUrl?: string;
  };
  restaurantId: string;
  orderId: string;
  rating: number;
  comment?: string;
  images?: string[]; // Danh sách URL ảnh từ Server trả về
  status: 'PUBLISHED' | 'HIDDEN';
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewPayload {
  orderId: string;
  restaurantId: string;
  rating: number;
  comment?: string;
  reviewImages?: File[]; // Danh sách file ảnh chọn từ thiết bị
}

export interface ReviewListResponse {
  items: Review[];
  total: number;
  page: number;
  limit: number;
}

export interface ReportReviewPayload {
  reason: string;
}

// --- API Functions ---

/**
 * Lấy danh sách đánh giá theo ID món ăn
 */
export async function getReviewsByMenuItem(
  menuItemId: string,
  page: number = 1,
  limit: number = 10
): Promise<ReviewListResponse> {
  const res = await apiClient.get(`/menu-items/${menuItemId}/reviews`, {
    params: { page, limit }
  });
  
  // Dựa theo cấu trúc response bạn cung cấp: data: { items: [], meta: { total, ... } }
  const data = res.data?.data || {};

  console.log(res);
  
  return {
    items: Array.isArray(data.items) ? data.items : [],
    total: data.meta?.total || 0,
    page: data.meta?.page || page,
    limit: data.meta?.limit || limit,
  };
}

/**
 * Tạo đánh giá mới cho đơn hàng (Hỗ trợ upload nhiều ảnh)
 */
export async function createReview(payload: CreateReviewPayload): Promise<Review> {
  // Vì có chứa File (reviewImages), chúng ta phải dùng FormData
  const formData = new FormData();

  // Append các trường thông tin cơ bản
  formData.append('orderId', payload.orderId);
  formData.append('restaurantId', payload.restaurantId);
  formData.append('rating', payload.rating.toString());
  
  if (payload.comment) {
    formData.append('comment', payload.comment.trim());
  }

  // Append danh sách ảnh với key 'reviewImages' (khớp với yêu cầu Backend)
  if (payload.reviewImages && payload.reviewImages.length > 0) {
    payload.reviewImages.forEach((file) => {
      formData.append('reviewImages', file);
    });
  }

  const res = await apiClient.post('/reviews', formData, {
    headers: {
      // Đảm bảo header là multipart/form-data
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data?.data || res.data;
}

/**
 * Lấy danh sách đánh giá của nhà hàng
 */
export async function getReviewsByRestaurant(
  restaurantId: string,
  page: number = 1,
  limit: number = 10
): Promise<ReviewListResponse> {
  const res = await apiClient.get(`/restaurants/${restaurantId}/reviews`, {
    params: { page, limit }
  });
  
  const data = res.data?.data || res.data || {};
  
  return {
    items: Array.isArray(data.items) ? data.items : [],
    total: data.total || 0,
    page: data.page || page,
    limit: data.limit || limit,
  };
}

/**
 * Lấy chi tiết một đánh giá
 */
export async function getReviewDetail(reviewId: string): Promise<Review> {
  const res = await apiClient.get(`/reviews/${reviewId}`);
  return res.data?.data || res.data;
}

/**
 * Báo cáo vi phạm một đánh giá
 */
export async function reportReview(reviewId: string, payload: ReportReviewPayload): Promise<void> {
  const res = await apiClient.post(`/reviews/${reviewId}/report`, payload);
  return res.data?.data || res.data;
}