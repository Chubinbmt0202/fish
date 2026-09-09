import { NextResponse } from 'next/server';
import { getDb, saveDb, getAvailableStock } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const db = getDb();
    const product = db.products.find(p => p.id === params.id || p.slug === params.id);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        availableStock: getAvailableStock(product.id)
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const db = getDb();
    const index = db.products.findIndex(p => p.id === params.id);

    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    db.products[index] = {
      ...db.products[index],
      ...body,
      price: Number(body.price) || db.products[index].price,
      stock: Number(body.stock) !== undefined ? Number(body.stock) : db.products[index].stock,
    };

    saveDb(db);
    return NextResponse.json({ success: true, product: db.products[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi cập nhật sản phẩm' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const db = getDb();
    const initialLength = db.products.length;
    db.products = db.products.filter(p => p.id !== params.id);

    if (db.products.length === initialLength) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    saveDb(db);
    return NextResponse.json({ success: true, message: 'Đã xóa sản phẩm thành công' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi xóa sản phẩm' }, { status: 500 });
  }
}
