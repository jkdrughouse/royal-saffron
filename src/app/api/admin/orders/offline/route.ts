import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/app/lib/db';
import { getAdminSession } from '../../me/route';
import { CustomerRecord, upsertCustomerRecord } from '@/app/lib/customer-utils';
import { generateReadableOrderId } from '@/app/lib/order-utils';

type OfflineOrderItem = {
    name: string;
    price: number;
    quantity: number;
    variant?: number;
    unit?: string;
};

type OfflineCustomerAddress = {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
};

type ExistingOrder = {
    id?: string;
};

// POST /api/admin/orders/offline — create a walk-in / phone POS order
export async function POST(request: NextRequest) {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json() as {
            customerName?: string;
            customerPhone?: string;
            customerAddress?: OfflineCustomerAddress;
            items?: OfflineOrderItem[];
            paymentMethod?: 'cash' | 'upi' | 'card';
            discount?: number;
        };
        const { customerName, customerPhone, customerAddress, items, paymentMethod, discount } = body;

        if (!customerName || !customerPhone || !items?.length) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const now = new Date();
        const nowIso = now.toISOString();
        const orders = await DB.orders<ExistingOrder>();
        const orderId = generateReadableOrderId(orders, 'offline', now);

        // Calculate totals
        const subtotal = items.reduce((sum: number, item: OfflineOrderItem) =>
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
            createdAt: nowIso,
            updatedAt: nowIso,
        };

        // Append to existing orders and persist
        orders.push(newOrder);
        await DB.saveOrders(orders);

        try {
            const customers = await DB.customers<CustomerRecord>();
            const { customers: nextCustomers } = upsertCustomerRecord(customers, {
                source: 'offline',
                name: customerName,
                phone: customerPhone,
                shippingAddress: newOrder.shippingAddress,
                orderId,
                orderTotal: total,
                orderCreatedAt: nowIso,
                createdAt: nowIso,
            });
            await DB.saveCustomers(nextCustomers);
        } catch (customerError) {
            console.error('Offline customer sync failed:', customerError);
        }

        return NextResponse.json({ order: newOrder }, { status: 201 });
    } catch (error) {
        console.error('Offline order creation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
