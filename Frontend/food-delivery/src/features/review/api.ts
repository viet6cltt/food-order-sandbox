import apiClient from '../../services/apiClient';

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
  images?: string[];
  status: 'PUBLISHED' | 'HIDDEN';
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewPayload {
  orderId: string;
  restaurantId: string;
  rating: number;
  comment?: string;
}

export interface ReviewListResponse {
  items: Review[];
  total: number;
  page?: number;
  limit?: number;
}

/**
 * Create a review for an order
 */
export async function createReview(payload: CreateReviewPayload): Promise<Review> {
  const res = await apiClient.post('/reviews', payload);
  return res.data?.data || res.data;
}

/**
 * Get reviews by restaurant ID
 */
export async function getReviewsByRestaurant(
  restaurantId: string,
  page: number = 1,
  limit: number = 10
): Promise<ReviewListResponse> {
  const res = await apiClient.get(`/restaurants/${restaurantId}/reviews`, {
    params: { page, limit }
  });
  
  const data = res.data?.data || {};
  
  return {
    items: Array.isArray(data.items) ? data.items : [],
    total: data.total || 0,
    page,
    limit,
  };
}

/**
 * Get review detail by ID
 */
export async function getReviewDetail(reviewId: string): Promise<Review> {
  const res = await apiClient.get(`/reviews/${reviewId}`);
  return res.data?.data || res.data;
}

export interface ReportReviewPayload {
  reason: string;
}

/**
 * Report a review
 */
export async function reportReview(reviewId: string, payload: ReportReviewPayload): Promise<void> {
  const res = await apiClient.post(`/reviews/${reviewId}/report`, payload);
  return res.data?.data || res.data;
}

