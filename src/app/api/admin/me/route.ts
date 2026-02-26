import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function getAdminSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return null;
    try {
        const payload = verify(token, JWT_SECRET) as any;
        return payload.admin ? payload : null;
    } catch {
        return null;
    }
}

export async function GET() {
    const session = await getAdminSession();
    if (!session) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    return NextResponse.json({ admin: true, email: session.email });
}
