import { AppError } from '../middleware/errorHandler.js';

export const buildMockPaymentRecord = (payment, expectedAmount) => {
  if (!payment || payment.method !== 'mock') {
    throw new AppError('Complete payment before continuing');
  }
  if (!payment.mockTransactionId?.startsWith('mock_')) {
    throw new AppError('Invalid payment confirmation');
  }
  const amount = Number(payment.amount);
  if (Number.isNaN(amount) || Math.abs(amount - expectedAmount) > 0.01) {
    throw new AppError('Payment amount does not match plan price');
  }

  return {
    method: 'mock',
    mockTransactionId: payment.mockTransactionId,
    amount,
    paidAt: payment.paidAt ? new Date(payment.paidAt) : new Date(),
    cardLast4: payment.cardLast4 || '4242',
  };
};
