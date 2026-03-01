import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { JWT_SECRET } from '@/app/lib/auth';


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
