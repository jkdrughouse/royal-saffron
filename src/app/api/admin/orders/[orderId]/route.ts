import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/app/lib/db';
import { getAdminSession } from '../../me/route';
import { sendEmail, getOrderStatusUpdateEmailHTML } from '@/app/lib/email';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { orderId } = await params;

    try {
        const { status, trackingNumber, courierService } = await request.json();
        const orders: any[] = await DB.orders();
        const users: any[] = await DB.users();

        const orderIndex = orders.findIndex((o: any) => o.id === orderId);
        if (orderIndex === -1) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        const order = orders[orderIndex];
        const previousStatus = order.status;

        orders[orderIndex] = {
            ...order,
            status: status ?? order.status,
            trackingNumber: trackingNumber ?? order.trackingNumber,
            courierService: courierService ?? order.courierService,
            updatedAt: new Date().toISOString(),
        };

        await DB.saveOrders(orders);

        // Send email notification if status changed
        if (status && status !== previousStatus) {
            const user = users.find((u: any) => u.id === order.userId);
            if (user?.email) {
                try {
                    await sendEmail({
                        to: user.email,
                        subject: `Order Update #${order.id} - Jhelum Kesar Co.`,
                        html: getOrderStatusUpdateEmailHTML({
                            id: order.id,
                            status,
                            trackingNumber: orders[orderIndex].trackingNumber,
                            courierService: orders[orderIndex].courierService,
                        }),
                    });
                } catch (emailErr) {
                    console.error('Status email failed:', emailErr);
                }
            }
        }

        return NextResponse.json({ message: 'Order updated', order: orders[orderIndex] });
    } catch (error) {
        console.error('Admin update order error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
