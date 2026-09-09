'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Product, PromoCode } from './types';
import { PROMO_CODES } from './mock-data';
import { useAuth } from './auth-context';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  promoCode: PromoCode | null;
  promoError: string | null;
  appliedCodeName: string;
  isLocking: boolean;
  lockRemainingSeconds: number;
  lockExpiresAt: number | null;
  lockError: string | null;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  startCheckoutLock: () => Promise<boolean>;
  releaseCheckoutLock: () => Promise<void>;
  refreshCartProducts: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_CART_KEY = 'aquavibe_guest_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, sessionId } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCodeName, setAppliedCodeName] = useState<string>('');
  const [promoCode, setPromoCode] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Inventory Locking state (10 mins)
  const [isLocking, setIsLocking] = useState<boolean>(false);
  const [lockExpiresAt, setLockExpiresAt] = useState<number | null>(null);
  const [lockRemainingSeconds, setLockRemainingSeconds] = useState<number>(0);
  const [lockError, setLockError] = useState<string | null>(null);

  // 1. Initial cart load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(GUEST_CART_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setItems(parsed);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // 2. Fetch full product details for cart items
  const refreshCartProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && data.products) {
        setItems(prev => prev.map(item => {
          const matched = data.products.find((p: Product) => p.id === item.productId);
          return matched ? { ...item, product: matched } : item;
        }));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (items.length > 0 && !items[0].product) {
      refreshCartProducts();
    }
  }, [items, refreshCartProducts]);

  // Save cart to local storage whenever items change
  useEffect(() => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  }, [items]);

  // 3. Cart Merge logic when user logs in
  useEffect(() => {
    if (user && items.length > 0) {
      // Trigger Cart Merge API
      const userKey = `aquavibe_user_cart_${user.id}`;
      const savedUserCart = localStorage.getItem(userKey);
      const userItems = savedUserCart ? JSON.parse(savedUserCart) : [];

      fetch('/api/cart/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ localItems: items, userItems })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.cart) {
          setItems(data.cart);
          localStorage.setItem(userKey, JSON.stringify(data.cart));
          refreshCartProducts();
        }
      })
      .catch(console.error);
    }
  }, [user]);

  // 4. Timer interval for 10-minute Inventory Locking countdown
  useEffect(() => {
    if (!lockExpiresAt) {
      setLockRemainingSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((lockExpiresAt - Date.now()) / 1000));
      setLockRemainingSeconds(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        setLockExpiresAt(null);
        setIsLocking(false);
        setLockError('Thời gian giữ chỗ tồn kho (10 phút) đã hết hạn. Vui lòng thử thanh toán lại!');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockExpiresAt]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) {
        return prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + quantity, product } : i);
      }
      return [...prev, { productId: product.id, quantity, product }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity } : i));
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode(null);
    setAppliedCodeName('');
    setLockExpiresAt(null);
    setIsLocking(false);
    localStorage.removeItem(GUEST_CART_KEY);
  };

  const applyPromoCode = (code: string): boolean => {
    setPromoError(null);
    const upper = code.trim().toUpperCase();
    const found = PROMO_CODES.find(p => p.code === upper);

    if (!found) {
      setPromoError('Mã khuyến mãi không hợp lệ.');
      return false;
    }

    const currentSubtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
    if (currentSubtotal < found.minOrder) {
      setPromoError(`Đơn hàng tối thiểu cần đạt ${new Intl.NumberFormat('vi-VN').format(found.minOrder)}đ để áp dụng mã này.`);
      return false;
    }

    setPromoCode(found);
    setAppliedCodeName(found.code);
    return true;
  };

  const removePromoCode = () => {
    setPromoCode(null);
    setAppliedCodeName('');
    setPromoError(null);
  };

  // Start 10-minute Inventory Lock when entering checkout
  const startCheckoutLock = async (): Promise<boolean> => {
    if (items.length === 0) return false;
    setIsLocking(true);
    setLockError(null);

    try {
      const res = await fetch('/api/inventory-lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
          userId: user?.id
        })
      });

      const data = await res.json();
      if (!data.success) {
        setLockError(data.message || 'Không thể giữ chỗ sản phẩm.');
        setIsLocking(false);
        return false;
      }

      setLockExpiresAt(data.expiresAt);
      setLockRemainingSeconds(600); // 10 mins
      return true;
    } catch (e) {
      setLockError('Lỗi kết nối máy chủ khóa tồn kho.');
      setIsLocking(false);
      return false;
    }
  };

  const releaseCheckoutLock = async () => {
    try {
      await fetch(`/api/inventory-lock?sessionId=${sessionId}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
    setLockExpiresAt(null);
    setIsLocking(false);
  };

  // Calculations
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);

  let discount = 0;
  if (promoCode) {
    const rawDiscount = (subtotal * promoCode.discountPercent) / 100;
    discount = promoCode.maxDiscount ? Math.min(rawDiscount, promoCode.maxDiscount) : rawDiscount;
  }

  // Specialized fish oxygen delivery fee calculation
  const shippingFee = subtotal > 0 ? (subtotal > 2000000 ? 0 : 35000) : 0;
  const total = Math.max(0, subtotal - discount + shippingFee);

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      subtotal,
      discount,
      shippingFee,
      total,
      promoCode,
      promoError,
      appliedCodeName,
      isLocking,
      lockRemainingSeconds,
      lockExpiresAt,
      lockError,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyPromoCode,
      removePromoCode,
      startCheckoutLock,
      releaseCheckoutLock,
      refreshCartProducts
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
