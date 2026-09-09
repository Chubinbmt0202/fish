import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { commitInventoryAndDeductStock } from '@/lib/inventory-lock';
import { Order, OrderTimeline } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const orderNumber = searchParams.get('orderNumber');
    const status = searchParams.get('status');

    const db = getDb();
    let orders = [...db.orders];

    if (userId) {
      orders = orders.filter(o => o.userId === userId);
    }
    if (orderNumber) {
      orders = orders.filter(o => o.orderNumber.toLowerCase().includes(orderNumber.toLowerCase()));
    }
    if (status && status !== 'all') {
      orders = orders.filter(o => o.status === status);
    }

    // Sort newest first
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi tải đơn hàng' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      sessionId,
      customerName,
      email,
      phone,
      address,
      city,
      note,
      items,
      subtotal,
      discount,
      shippingFee,
      total,
      paymentMethod,
      promoCode,
      userId
    } = body;

    if (!customerName || !phone || !address || !items || items.length === 0) {
      return NextResponse.json({ success: false, message: 'Vui lòng điền đủ thông tin bắt buộc' }, { status: 400 });
    }

    // 1. Deduct official inventory
    const deductResult = commitInventoryAndDeductStock(
      sessionId || `sess-${Date.now()}`,
      items.map((i: any) => ({ productId: i.productId, quantity: i.quantity }))
    );

    if (!deductResult.success) {
      return NextResponse.json({ success: false, message: deductResult.message }, { status: 409 });
    }

    const nowStr = new Date().toISOString();
    const orderNum = `AQV-${Math.floor(10000 + Math.random() * 90000)}`;

    const initialTimeline: OrderTimeline[] = [
      {
        status: 'pending',
        title: 'Đã nhận đơn hàng',
        description: 'Hệ thống tự động tiếp nhận và khóa trừ tồn kho an toàn.',
        timestamp: new Date().toLocaleString('vi-VN')
      },
      {
        status: 'confirmed',
        title: 'Hệ thống xác nhận hợp lệ',
        description: 'Đơn hàng sẵn sàng chuyển sang bộ phận kỹ thuật đóng gói oxy.',
        timestamp: new Date().toLocaleString('vi-VN')
      }
    ];

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customerName,
      email,
      phone,
      address,
      city: city || 'Hồ Chí Minh',
      note: note || '',
      items,
      subtotal: Number(subtotal) || 0,
      discount: Number(discount) || 0,
      shippingFee: Number(shippingFee) || 0,
      total: Number(total) || 0,
      status: 'confirmed', // Auto-confirm on checkout
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      promoCode,
      userId,
      createdAt: nowStr,
      updatedAt: nowStr,
      timeline: initialTimeline
    };

    const db = getDb();
    db.orders.unshift(newOrder);
    saveDb(db);

    return NextResponse.json({
      success: true,
      message: 'Đặt hàng thành công! Đơn hàng đang được chuẩn bị đóng gói oxy.',
      order: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, message: 'Lỗi tạo đơn hàng' }, { status: 500 });
  }
}
