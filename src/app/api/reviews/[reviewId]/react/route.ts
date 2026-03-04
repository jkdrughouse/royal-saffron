import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/app/lib/db';

const ALLOWED_EMOJIS = ['👍', '❤️', '🔥', '🌟', '😍'];

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ reviewId: string }> }
) {
    try {
        const { reviewId } = await params;
        const body = await request.json();
        const { emoji } = body;

        if (!emoji || !ALLOWED_EMOJIS.includes(emoji)) {
            return NextResponse.json({ error: 'Invalid emoji' }, { status: 400 });
        }

        const reviews: any[] = await DB.reviews();
        const review = reviews.find((r) => r.id === reviewId);

        if (!review) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 });
        }

        const reactions = review.reactions || {};
        reactions[emoji] = (reactions[emoji] || 0) + 1;

        await DB.patchReview(reviewId, { reactions });

        return NextResponse.json({ reactions });
    } catch (error) {
        console.error('React to review error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
