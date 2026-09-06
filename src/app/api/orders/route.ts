import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/actions/orders';
import { clearCart } from '@/actions/cart';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      shopId,
      items,
      shippingAddress,
      subtotal,
      shippingCost,
      tax,
    } = body;

    // Create order
    const order = await createOrder(
      userId,
      shopId,
      items,
      shippingAddress,
      subtotal,
      shippingCost,
      tax
    );

    // Clear cart
    await clearCart(userId);

    return NextResponse.json(
      { success: true, data: order },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const orderId = searchParams.get('id');

    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) {
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: order });
    }

    if (userId) {
      const orders = await prisma.order.findMany({
        where: { buyerId: userId },
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ success: true, data: orders });
    }

    return NextResponse.json(
      { success: false, error: 'Missing userId or orderId' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
