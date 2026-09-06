import { NextRequest, NextResponse } from 'next/server';
import { createRating, getRatingsByProductId } from '@/actions/ratings';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, userId, rating, comment, images } = body;

    const newRating = await createRating(
      productId,
      userId,
      rating,
      comment,
      images
    );

    return NextResponse.json({ success: true, data: newRating }, { status: 201 });
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
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const ratings = await getRatingsByProductId(productId);
    return NextResponse.json({ success: true, data: ratings });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
