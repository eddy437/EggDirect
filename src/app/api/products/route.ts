import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getProductById, searchProducts } from '@/actions/products';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const skip = parseInt(searchParams.get('skip') || '0');
    const take = parseInt(searchParams.get('take') || '10');
    const search = searchParams.get('search');
    const productId = searchParams.get('id');

    if (productId) {
      const product = await getProductById(productId);
      if (!product) {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: product });
    }

    if (search) {
      const products = await searchProducts(search);
      return NextResponse.json({ success: true, data: products });
    }

    const products = await getProducts(skip, take);
    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
