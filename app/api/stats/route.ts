import { NextResponse } from 'next/server';
import { getDb, cleanExpiredLocks } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    cleanExpiredLocks(db);

    const totalOrders = db.orders.length;
    const totalRevenue = db.orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const now = Date.now();
    const activeLocks = db.inventoryLocks.filter(l => l.status === 'active' && l.expiresAt > now);

    const orderStatusCounts = {
      pending: db.orders.filter(o => o.status === 'pending').length,
      confirmed: db.orders.filter(o => o.status === 'confirmed').length,
      packing_oxygen: db.orders.filter(o => o.status === 'packing_oxygen').length,
      shipping: db.orders.filter(o => o.status === 'shipping').length,
      delivered: db.orders.filter(o => o.status === 'delivered').length,
      cancelled: db.orders.filter(o => o.status === 'cancelled').length,
    };

    const totalProducts = db.products.length;
    const totalStock = db.products.reduce((sum, p) => sum + p.stock, 0);

    // Sales by category
    const categorySales: Record<string, number> = {};
    for (const order of db.orders) {
      if (order.status !== 'cancelled') {
        for (const item of order.items) {
          const prod = db.products.find(p => p.id === item.productId);
          const cat = prod?.categoryName || 'Khác';
          categorySales[cat] = (categorySales[cat] || 0) + (item.price * item.quantity);
        }
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        activeLocksCount: activeLocks.length,
        activeLocks,
        orderStatusCounts,
        totalProducts,
        totalStock,
        categorySales,
        recentOrders: db.orders.slice(0, 5)
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi tải thống kê' }, { status: 500 });
  }
}
