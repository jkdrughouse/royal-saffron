import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@/app/lib/auth';

// Env validation for admin credentials
if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error('[admin/auth] FATAL: ADMIN_EMAIL or ADMIN_PASSWORD env variable is not set.');
}
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
        }

        const token = sign({ admin: true, email }, JWT_SECRET, { expiresIn: '12h' });

        const response = NextResponse.json({ message: 'Admin login successful' });
        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 12, // 12 hours
            path: '/',
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE() {
    const response = NextResponse.json({ message: 'Logged out' });
    response.cookies.delete('admin_token');
    return response;
}
