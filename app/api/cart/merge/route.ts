import { NextResponse } from 'next/server';
import { CartItem } from '@/lib/types';

// Handles merging guest cart items (from localStorage) into the user account cart
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { localItems, userItems } = body as { localItems: CartItem[]; userItems?: CartItem[] };

    const mergedMap = new Map<string, number>();

    // Existing user items
    if (userItems && Array.isArray(userItems)) {
      for (const item of userItems) {
        mergedMap.set(item.productId, (mergedMap.get(item.productId) || 0) + item.quantity);
      }
    }

    // Merge guest local items
    if (localItems && Array.isArray(localItems)) {
      for (const item of localItems) {
        mergedMap.set(item.productId, (mergedMap.get(item.productId) || 0) + item.quantity);
      }
    }

    const mergedCart: CartItem[] = Array.from(mergedMap.entries()).map(([productId, quantity]) => ({
      productId,
      quantity
    }));

    return NextResponse.json({
      success: true,
      message: 'Đã đồng bộ và gộp giỏ hàng khách vãng lai vào tài khoản thành công',
      cart: mergedCart
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi gộp giỏ hàng' }, { status: 500 });
  }
}
