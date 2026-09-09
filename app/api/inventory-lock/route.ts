import { NextResponse } from 'next/server';
import { lockInventoryForCheckout, releaseInventoryLock, getSessionLockStatus } from '@/lib/inventory-lock';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, items, userId } = body;

    if (!sessionId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }

    const result = lockInventoryForCheckout(sessionId, items, userId);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 409 });
    }

    return NextResponse.json({
      success: true,
      message: 'Đã tạm khóa tồn kho trong 10 phút để thanh toán',
      expiresAt: result.expiresAt,
      remainingSeconds: 600,
    });
  } catch (error) {
    console.error('Error locking inventory:', error);
    return NextResponse.json({ success: false, message: 'Lỗi khóa tồn kho' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ success: false, message: 'Thiếu sessionId' }, { status: 400 });
    }

    const status = getSessionLockStatus(sessionId);
    return NextResponse.json({ success: true, ...status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi kiểm tra lock' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ success: false, message: 'Thiếu sessionId' }, { status: 400 });
    }

    const released = releaseInventoryLock(sessionId);
    return NextResponse.json({ success: true, released, message: 'Đã giải phóng tạm khóa tồn kho' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi giải phóng lock' }, { status: 500 });
  }
}
