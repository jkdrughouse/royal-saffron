import { NextResponse } from 'next/server';
import { DB } from '@/app/lib/db';
import { getAdminSession } from '../me/route';

export async function GET() {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const users = await DB.users();
        return NextResponse.json({
            total: users.length,
            users: users.map((u: any) => ({
                id: u.id,
                name: u.name,
                email: u.email,
                phone: u.phone,
                createdAt: u.createdAt,
            })),
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
