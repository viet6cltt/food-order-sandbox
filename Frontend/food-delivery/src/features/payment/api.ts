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
  const res = await apiClient.get(`/payments/orders/${orderId}`);
  const raw = res.data?.data?.payment ?? res.data?.payment;

  // Backend currently returns an array for payment-by-order
  const candidate: any = Array.isArray(raw)
    ? (raw.length > 0
        ? raw
            .slice()
            .sort((a, b) => {
              const at = a?.createdAt ? Date.parse(a.createdAt) : 0;
              const bt = b?.createdAt ? Date.parse(b.createdAt) : 0;
              return at - bt;
            })
            .at(-1)
        : null)
    : raw;

  if (!candidate) return null;

  const payment = candidate as Payment & { id?: string };
  payment._id = payment._id || payment.id || '';

  return payment._id ? (payment as Payment) : null;
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

