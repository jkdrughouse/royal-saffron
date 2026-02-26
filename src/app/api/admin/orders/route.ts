import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/app/lib/db';
import { getAdminSession } from '../me/route';

// GET all orders (admin only)
export async function GET() {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const orders = await DB.orders();
        orders.sort((a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        return NextResponse.json({ orders });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
