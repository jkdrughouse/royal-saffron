import { NextResponse } from 'next/server';
import { DB } from '@/app/lib/db';
import { getAdminSession } from '../me/route';

type StoredUser = {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    createdAt?: string;
    shippingAddress?: Record<string, unknown>;
    billingAddress?: Record<string, unknown>;
};

type StoredCustomer = {
    id: string;
    source?: 'account' | 'guest' | 'offline';
    linkedUserId?: string;
    name?: string;
    email?: string;
    phone?: string;
    shippingAddress?: Record<string, unknown>;
    billingAddress?: Record<string, unknown>;
    orderIds?: string[];
    orderCount?: number;
    totalSpend?: number;
    lastOrderId?: string;
    createdAt?: string;
    updatedAt?: string;
};

export async function GET() {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const [users, customers] = await Promise.all([
            DB.users<StoredUser>(),
            DB.customers<StoredCustomer>(),
        ]);
        const combinedCustomers = [...customers];

        for (const user of users) {
            const normalizedEmail = user.email?.toLowerCase();
            const normalizedPhone = user.phone?.replace(/\D/g, '');
            const existingIndex = combinedCustomers.findIndex((customer) =>
                customer.linkedUserId === user.id ||
                (normalizedEmail && customer.email?.toLowerCase() === normalizedEmail) ||
                (normalizedPhone && customer.phone?.replace(/\D/g, '') === normalizedPhone)
            );

            if (existingIndex === -1) {
                combinedCustomers.push({
                    id: `CUS-ACC-${user.id}`,
                    source: 'account',
                    linkedUserId: user.id,
                    name: user.name,
                    email: normalizedEmail,
                    phone: normalizedPhone,
                    shippingAddress: user.shippingAddress,
                    billingAddress: user.billingAddress,
                    orderIds: [],
                    orderCount: 0,
                    totalSpend: 0,
                    createdAt: user.createdAt,
                    updatedAt: user.createdAt,
                });
                continue;
            }

            combinedCustomers[existingIndex] = {
                ...combinedCustomers[existingIndex],
                source: 'account',
                linkedUserId: combinedCustomers[existingIndex].linkedUserId || user.id,
                name: combinedCustomers[existingIndex].name || user.name,
                email: combinedCustomers[existingIndex].email || normalizedEmail,
                phone: combinedCustomers[existingIndex].phone || normalizedPhone,
                shippingAddress: combinedCustomers[existingIndex].shippingAddress || user.shippingAddress,
                billingAddress: combinedCustomers[existingIndex].billingAddress || user.billingAddress,
            };
        }

        combinedCustomers.sort((a, b) =>
            new Date(b.updatedAt || b.createdAt || 0).getTime() -
            new Date(a.updatedAt || a.createdAt || 0).getTime()
        );

        return NextResponse.json({
            total: combinedCustomers.length,
            users: combinedCustomers.map((customer) => ({
                id: customer.id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                source: customer.source,
                orderCount: customer.orderCount ?? customer.orderIds?.length ?? 0,
                totalSpend: customer.totalSpend ?? 0,
                lastOrderId: customer.lastOrderId,
                createdAt: customer.createdAt,
                updatedAt: customer.updatedAt,
            })),
        }, {
            headers: { 'Cache-Control': 'no-store' },
        });
    } catch (error) {
        console.error('Admin customers fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
