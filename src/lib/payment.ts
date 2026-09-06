// Payment Provider Abstraction
export interface PaymentProvider {
  createPayment(orderId: string, amount: number, currency: string): Promise<PaymentResponse>;
  verifyPayment(transactionId: string): Promise<PaymentStatus>;
  refundPayment(transactionId: string, amount: number): Promise<RefundResponse>;
}

export interface PaymentResponse {
  transactionId: string;
  status: PaymentStatus;
  redirectUrl?: string;
  error?: string;
}

export interface RefundResponse {
  success: boolean;
  transactionId: string;
  refundId?: string;
  error?: string;
}

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

// Mock Payment Provider (for development)
export class MockPaymentProvider implements PaymentProvider {
  async createPayment(orderId: string, amount: number, currency: string): Promise<PaymentResponse> {
    console.log(`Mock: Creating payment for order ${orderId}: ${amount} ${currency}`);
    // Simulate a successful payment
    return {
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'COMPLETED',
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentStatus> {
    console.log(`Mock: Verifying payment ${transactionId}`);
    return 'COMPLETED';
  }

  async refundPayment(transactionId: string, amount: number): Promise<RefundResponse> {
    console.log(`Mock: Refunding payment ${transactionId} for ${amount}`);
    return {
      success: true,
      transactionId,
      refundId: `REF-${Date.now()}`,
    };
  }
}

let paymentProvider: PaymentProvider | null = null;

export function getPaymentProvider(): PaymentProvider {
  if (!paymentProvider) {
    const provider = process.env.PAYMENT_PROVIDER || 'mock';
    if (provider === 'mock') {
      paymentProvider = new MockPaymentProvider();
    } else {
      paymentProvider = new MockPaymentProvider();
    }
  }
  return paymentProvider;
}
