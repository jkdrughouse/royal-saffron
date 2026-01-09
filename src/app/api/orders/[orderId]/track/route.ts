import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/app/lib/db';
import { getCurrentUser } from '@/app/lib/auth';
import { getTrackingStatus, getTrackingUrl, getCourierName } from '@/app/lib/tracking';

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

    if (!order.trackingNumber) {
      return NextResponse.json(
        { error: 'Tracking number not available yet' },
        { status: 404 }
      );
    }

    const courierService = order.courierService || 'delhivery';
    const trackingInfo = await getTrackingStatus(courierService, order.trackingNumber);
    const trackingUrl = getTrackingUrl(courierService, order.trackingNumber);
    const courierName = getCourierName(courierService);

    return NextResponse.json({
      orderId: order.id,
      trackingNumber: order.trackingNumber,
      courierService: courierName,
      trackingUrl,
      status: order.status,
      trackingInfo,
    });
  } catch (error) {
    console.error('Track order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
