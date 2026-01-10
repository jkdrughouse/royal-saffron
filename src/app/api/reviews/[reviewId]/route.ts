import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/app/lib/db';
import { getCurrentUser } from '@/app/lib/auth';

// Update a review
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { reviewId } = await params;
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { rating, title, comment } = body;

    const reviews: any[] = await DB.reviews();
    const reviewIndex = reviews.findIndex((r: any) => r.id === reviewId);

    if (reviewIndex === -1) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    const review = reviews[reviewIndex];

    if (review.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Update review
    reviews[reviewIndex] = {
      ...review,
      ...(rating && { rating }),
      ...(title !== undefined && { title: title.trim() }),
      ...(comment && { comment: comment.trim() }),
      updatedAt: new Date().toISOString(),
    };

    await DB.saveReviews(reviews);

    return NextResponse.json({
      message: 'Review updated successfully',
      review: reviews[reviewIndex],
    });
  } catch (error) {
    console.error('Update review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete a review
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { reviewId } = await params;
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const reviews: any[] = await DB.reviews();
    const reviewIndex = reviews.findIndex((r: any) => r.id === reviewId);

    if (reviewIndex === -1) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    const review = reviews[reviewIndex];

    if (review.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    reviews.splice(reviewIndex, 1);
    await DB.saveReviews(reviews);

    return NextResponse.json({
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Delete review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
