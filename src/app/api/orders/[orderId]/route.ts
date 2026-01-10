import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/app/lib/db';
import { getCurrentUser } from '@/app/lib/auth';
import { sendEmail, getOrderStatusUpdateEmailHTML } from '@/app/lib/email';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { orderId } = await params;
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const orders: any[] = await DB.orders();
    const order = orders.find((o: any) => o.id === orderId);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update order status (admin only - for now, allow if authenticated)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { orderId } = await params;
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status, trackingNumber, courierService } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const orders: any[] = await DB.orders();
    const orderIndex = orders.findIndex((o: any) => o.id === orderId);

    if (orderIndex === -1) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const order = orders[orderIndex];

    // Check ownership (or admin check can be added here)
    if (order.userId !== user.id) {
      // For now, allow if authenticated - in production, add admin check
      // return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update order
    orders[orderIndex] = {
      ...order,
      status,
      ...(trackingNumber && { trackingNumber }),
      ...(courierService && { courierService }),
      updatedAt: new Date().toISOString(),
    };

    await DB.saveOrders(orders);

    // Send status update email
    try {
      const users: any[] = await DB.users();
      const orderUser = users.find((u: any) => u.id === order.userId);
      
      if (orderUser?.email) {
        await sendEmail({
          to: orderUser.email,
          subject: `Order Update #${orderId} - Royal Saffron`,
          html: getOrderStatusUpdateEmailHTML({
            id: orderId,
            status,
            trackingNumber,
            courierService,
          }),
        });
      }
    } catch (emailError) {
      // Don't fail the update if email fails
      console.error('Failed to send status update email:', emailError);
    }

    return NextResponse.json({
      message: 'Order updated successfully',
      order: orders[orderIndex],
    });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
