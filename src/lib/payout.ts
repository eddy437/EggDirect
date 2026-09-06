// Payout Provider Abstraction
export interface PayoutProvider {
  initiatePayout(supplierId: string, amount: number, bankAccount: string): Promise<PayoutResponse>;
  verifyPayout(payoutId: string): Promise<PayoutStatus>;
  getBankDetails(supplierId: string): Promise<BankDetails | null>;
}

export interface PayoutResponse {
  payoutId: string;
  status: PayoutStatus;
  error?: string;
}

export interface BankDetails {
  accountNumber: string;
  accountHolder: string;
  bankName: string;
}

export type PayoutStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

// Mock Payout Provider (for development)
export class MockPayoutProvider implements PayoutProvider {
  async initiatePayout(
    supplierId: string,
    amount: number,
    bankAccount: string
  ): Promise<PayoutResponse> {
    console.log(
      `Mock: Initiating payout for supplier ${supplierId}: ${amount} to ${bankAccount}`
    );
    return {
      payoutId: `PAYOUT-${Date.now()}`,
      status: 'PROCESSING',
    };
  }

  async verifyPayout(payoutId: string): Promise<PayoutStatus> {
    console.log(`Mock: Verifying payout ${payoutId}`);
    return 'COMPLETED';
  }

  async getBankDetails(supplierId: string): Promise<BankDetails | null> {
    console.log(`Mock: Getting bank details for supplier ${supplierId}`);
    return null;
  }
}

let payoutProvider: PayoutProvider | null = null;

export function getPayoutProvider(): PayoutProvider {
  if (!payoutProvider) {
    const provider = process.env.PAYOUT_PROVIDER || 'mock';
    if (provider === 'mock') {
      payoutProvider = new MockPayoutProvider();
    } else {
      payoutProvider = new MockPayoutProvider();
    }
  }
  return payoutProvider;
}
