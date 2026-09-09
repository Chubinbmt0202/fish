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
      senderName: senderName || (senderRole === 'admin' ? 'Tư Vấn Viên AquaVibe' : 'Khách hàng'),
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
          senderName: 'Trợ Lý Thủy Sinh AI (AquaVibe)',
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
  if (lower.includes('ship') || lower.includes('vận chuyển') || lower.includes('giao hàng') || lower.includes('xa')) {
    return 'AquaVibe vận chuyển toàn quốc bằng thùng xốp cách nhiệt sục khí Oxy nguyên chất 99.5%, cam kết cá khỏe 100% khi nhận hàng. Shop đền bù hoặc gửi bù nếu có rủi ro!';
  }
  if (lower.includes('cho ăn') || lower.includes('thức ăn') || lower.includes('cám')) {
    return 'Chào bạn, đối với cá cảnh mới về hồ, bạn nên nhịn ăn ngày đầu tiên để cá làm quen nước, từ ngày thứ 2 cho ăn lượng nhỏ cám chìm hoặc trùn chỉ sạch nhé!';
  }
  if (lower.includes('nước mặn') || lower.includes('hải quỳ') || lower.includes('nemo')) {
    return 'Các dòng cá nước mặn như Cá Hề Nemo cần độ mặn từ 1.023 - 1.025 và nhiệt độ 25-27 độ C. Shop có sẵn muối pha san hô cao cấp!';
  }
  return 'Cảm ơn quý khách đã liên hệ AquaVibe! Chuyên viên chăm sóc cá cảnh đang xem tin nhắn và sẽ phản hồi chi tiết ngay trong giây lát.';
}
