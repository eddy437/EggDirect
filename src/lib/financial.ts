import Decimal from 'decimal.js';

const COMMISSION_RATE = new Decimal(process.env.DEFAULT_COMMISSION_RATE || '0.10');
const PLATFORM_COMMISSION_RATE = new Decimal(process.env.PLATFORM_COMMISSION_RATE || '0.05');

export interface CommissionCalculation {
  orderTotal: Decimal;
  supplierEarnings: Decimal;
  platformCommission: Decimal;
  commissionRate: Decimal;
}

export function calculateCommission(
  orderTotal: number | Decimal,
  commissionRate?: Decimal
): CommissionCalculation {
  const total = new Decimal(orderTotal);
  const rate = commissionRate || COMMISSION_RATE;

  const platformCommission = total.times(rate);
  const supplierEarnings = total.minus(platformCommission);

  return {
    orderTotal: total,
    supplierEarnings,
    platformCommission,
    commissionRate: rate,
  };
}

export function calculateTax(
  amount: number | Decimal,
  taxRate: number = 0.17
): Decimal {
  const total = new Decimal(amount);
  return total.times(new Decimal(taxRate));
}

export function calculateShipping(
  weight: number,
  distance: number,
  baseFee: number = 100
): Decimal {
  const perKg = new Decimal('50');
  const perKm = new Decimal('10');
  const weightCost = new Decimal(weight).times(perKg);
  const distanceCost = new Decimal(distance).times(perKm);
  return new Decimal(baseFee).plus(weightCost).plus(distanceCost);
}
