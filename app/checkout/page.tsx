'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { formatVND } from '@/lib/utils';
import InventoryTimer from '@/components/inventory-timer';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Banknote, 
  ArrowLeft, 
  Lock, 
  Droplets, 
  CheckCircle2, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, sessionId } = useAuth();
  const {
    items,
    subtotal,
    discount,
    shippingFee,
    total,
    promoCode,
    clearCart,
    isLocking,
    lockRemainingSeconds,
    lockExpiresAt
  } = useCart();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState('Hồ Chí Minh');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'banking'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0 && !orderSuccess) {
      router.push('/cart');
    }
  }, [items, orderSuccess, router]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !address) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin giao hàng bắt buộc.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const orderPayload = {
        sessionId,
        customerName,
        email: email || 'guest@aquavibe.vn',
        phone,
        address,
        city,
        note,
        items: items.map(i => ({
          productId: i.productId,
          name: i.product?.name || 'Sản phẩm thủy sinh',
          price: i.product?.price || 0,
          image: i.product?.image || '',
          quantity: i.quantity,
          waterType: i.product?.waterType
        })),
        subtotal,
        discount,
        shippingFee,
        total,
        paymentMethod,
        promoCode: promoCode?.code,
        userId: user?.id
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (!data.success) {
        setErrorMsg(data.message || 'Lỗi đặt hàng.');
        setIsSubmitting(false);
        return;
      }

      // Success! Clear cart and show order confirmation
      clearCart();
      setOrderSuccess(data.order);
    } catch (e) {
      setErrorMsg('Lỗi kết nối máy chủ đặt hàng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-teal-100 text-teal-700 border border-teal-300 flex items-center justify-center mx-auto animate-bounce shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-extrabold uppercase tracking-wider border border-teal-200">
            Đặt Hàng Thành Công!
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Mã Đơn Hàng: <span className="text-teal-700 font-mono">{orderSuccess.orderNumber}</span>
          </h1>
          <p className="text-xs text-slate-600 max-w-lg mx-auto mt-2 leading-relaxed font-medium">
            Hệ thống đã tự động khấu trừ tồn kho và tiếp nhận đơn hàng. Bộ phận kỹ thuật đang chuẩn bị quy trình 
            <strong> sục khí Oxy y tế 99.5%</strong> và đóng thùng xốp giữ nhiệt.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-left space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">Người nhận:</span>
            <span className="font-bold text-slate-900">{orderSuccess.customerName} ({orderSuccess.phone})</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">Địa chỉ giao:</span>
            <span className="text-slate-800 text-right font-medium">{orderSuccess.address}, {orderSuccess.city}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">Phương thức thanh toán:</span>
            <span className="text-teal-700 font-bold uppercase">{orderSuccess.paymentMethod}</span>
          </div>

          <div className="flex justify-between items-center text-sm font-bold text-slate-900 pt-1">
            <span>Tổng số tiền:</span>
            <span className="text-teal-800 font-mono text-base font-black">{formatVND(orderSuccess.total)}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/account/orders"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-xs shadow-md shadow-teal-500/20 hover:brightness-105 transition-all flex items-center gap-2"
          >
            <Truck className="w-4 h-4" /> Theo Dõi Tiến Trình Đóng Oxy
          </Link>

          <Link
            href="/products"
            className="px-6 py-3 rounded-xl bg-white text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-bold shadow-xs"
          >
            Tiếp tục mua hàng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-teal-600" /> Thanh Toán & Xác Nhận Đơn Hàng
          </h1>
          <p className="text-xs text-slate-500 mt-1">Thông tin được bảo mật và số lượng hàng được khóa giữ chỗ an toàn.</p>
        </div>
        <Link href="/cart" className="text-xs text-teal-700 hover:text-teal-800 flex items-center gap-1 font-bold">
          <ArrowLeft className="w-3.5 h-3.5" /> Quay lại giỏ hàng
        </Link>
      </div>

      {/* 1. Inventory Timer Component */}
      <InventoryTimer />

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Checkout Form & Order Review */}
      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Delivery & Payment Details */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Shipping Address Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Truck className="w-4 h-4 text-teal-600" /> Thông Tin Nhận Hàng (Giao Sống Tận Nơi)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên người nhận *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Hùng"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ví dụ: 0908123456"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email nhận thông báo đơn</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tỉnh / Thành phố</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-medium"
                >
                  <option value="Hồ Chí Minh">TP. Hồ Chí Minh (Giao 2h)</option>
                  <option value="Hà Nội">Hà Nội (Hỏa tốc bay 12h)</option>
                  <option value="Đà Nẵng">Đà Nẵng (Hỏa tốc bay 12h)</option>
                  <option value="Cần Thơ">Cần Thơ (Giao xe lạnh)</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Khác">Tỉnh thành khác (Toàn quốc)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Địa chỉ chi tiết (Số nhà, đường, phường/xã) *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ví dụ: 124 Nguyễn Thị Minh Khai, Phường 6, Quận 3"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú cho bộ phận đóng gói cá</label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: Bọc thêm mút giữ nhiệt, giao giờ hành chính..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <CreditCard className="w-4 h-4 text-teal-600" /> Phương Thức Thanh Toán
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  paymentMethod === 'cod'
                    ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Banknote className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Thanh toán COD</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Thanh toán tiền mặt khi kiểm tra và nhận cá sống tận nơi.</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('banking')}
                className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  paymentMethod === 'banking'
                    ? 'bg-cyan-50 border-cyan-500 text-cyan-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <CreditCard className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Chuyển khoản VietQR</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Quét mã QR ngân hàng tự động xác nhận trong 30 giây.</p>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Order Review */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
              Kiểm Tra Đơn Hàng ({items.length} mặt hàng)
            </h3>

            {/* Items List Mini */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((i) => (
                <div key={i.productId} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 truncate">
                    <img
                      src={i.product?.image}
                      alt={i.product?.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                    />
                    <div className="truncate">
                      <p className="font-bold text-slate-900 truncate">{i.product?.name}</p>
                      <span className="text-[11px] text-slate-500">SL: {i.quantity} x {formatVND(i.product?.price || 0)}</span>
                    </div>
                  </div>
                  <span className="font-bold text-teal-800 font-mono shrink-0">
                    {formatVND((i.product?.price || 0) * i.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Tiền hàng:</span>
                <span className="font-mono font-bold text-slate-900">{formatVND(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-teal-700 font-bold">
                  <span>Giảm giá:</span>
                  <span className="font-mono font-bold">-{formatVND(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Phí đóng gói Oxy 99.5%:</span>
                <span className="font-mono font-bold text-slate-900">
                  {shippingFee === 0 ? <span className="text-teal-700 font-bold">Miễn phí</span> : formatVND(shippingFee)}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-100">
                <span>Tổng cộng:</span>
                <span className="text-teal-800 font-mono text-lg font-black">{formatVND(total)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-extrabold text-sm shadow-md shadow-teal-500/20 hover:brightness-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Đang tạo đơn và trừ tồn kho...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" /> Xác Nhận Đặt Hàng Ngay
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-slate-500">
              Nhấn đặt hàng đồng nghĩa bạn đồng ý với chính sách bảo hành cá sống 100% của GuppyVibe.
            </p>

          </div>
        </div>

      </form>

    </div>
  );
}
