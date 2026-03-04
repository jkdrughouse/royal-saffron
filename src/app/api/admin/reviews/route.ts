import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/app/lib/db';
import { getCurrentUser } from '@/app/lib/auth';
import { cookies } from 'next/headers';
import { verifyToken } from '@/app/lib/auth';

async function isAdmin(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (token) {
        const payload = verifyToken(token);
        return !!payload;
    }
    return false;
}

// GET — list all reviews (admin)
export async function GET() {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const reviews = await DB.reviews();
    const sorted = reviews.sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return NextResponse.json({ reviews: sorted });
}

// PATCH — toggle featured flag
export async function PATCH(request: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reviewId, featured } = await request.json();
    if (!reviewId || typeof featured !== 'boolean') {
        return NextResponse.json({ error: 'reviewId and featured (boolean) required' }, { status: 400 });
    }

    await DB.patchReview(reviewId, { featured });
    return NextResponse.json({ success: true, reviewId, featured });
}
