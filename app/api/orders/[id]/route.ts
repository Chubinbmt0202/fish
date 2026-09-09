import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { OrderStatus, OrderTimeline } from '@/lib/types';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const db = getDb();
    const order = db.orders.find(o => o.id === params.id || o.orderNumber === params.id);
    if (!order) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy đơn hàng' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { status, note, paymentStatus } = body as { status?: OrderStatus; note?: string; paymentStatus?: string };

    const db = getDb();
    const index = db.orders.findIndex(o => o.id === params.id || o.orderNumber === params.id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy đơn hàng' }, { status: 404 });
    }

    const order = db.orders[index];
    const nowStr = new Date().toLocaleString('vi-VN');

    if (status && status !== order.status) {
      let title = '';
      let desc = '';

      switch (status) {
        case 'confirmed':
          title = 'Đã xác nhận đơn hàng';
          desc = 'Đơn hàng hợp lệ, bộ phận thủy sinh đang chọn cá khỏe đẹp nhất.';
          break;
        case 'packing_oxygen':
          title = 'Đang đóng gói bơm Oxy sinh học chuyên dụng';
          desc = 'Kỹ thuật viên đang sục khí Oxy y tế 99.5%, đo pH, bổ sung khoáng chống sốc nhiệt và đóng thùng xốp.';
          break;
        case 'shipping':
          title = 'Bàn giao đơn vị vận chuyển hỏa tốc';
          desc = 'Đơn hàng đang trên đường giao tới bạn. Vui lòng giữ liên lạc điện thoại.';
          break;
        case 'delivered':
          title = 'Đã giao hàng thành công';
          desc = 'Khách hàng đã nhận kiện hàng cá cảnh sống an toàn và thanh toán.';
          break;
        case 'cancelled':
          title = 'Đơn hàng đã hủy';
          desc = note || 'Đơn hàng đã được hủy theo yêu cầu hoặc do thanh toán quá hạn.';
          // Return items to stock if cancelled
          for (const item of order.items) {
            const p = db.products.find(prod => prod.id === item.productId);
            if (p) p.stock += item.quantity;
          }
          break;
      }

      const newTimelineItem: OrderTimeline = {
        status,
        title,
        description: desc,
        timestamp: nowStr
      };

      order.timeline.push(newTimelineItem);
      order.status = status;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus as any;
    }
    order.updatedAt = new Date().toISOString();

    saveDb(db);
    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi cập nhật trạng thái đơn hàng' }, { status: 500 });
  }
}
