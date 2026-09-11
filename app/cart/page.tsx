'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { formatVND, getWaterTypeLabel } from '@/lib/utils';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  Tag, 
  Droplets, 
  ShieldCheck, 
  Clock, 
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    itemCount,
    subtotal,
    discount,
    shippingFee,
    total,
    promoCode,
    promoError,
    appliedCodeName,
    updateQuantity,
    removeFromCart,
    applyPromoCode,
    removePromoCode,
    startCheckoutLock,
    isLocking,
    lockError
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    applyPromoCode(inputCode);
  };

  const handleProceedToCheckout = async () => {
    setCheckingOut(true);
    const locked = await startCheckoutLock();
    setCheckingOut(false);
    if (locked) {
      router.push('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-20 h-20 rounded-3xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Giỏ hàng của bạn đang trống</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Hãy dạo quanh cửa hàng và chọn những chú cá cảnh khỏe đẹp hoặc cây thủy sinh ưng ý nhé!
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-xs shadow-md shadow-teal-500/20 hover:brightness-105 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Khám Phá Sản Phẩm Ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-teal-600" /> Giỏ Hàng Thủy Sinh ({itemCount} món)
          </h1>
          <p className="text-xs text-slate-500 mt-1">Giỏ hàng được tự động lưu và đồng bộ khi bạn đăng nhập tài khoản.</p>
        </div>
        <Link href="/products" className="text-xs text-teal-700 hover:text-teal-800 flex items-center gap-1 font-bold">
          <ArrowLeft className="w-3.5 h-3.5" /> Tiếp tục chọn cá
        </Link>
      </div>

      {lockError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{lockError}</span>
        </div>
      )}

      {/* Main Cart Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const prod = item.product;
            if (!prod) return null;
            const water = getWaterTypeLabel(prod.waterType);

            return (
              <div
                key={item.productId}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Image & Title */}
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                  />
                  <div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      prod.waterType === 'freshwater'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-cyan-50 text-cyan-800 border-cyan-300'
                    }`}>
                      {water.label}
                    </span>
                    <Link href={`/products/${prod.id}`} className="block font-bold text-sm text-slate-900 hover:text-teal-600 mt-1">
                      {prod.name}
                    </Link>
                    <div className="text-xs text-teal-700 font-mono font-bold mt-0.5">
                      {formatVND(prod.price)}
                    </div>
                  </div>
                </div>

                {/* Quantity Control & Actions */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-7 h-7 rounded flex items-center justify-center text-slate-700 hover:bg-slate-200 font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-slate-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-7 h-7 rounded flex items-center justify-center text-slate-700 hover:bg-slate-200 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900 font-mono block">
                      {formatVND(prod.price * item.quantity)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Xóa khỏi giỏ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}

          {/* Guarantee Highlight */}
          <div className="p-4 rounded-xl bg-teal-50/80 border border-teal-200 flex items-center gap-3 text-xs text-slate-700 font-medium">
            <Droplets className="w-5 h-5 text-teal-600 shrink-0" />
            <span>Mỗi con cá được kiểm tra thể trạng và đóng túi sục khí Oxy nguyên chất 99.5% trước khi xuất trại.</span>
          </div>
        </div>

        {/* Order Summary & Checkout Action */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
              Tổng Quan Đơn Hàng
            </h3>

            {/* Promo Code Input */}
            <div>
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Mã giảm giá (ví dụ: GUPPY10)"
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white uppercase font-bold"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-bold text-xs hover:bg-teal-100 transition-colors"
                >
                  Áp dụng
                </button>
              </form>

              {promoError && (
                <p className="text-[11px] text-rose-600 mt-1.5 font-medium">{promoError}</p>
              )}

              {promoCode && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-teal-50 border border-teal-200 text-xs text-teal-800 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-teal-600" />
                    <span className="font-black">{promoCode.code}</span>
                    <span className="font-bold">(-{promoCode.discountPercent}%)</span>
                  </div>
                  <button onClick={removePromoCode} className="text-slate-400 hover:text-rose-600 font-bold">✕</button>
                </div>
              )}
            </div>

            {/* Quick Available Promo Badges */}
            <div className="text-[11px] text-slate-500 space-y-1">
              <span className="block font-semibold text-slate-700">Mã có sẵn cho bạn:</span>
              <div className="flex flex-wrap gap-1.5">
                {['GUPPY10', 'FREESHIP', 'VIPAQUA'].map((code) => (
                  <button
                    key={code}
                    onClick={() => {
                      setInputCode(code);
                      applyPromoCode(code);
                    }}
                    className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-teal-800 hover:border-teal-400 font-mono font-bold"
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculation Lines */}
            <div className="space-y-2.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Tạm tính tiền hàng:</span>
                <span className="font-bold text-slate-900 font-mono">{formatVND(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-teal-700 font-bold">
                  <span>Khuyến mãi giảm giá:</span>
                  <span className="font-mono">-{formatVND(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Phí đóng gói thùng Oxy:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {shippingFee === 0 ? <span className="text-teal-700 font-bold">Miễn phí</span> : formatVND(shippingFee)}
                </span>
              </div>

              <div className="flex justify-between text-sm font-black text-slate-900 pt-3 border-t border-slate-100">
                <span>Tổng thanh toán:</span>
                <span className="text-teal-800 font-mono text-base font-black">{formatVND(total)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleProceedToCheckout}
                disabled={isLocking || checkingOut}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-teal-500/20 hover:brightness-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {checkingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Đang giữ chỗ tồn kho...
                  </>
                ) : (
                  <>
                    <span>Tiến Hành Đặt Hàng (Khóa Kho 10 Phút)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1 font-medium">
                <Clock className="w-3 h-3 text-teal-600" /> Hệ thống sẽ tạm khóa số lượng cá trong 10 phút để thanh toán
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
