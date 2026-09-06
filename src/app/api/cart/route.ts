import { NextRequest, NextResponse } from 'next/server';
import { getCart, addToCart, removeFromCart } from '@/actions/cart';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const cart = await getCart(userId);
    return NextResponse.json({ success: true, data: cart });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId, quantity } = body;

    const cartItem = await addToCart(userId, productId, quantity);
    return NextResponse.json({ success: true, data: cartItem }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, cartItemId } = body;

    await removeFromCart(userId, cartItemId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
