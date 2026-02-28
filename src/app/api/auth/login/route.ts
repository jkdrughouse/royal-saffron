import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/app/lib/db';
import { comparePassword, generateToken } from '@/app/lib/auth';

interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  phone: string;
  shippingAddress?: any;
  billingAddress?: any;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const users: User[] = await DB.users();
    const user = users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValid = await comparePassword(password, (user as User).passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          shippingAddress: user.shippingAddress,
          billingAddress: user.billingAddress,
        },
      },
      { status: 200 }
    );

    // Set HTTP-only cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
