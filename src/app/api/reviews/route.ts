import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/app/lib/db';
import { getCurrentUser } from '@/app/lib/auth';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  title?: string;
  comment: string;
  createdAt: string;
  updatedAt?: string;
  verified?: boolean; // true if user has purchased the product
}

// Get reviews for a product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const reviews: Review[] = await DB.reviews();
    const productReviews = reviews
      .filter((r: Review) => r.productId === productId && (r.verified !== false))
      .sort((a: Review, b: Review) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    // Calculate average rating
    const averageRating = productReviews.length > 0
      ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
      : 0;

    return NextResponse.json({
      reviews: productReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: productReviews.length,
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create a new review
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
    const { productId, rating, title, comment } = body;

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Product ID, rating, and comment are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if user has already reviewed this product
    const reviews: Review[] = await DB.reviews();
    const existingReview = reviews.find(
      (r: Review) => r.productId === productId && r.userId === user.id
    );

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Check if user has purchased the product (optional - for verified reviews)
    const orders: any[] = await DB.orders();
    const hasPurchased = orders.some((order: any) => 
      order.userId === user.id &&
      order.items.some((item: any) => item.productId === productId) &&
      order.status !== 'cancelled'
    );

    // Create review
    const review: Review = {
      id: `REV${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      productId,
      userId: user.id,
      userName: user.name,
      rating,
      title: title?.trim(),
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
      verified: hasPurchased,
    };

    reviews.push(review);
    await DB.saveReviews(reviews);

    return NextResponse.json(
      { message: 'Review submitted successfully', review },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
