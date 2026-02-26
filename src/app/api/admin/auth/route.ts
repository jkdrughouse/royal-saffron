import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'contact@jhelumkesarco.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Nationalhighway03#';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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
            sameSite: 'lax',
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
