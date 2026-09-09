import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { Review } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const db = getDb();

    if (productId) {
      const reviews = db.reviews.filter(r => r.productId === productId);
      return NextResponse.json({ success: true, reviews });
    }

    return NextResponse.json({ success: true, reviews: db.reviews });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi tải đánh giá' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, userName, rating, comment } = body;

    if (!productId || !userName || !comment) {
      return NextResponse.json({ success: false, message: 'Vui lòng nhập đủ thông tin' }, { status: 400 });
    }

    const db = getDb();
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userName,
      rating: Number(rating) || 5,
      comment,
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true
    };

    db.reviews.unshift(newReview);

    // Update product rating and review count
    const prod = db.products.find(p => p.id === productId);
    if (prod) {
      const prodReviews = db.reviews.filter(r => r.productId === productId);
      const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
      prod.rating = Number(avg.toFixed(1));
      prod.reviewCount = prodReviews.length;
    }

    saveDb(db);
    return NextResponse.json({ success: true, review: newReview });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi gửi đánh giá' }, { status: 500 });
  }
}
