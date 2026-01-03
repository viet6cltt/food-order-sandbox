import apiClient from '../../services/apiClient';

export interface CreateReportPayload {
  targetType: 'REVIEW' | 'RESTAURANT' | 'USER';
  reason: string;
  description?: string;
}

/**
 * Báo cáo một đánh giá (Review)
 */
export async function reportReview(reviewId: string, payload: Omit<CreateReportPayload, 'targetType'>): Promise<void> {
  const res = await apiClient.post(`/reviews/${reviewId}/report`, {
    ...payload,
    targetType: 'REVIEW'
  });
  return res.data;
}

/**
 * Báo cáo một nhà hàng (Restaurant)
 */
export async function reportRestaurant(restaurantId: string, payload: Omit<CreateReportPayload, 'targetType'>): Promise<void> {
  const res = await apiClient.post(`/restaurants/${restaurantId}/report`, {
    ...payload,
    targetType: 'RESTAURANT'
  });
  return res.data;
}