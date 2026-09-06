import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/actions/auth';
import { LoginSchema } from '@/types/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = LoginSchema.parse(body);

    const result = await login(data);

    const response = NextResponse.json(
      { success: true, data: result },
      { status: 200 }
    );

    response.cookies.set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 401 }
    );
  }
}
