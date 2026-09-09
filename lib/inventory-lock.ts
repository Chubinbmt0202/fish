import { getDb, saveDb, cleanExpiredLocks } from './db';
import { InventoryLock } from './types';

const LOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export interface LockResult {
  success: boolean;
  message?: string;
  locks?: InventoryLock[];
  expiresAt?: number;
}

/**
 * Tạm khóa tồn kho 10 phút cho danh sách sản phẩm trong phiên checkout
 */
export function lockInventoryForCheckout(
  sessionId: string,
  items: { productId: string; quantity: number }[],
  userId?: string
): LockResult {
  const db = getDb();
  cleanExpiredLocks(db);

  const now = Date.now();
  const expiresAt = now + LOCK_DURATION_MS;

  // Release any previous active locks for this session first
  db.inventoryLocks = db.inventoryLocks.filter(l => l.sessionId !== sessionId || l.status !== 'active');

  const newLocks: InventoryLock[] = [];

  // Verify stock availability for all items before applying locks
  for (const item of items) {
    const product = db.products.find(p => p.id === item.productId);
    if (!product) {
      return { success: false, message: `Sản phẩm ${item.productId} không tồn tại` };
    }

    // Active locks held by OTHER sessions
    const otherLockedQty = db.inventoryLocks
      .filter(l => l.productId === item.productId && l.status === 'active' && l.expiresAt >= now && l.sessionId !== sessionId)
      .reduce((sum, l) => sum + l.quantity, 0);

    const availableStock = product.stock - otherLockedQty;
    if (availableStock < item.quantity) {
      return {
        success: false,
        message: `Sản phẩm "${product.name}" chỉ còn ${availableStock} con/sản phẩm khả dụng (đang có người giữ chỗ).`
      };
    }

    const lock: InventoryLock = {
      id: `lock-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      productId: item.productId,
      sessionId,
      userId,
      quantity: item.quantity,
      createdAt: now,
      expiresAt,
      status: 'active'
    };
    newLocks.push(lock);
  }

  db.inventoryLocks.push(...newLocks);
  saveDb(db);

  return {
    success: true,
    locks: newLocks,
    expiresAt
  };
}

/**
 * Giải phóng tạm khóa thủ công (khi khách hủy hoặc quay lại giỏ)
 */
export function releaseInventoryLock(sessionId: string): boolean {
  const db = getDb();
  let changed = false;
  db.inventoryLocks = db.inventoryLocks.map(lock => {
    if (lock.sessionId === sessionId && lock.status === 'active') {
      changed = true;
      return { ...lock, status: 'released' as const };
    }
    return lock;
  });

  if (changed) {
    saveDb(db);
  }
  return changed;
}

/**
 * Khấu trừ tồn kho chính thức và hoàn tất lock khi đặt hàng thành công
 */
export function commitInventoryAndDeductStock(
  sessionId: string,
  items: { productId: string; quantity: number }[]
): { success: boolean; message?: string } {
  const db = getDb();
  cleanExpiredLocks(db);

  // Check product stock and deduct
  for (const item of items) {
    const product = db.products.find(p => p.id === item.productId);
    if (!product) {
      return { success: false, message: `Sản phẩm ${item.productId} không tồn tại` };
    }
    if (product.stock < item.quantity) {
      return { success: false, message: `Số lượng tồn kho "${product.name}" không đủ để hoàn tất đơn hàng` };
    }
  }

  // Deduct actual stock
  for (const item of items) {
    const product = db.products.find(p => p.id === item.productId)!;
    product.stock -= item.quantity;
  }

  // Mark session locks as committed
  db.inventoryLocks = db.inventoryLocks.map(l => {
    if (l.sessionId === sessionId && l.status === 'active') {
      return { ...l, status: 'committed' as const };
    }
    return l;
  });

  saveDb(db);
  return { success: true };
}

/**
 * Lấy thời gian còn lại của lock theo sessionId
 */
export function getSessionLockStatus(sessionId: string): { hasLock: boolean; remainingSeconds: number; expiresAt?: number } {
  const db = getDb();
  cleanExpiredLocks(db);

  const now = Date.now();
  const activeLock = db.inventoryLocks.find(l => l.sessionId === sessionId && l.status === 'active' && l.expiresAt > now);

  if (!activeLock) {
    return { hasLock: false, remainingSeconds: 0 };
  }

  const remainingSeconds = Math.max(0, Math.floor((activeLock.expiresAt - now) / 1000));
  return {
    hasLock: true,
    remainingSeconds,
    expiresAt: activeLock.expiresAt
  };
}
