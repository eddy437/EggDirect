import { NextRequest, NextResponse } from 'next/server';
import { getPaymentProvider } from '@/lib/payment';
import { prisma } from '@/lib/prisma';
import Decimal from 'decimal.js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount, paymentMethod } = body;

    // Validate order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Process payment
    const paymentProvider = getPaymentProvider();
    const paymentResponse = await paymentProvider.createPayment(
      orderId,
      amount,
      'PKR'
    );

    if (paymentResponse.status === 'FAILED') {
      return NextResponse.json(
        { success: false, error: paymentResponse.error || 'Payment failed' },
        { status: 400 }
      );
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        orderId,
        userId: order.buyerId,
        amount: new Decimal(amount),
        method: paymentMethod,
        status: paymentResponse.status === 'COMPLETED' ? 'COMPLETED' : 'PENDING',
        transactionId: paymentResponse.transactionId,
        reference: `PAY-${Date.now()}`,
        paidAt: paymentResponse.status === 'COMPLETED' ? new Date() : null,
      },
    });

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: payment.status,
        status: payment.status === 'COMPLETED' ? 'CONFIRMED' : 'PENDING',
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          paymentId: payment.id,
          status: payment.status,
          transactionId: payment.transactionId,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
