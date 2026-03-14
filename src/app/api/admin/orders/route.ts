import { NextResponse } from 'next/server';
import { DB } from '@/app/lib/db';
import { getAdminSession } from '../me/route';

type AdminOrderSummary = {
    createdAt?: string;
};

// GET all orders (admin only)
export async function GET() {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const orders = await DB.orders<AdminOrderSummary>();
        orders.sort((a, b) =>
            new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
        );
        return NextResponse.json({ orders }, {
            headers: { 'Cache-Control': 'no-store' },
        });
    } catch (error) {
        console.error('Admin orders fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
