import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/app/lib/db';
import { getCurrentUser } from '@/app/lib/auth';
import { sendEmail, getOrderConfirmationEmailHTML } from '@/app/lib/email';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  variant?: number;
  unit?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  billingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  trackingNumber?: string;
  courierService?: string;
  createdAt: string;
  updatedAt: string;
}

// Create new order
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items, shippingAddress, billingAddress } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order items are required' },
        { status: 400 }
      );
    }

    if (!shippingAddress || !billingAddress) {
      return NextResponse.json(
        { error: 'Shipping and billing addresses are required' },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: OrderItem) => 
      sum + (item.price * item.quantity), 0
    );
    const shipping = subtotal >= 1000 ? 0 : 50;
    const total = subtotal + shipping;

    // Create order
    const order: Order = {
      id: `ORD${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      userId: user.id,
      items,
      subtotal,
      shipping,
      total,
      status: 'pending',
      shippingAddress,
      billingAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const orders: Order[] = await DB.orders();
    orders.push(order);
    await DB.saveOrders(orders);

    // Send order confirmation email
    try {
      const userEmail = user.email;
      await sendEmail({
        to: userEmail,
        subject: `Order Confirmation #${order.id} - Royal Saffron`,
        html: getOrderConfirmationEmailHTML(order),
      });
    } catch (emailError) {
      // Don't fail the order if email fails
      console.error('Failed to send order confirmation email:', emailError);
    }

    return NextResponse.json(
      { message: 'Order created successfully', order },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get user's orders
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const orders: Order[] = await DB.orders();
    const userOrders = orders.filter((order: Order) => order.userId === user.id);

    // Sort by most recent first
    userOrders.sort((a: Order, b: Order) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ orders: userOrders });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
