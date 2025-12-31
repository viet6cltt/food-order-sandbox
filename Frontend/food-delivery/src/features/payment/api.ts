import apiClient from '../../services/apiClient';

export type Payment = {
  _id: string;
  orderId: string;
  userId: string;
  restaurantId: string;
  method: 'COD' | 'BANK_TRANSFER';
  amount: number;
  status: 'pending' | 'success' | 'failed';
  transactionId?: string;
  bankInfo?: string;
  transferProofImage?: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreatePaymentPayload = {
  orderId: string;
};

/**
 * Confirm BANK_TRANSFER payment (owner action)
 */
export async function confirmPayment(paymentId: string): Promise<Payment> {
  const res = await apiClient.patch(`/payments/${paymentId}/confirm`);
  const payment = res.data?.data?.payment ?? res.data?.payment;

  if (payment) {
    payment._id = payment._id || payment.id || paymentId;
  }

  return payment as Payment;
}

/**
 * Mark BANK_TRANSFER payment as failed (owner action)
 */
export async function failPayment(paymentId: string): Promise<Payment> {
  const res = await apiClient.patch(`/payments/${paymentId}/fail`);
  const payment = res.data?.data?.payment ?? res.data?.payment;

  if (payment) {
    payment._id = payment._id || payment.id || paymentId;
  }

  return payment as Payment;
}

/**
 * Create payment for BANK_TRANSFER order
 */
export async function createPayment(payload: CreatePaymentPayload): Promise<Payment> {
  const res = await apiClient.post('/payments', payload);
  const payment = res.data?.data?.payment ?? res.data?.payment;
  
  if (payment) {
    payment._id = payment._id || payment.id;
  }
  
  return payment as Payment;
}

/**
 * Get payment by order ID
 */
export async function getPaymentByOrder(orderId: string): Promise<Payment | null> {
  const res = await apiClient.get(`/payments/order/${orderId}`);
  const payment = res.data?.data?.payment ?? res.data?.payment;
  
  if (!payment) {
    return null;
  }
  
  if (payment) {
    payment._id = payment._id || payment.id;
  }
  
  return payment as Payment;
}

/**
 * Get payment by payment ID
 */
export async function getPaymentById(paymentId: string): Promise<Payment> {
  const res = await apiClient.get(`/payments/${paymentId}`);
  const payment = res.data?.data?.payment ?? res.data?.payment;
  
  if (payment) {
    payment._id = payment._id || payment.id || paymentId;
  }
  
  return payment as Payment;
}

/**
 * Get all payments of current user
 */
export async function getMyPayments(): Promise<Payment[]> {
  const res = await apiClient.get('/payments/my');
  const payments = res.data?.data?.payments ?? res.data?.payments ?? [];
  
  return payments.map((payment: any) => ({
    ...payment,
    _id: payment._id || payment.id,
  })) as Payment[];
}

