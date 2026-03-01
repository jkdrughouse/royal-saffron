import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/app/lib/db';
import { getAdminSession } from '../../me/route';

// POST /api/admin/orders/offline — create a walk-in / phone POS order
export async function POST(request: NextRequest) {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const { customerName, customerPhone, customerAddress, items, paymentMethod, discount } = body;

        if (!customerName || !customerPhone || !items?.length) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Generate unique OFFLINE order ID: OFFLINE-YYYYMMDD-XXXX
        const now = new Date();
        const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
        const orders = await DB.orders();
        const todayOfflineCount = orders.filter((o: any) =>
            o.id?.startsWith(`OFFLINE-${datePart}`)
        ).length;
        const seq = String(todayOfflineCount + 1).padStart(4, '0');
        const orderId = `OFFLINE-${datePart}-${seq}`;

        // Calculate totals
        const subtotal = items.reduce((sum: number, item: any) =>
            sum + (item.price * item.quantity), 0
        );
        const discountAmount = discount ?? 0;
        const total = Math.max(0, subtotal - discountAmount);

        const newOrder = {
            id: orderId,
            type: 'offline',
            userId: 'walk-in',
            items,
            subtotal,
            discount: discountAmount,
            shipping: 0,
            total,
            status: 'confirmed',
            paymentMethod: paymentMethod ?? 'cash',
            shippingAddress: {
                name: customerName,
                phone: customerPhone,
                address: customerAddress?.address ?? 'Walk-in',
                city: customerAddress?.city ?? '',
                state: customerAddress?.state ?? '',
                pincode: customerAddress?.pincode ?? '',
            },
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
        };

        // Append to existing orders and persist
        const allOrders = await DB.orders();
        allOrders.push(newOrder);
        await DB.saveOrders(allOrders);

        return NextResponse.json({ order: newOrder }, { status: 201 });
    } catch (error) {
        console.error('Offline order creation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
