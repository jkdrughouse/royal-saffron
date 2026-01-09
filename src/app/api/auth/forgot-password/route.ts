import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/app/lib/db';
import { generateOTP, storeOTP, getOTP } from '@/app/lib/otp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const users: any[] = await DB.users();
    const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Don't reveal if user exists or not (security best practice)
      return NextResponse.json({
        message: 'If an account exists with this email, an OTP has been sent.',
      });
    }

    // Generate OTP
    const otp = generateOTP();
    storeOTP(email.toLowerCase(), otp);

    // In production, send OTP via email/SMS service
    // For now, we'll return it in development (remove in production!)
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
    // await sendOTPEmail(email, otp);
    
    console.log(`[DEV] OTP for ${email}: ${otp}`); // Remove in production

    return NextResponse.json({
      message: 'If an account exists with this email, an OTP has been sent.',
      // Only return OTP in development
      ...(isDevelopment && { otp, email: email.toLowerCase() }),
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Verify OTP endpoint
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp, newPassword } = body;

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: 'Email, OTP, and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Verify OTP
    const { verifyOTP } = await import('@/app/lib/otp');
    const isValid = verifyOTP(email.toLowerCase(), otp);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 401 }
      );
    }

    // Update password
    const { DB } = await import('@/app/lib/db');
    const { hashPassword } = await import('@/app/lib/auth');
    
    const users: any[] = await DB.users();
    const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const newPasswordHash = await hashPassword(newPassword);
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    users[userIndex].passwordHash = newPasswordHash;

    await DB.saveUsers(users);

    return NextResponse.json({
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
