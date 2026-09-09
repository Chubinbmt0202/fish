import fs from 'fs';
import path from 'path';
import { Product, Order, ChatMessage, User, BlogPost, Review, InventoryLock } from './types';
import { INITIAL_PRODUCTS, INITIAL_BLOGS, INITIAL_REVIEWS } from './mock-data';

interface DatabaseSchema {
  products: Product[];
  orders: Order[];
  messages: ChatMessage[];
  users: User[];
  blogs: BlogPost[];
  reviews: Review[];
  inventoryLocks: InventoryLock[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'db.json');

function getInitialData(): DatabaseSchema {
  return {
    products: INITIAL_PRODUCTS,
    orders: [
      {
        id: 'ord-101',
        orderNumber: 'AQV-88291',
        customerName: 'Nguyễn Văn Hùng',
        email: 'hung.nguyen@example.com',
        phone: '0908123456',
        address: '124 Nguyễn Thị Minh Khai, Phường 6, Quận 3',
        city: 'Hồ Chí Minh',
        note: 'Giao trong giờ hành chính, bọc thêm 1 lớp mút cách nhiệt giúp mình nhé',
        items: [
          {
            productId: 'prod-3',
            name: 'Cá Betta Halfmoon Koi Galaxy Siêu Phẩm',
            price: 250000,
            image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80',
            quantity: 2,
            waterType: 'freshwater'
          },
          {
            productId: 'prod-7',
            name: 'Combo 20 Tép Cảnh Red Cherry Cực Đỏ',
            price: 120000,
            image: 'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=800&q=80',
            quantity: 1,
            waterType: 'freshwater'
          }
        ],
        subtotal: 620000,
        discount: 50000,
        shippingFee: 35000,
        total: 605000,
        status: 'packing_oxygen',
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        promoCode: 'AQUAVIBE10',
        createdAt: '2026-03-08T10:15:00Z',
        updatedAt: '2026-03-08T11:30:00Z',
        userId: 'usr-customer-1',
        timeline: [
          {
            status: 'pending',
            title: 'Đơn hàng đã tạo',
            description: 'Khách hàng đặt đơn thành công qua website.',
            timestamp: '2026-03-08 10:15'
          },
          {
            status: 'confirmed',
            title: 'AquaVibe xác nhận đơn hàng',
            description: 'Bộ phận điều phối đã duyệt cá cảnh và chuẩn bị hồ xuất trại.',
            timestamp: '2026-03-08 10:45'
          },
          {
            status: 'packing_oxygen',
            title: 'Đang đóng gói bơm Oxy sinh học',
            description: 'Kỹ thuật viên đang sục khí Oxy y tế 99.5%, kiểm tra nhiệt độ nước và đóng thùng xốp giữ nhiệt.',
            timestamp: '2026-03-08 11:30'
          }
        ]
      }
    ],
    messages: [
      {
        id: 'msg-1',
        sessionId: 'guest-session-1',
        senderRole: 'customer',
        senderName: 'Khách Vãng Lai',
        message: 'Xin chào shop! Cá Rồng Huyết Long gửi đi Đà Nẵng thì bao lâu tới nơi vậy ạ?',
        timestamp: '2026-03-09T08:30:00Z',
        read: false
      },
      {
        id: 'msg-2',
        sessionId: 'guest-session-1',
        senderRole: 'admin',
        senderName: 'Tư Vấn Viên AquaVibe',
        message: 'Dạ chào bạn! Đi Đà Nẵng shop gửi dịch vụ chuyển phát hỏa tốc đường bay đóng oxy 48h, nhận cá trong vòng 12-16 tiếng đảm bảo 100% khỏe mạnh nhé!',
        timestamp: '2026-03-09T08:32:00Z',
        read: true
      }
    ],
    users: [
      {
        id: 'usr-admin-1',
        name: 'Quản Trị Viên AquaVibe',
        email: 'admin@aquavibe.vn',
        phone: '0988888999',
        role: 'admin',
        createdAt: '2026-01-01T00:00:00Z'
      },
      {
        id: 'usr-customer-1',
        name: 'Nguyễn Văn Hùng',
        email: 'hung.nguyen@example.com',
        phone: '0908123456',
        address: '124 Nguyễn Thị Minh Khai, Phường 6, Quận 3',
        city: 'Hồ Chí Minh',
        role: 'customer',
        createdAt: '2026-02-15T00:00:00Z'
      }
    ],
    blogs: INITIAL_BLOGS,
    reviews: INITIAL_REVIEWS,
    inventoryLocks: []
  };
}

// Global in-memory cache to ensure serverless state persistence during runtime
let memoryDb: DatabaseSchema | null = null;

export function getDb(): DatabaseSchema {
  if (memoryDb) {
    cleanExpiredLocks(memoryDb);
    return memoryDb;
  }

  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const content = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      memoryDb = JSON.parse(content);
    } else {
      memoryDb = getInitialData();
      saveDb(memoryDb);
    }
  } catch (err) {
    console.error('Error loading DB file, fallback to memory', err);
    memoryDb = getInitialData();
  }

  if (!memoryDb) {
    memoryDb = getInitialData();
  }

  cleanExpiredLocks(memoryDb);
  return memoryDb;
}

export function saveDb(data: DatabaseSchema): void {
  memoryDb = data;
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB file:', err);
  }
}

// Clean locks older than current time
export function cleanExpiredLocks(db: DatabaseSchema): void {
  const now = Date.now();
  let changed = false;
  db.inventoryLocks = db.inventoryLocks.filter(lock => {
    if (lock.status === 'active' && lock.expiresAt < now) {
      changed = true;
      return false; // Remove expired lock
    }
    return true;
  });
  if (changed) {
    saveDb(db);
  }
}

// Calculate effective available stock (total stock minus active locks)
export function getAvailableStock(productId: string, currentSessionId?: string): number {
  const db = getDb();
  const product = db.products.find(p => p.id === productId);
  if (!product) return 0;

  const now = Date.now();
  const activeLockedQty = db.inventoryLocks
    .filter(l => l.productId === productId && l.status === 'active' && l.expiresAt >= now && l.sessionId !== currentSessionId)
    .reduce((sum, l) => sum + l.quantity, 0);

  return Math.max(0, product.stock - activeLockedQty);
}
