import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { User } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, name, phone, address, role } = body;
    const db = getDb();

    if (action === 'register') {
      if (!email || !name) {
        return NextResponse.json({ success: false, message: 'Thiếu email hoặc họ tên' }, { status: 400 });
      }

      const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return NextResponse.json({ success: false, message: 'Email đã được sử dụng' }, { status: 400 });
      }

      const newUser: User = {
        id: `usr-${Date.now()}`,
        name,
        email,
        phone: phone || '',
        address: address || '',
        city: 'Hồ Chí Minh',
        role: role === 'admin' ? 'admin' : 'customer',
        createdAt: new Date().toISOString()
      };

      db.users.push(newUser);
      saveDb(db);

      return NextResponse.json({ success: true, user: newUser, message: 'Đăng ký tài khoản thành công' });
    }

    // Login action
    if (action === 'login') {
      if (!email) {
        return NextResponse.json({ success: false, message: 'Vui lòng nhập email' }, { status: 400 });
      }

      const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        // Auto-create customer user if not found for easy testing
        const autoUser: User = {
          id: `usr-${Date.now()}`,
          name: email.split('@')[0],
          email,
          role: email.includes('admin') ? 'admin' : 'customer',
          createdAt: new Date().toISOString()
        };
        db.users.push(autoUser);
        saveDb(db);
        return NextResponse.json({ success: true, user: autoUser, message: 'Đăng nhập thành công' });
      }

      return NextResponse.json({ success: true, user, message: 'Đăng nhập thành công' });
    }

    return NextResponse.json({ success: false, message: 'Hành động không hợp lệ' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi xác thực' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = getDb();
    return NextResponse.json({ success: true, users: db.users });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi tải danh sách người dùng' }, { status: 500 });
  }
}
