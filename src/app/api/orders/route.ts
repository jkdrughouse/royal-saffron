import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/app/lib/db';
import { getCurrentUser } from '@/app/lib/auth';
import { sendEmail, getOrderConfirmationEmailHTML } from '@/app/lib/email';
import { products } from '@/app/lib/products';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  variant?: number;
  unit?: string;
  image?: string;
}

export interface Order {
  id: string;
  userId: string;
  guestEmail?: string;
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

// Create new order (supports both authenticated users and guests)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { items, shippingAddress, billingAddress, guestEmail } = body;

    // Must be logged in OR provide a guest email
    if (!user && !guestEmail) {
      return NextResponse.json(
        { error: 'Authentication or guest email required' },
        { status: 401 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Order items are required' }, { status: 400 });
    }

    if (!shippingAddress || !billingAddress) {
      return NextResponse.json({ error: 'Shipping and billing addresses are required' }, { status: 400 });
    }

    // Enrich items with product image if not provided
    const enrichedItems: OrderItem[] = items.map((item: OrderItem) => {
      if (!item.image) {
        const product = products.find(p => p.id === item.productId);
        return { ...item, image: product?.image || '' };
      }
      return item;
    });

    // Calculate totals
    const subtotal = enrichedItems.reduce((sum: number, item: OrderItem) =>
      sum + (item.price * item.quantity), 0
    );
    const shipping = subtotal >= 1000 ? 0 : 50;
    const total = subtotal + shipping;

    // Create order
    const order: Order = {
      id: `ORD${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      userId: user?.id || 'guest',
      guestEmail: user ? undefined : guestEmail,
      items: enrichedItems,
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
      const toEmail = user?.email || guestEmail;
      await sendEmail({
        to: toEmail,
        subject: `Order Confirmation #${order.id} - Jhelum Kesar Co.`,
        html: getOrderConfirmationEmailHTML(order),
      });
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
    }

    return NextResponse.json(
      { message: 'Order created successfully', order },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get user's orders
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const orders: Order[] = await DB.orders();
    const userOrders = orders.filter((order: Order) => order.userId === user.id);

    userOrders.sort((a: Order, b: Order) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Backfill missing item images from the local products catalog
    const enrichedOrders = userOrders.map((order: Order) => ({
      ...order,
      items: order.items.map((item: OrderItem) => {
        if (!item.image) {
          const product = products.find(p => p.id === item.productId);
          return { ...item, image: product?.image || '' };
        }
        return item;
      }),
    }));

    return NextResponse.json({ orders: enrichedOrders });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
