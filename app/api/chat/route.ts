import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { ChatMessage } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const db = getDb();

    if (sessionId) {
      const messages = db.messages.filter(m => m.sessionId === sessionId);
      return NextResponse.json({ success: true, messages });
    }

    // Admin view: get all unique sessions and all messages
    return NextResponse.json({ success: true, messages: db.messages });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi tải tin nhắn' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, senderRole, senderName, message } = body;

    if (!sessionId || !message) {
      return NextResponse.json({ success: false, message: 'Thiếu nội dung' }, { status: 400 });
    }

    const db = getDb();
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sessionId,
      senderRole: senderRole || 'customer',
      senderName: senderName || (senderRole === 'admin' ? 'Tư Vấn Viên GuppyVibe' : 'Khách hàng'),
      message,
      timestamp: new Date().toISOString(),
      read: senderRole === 'admin'
    };

    db.messages.push(newMsg);

    // If customer sends a message and there is no admin reply yet, simulate auto helpful advice after 1 second
    if (senderRole === 'customer') {
      const botReply = generateSmartAquariumAdvice(message);
      if (botReply) {
        const autoReply: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sessionId,
          senderRole: 'admin',
          senderName: 'Trợ Lý Guppy AI (GuppyVibe)',
          message: botReply,
          timestamp: new Date(Date.now() + 800).toISOString(),
          read: true
        };
        db.messages.push(autoReply);
      }
    }

    saveDb(db);
    return NextResponse.json({ success: true, message: newMsg });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi gửi tin nhắn' }, { status: 500 });
  }
}

function generateSmartAquariumAdvice(msg: string): string | null {
  const lower = msg.toLowerCase();
  if (lower.includes('ship') || lower.includes('vận chuyển') || lower.includes('giao hàng') || lower.includes('xa') || lower.includes('oxy')) {
    return 'GuppyVibe vận chuyển cá 7 màu toàn quốc bằng thùng xốp cách nhiệt, túi nilon 2 lớp sục Oxy y tế 99.5%, đảm bảo cá bơi khỏe 48 tiếng. Shop cam kết bảo hành cá sống 100% khi nhận hàng!';
  }
  if (lower.includes('cho ăn') || lower.includes('thức ăn') || lower.includes('cám') || lower.includes('artemia') || lower.includes('lên màu')) {
    return 'Để cá 7 màu (đặc biệt là Full Red, Full Gold) lên màu rực rỡ và đuôi bung to, bạn nên cho ăn ấu trùng Artemia ấp nở tươi sống kết hợp cám hạt nổi Inve 3/5 ngày 2 cữ vừa đủ nhé!';
  }
  if (lower.includes('đẻ') || lower.includes('sinh sản') || lower.includes('cá con') || lower.includes('ép đẻ')) {
    return 'Khi cá 7 màu mái bụng vuông và hiện điểm đen mắt thai nhi gần hậu môn, bạn nên tách ngay vào lồng ép đẻ mica 2 tầng hoặc hồ có nhiều rong đuôi chồn để tránh cá mẹ ăn cá con nhé!';
  }
  if (lower.includes('túm') || lower.includes('lắc') || lower.includes('nấm') || lower.includes('bệnh') || lower.includes('muối')) {
    return 'Nếu cá 7 màu bị túm đuôi lắc mình, hãy bổ sung 1 thìa cafe muối hột/10L nước, cắm sưởi 28-30°C và thay 20% nước sạch. Tránh nước máy clo nồng độ cao!';
  }
  return 'Cảm ơn quý khách đã liên hệ GuppyVibe! Chuyên viên chăm sóc và tuyển chọn cá 7 màu đang xem tin nhắn và sẽ phản hồi chi tiết ngay trong giây lát.';
}
