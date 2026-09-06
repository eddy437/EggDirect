import { prisma } from '@/lib/prisma';
import { generateOrderNumber } from '@/lib/utils';
import { calculateCommission } from '@/lib/financial';
import Decimal from 'decimal.js';
import type { Order } from '@/types';

export async function createOrder(
  userId: string,
  shopId: string,
  items: Array<{ productId: string; supplierId: string; quantity: number; price: number }>,
  shippingAddress: string,
  subtotal: number,
  shippingCost: number,
  tax: number
): Promise<Order> {
  const orderNumber = generateOrderNumber();
  const total = subtotal + shippingCost + tax;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      buyerId: userId,
      shopId,
      subtotal: new Decimal(subtotal),
      shippingCost: new Decimal(shippingCost),
      tax: new Decimal(tax),
      total: new Decimal(total),
      shippingAddress,
      status: 'PENDING',
      paymentStatus: 'PENDING',
    },
  });

  // Create order items and commission ledgers
  for (const item of items) {
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: item.productId,
        supplierId: item.supplierId,
        quantity: item.quantity,
        price: new Decimal(item.price),
        subtotal: new Decimal(item.price * item.quantity),
      },
    });

    // Create commission ledger
    const commission = calculateCommission(item.price * item.quantity);

    await prisma.commissionLedger.create({
      data: {
        orderId: order.id,
        supplierId: item.supplierId,
        orderTotal: commission.orderTotal,
        supplierEarnings: commission.supplierEarnings,
        platformCommission: commission.platformCommission,
        commissionRate: commission.commissionRate,
      },
    });
  }

  return order as Order;
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const orders = await prisma.order.findMany({
    where: { buyerId: userId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  return orders as Order[];
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  return order as Order | null;
}

export async function updateOrderStatus(
  orderId: string,
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
) {
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
}
