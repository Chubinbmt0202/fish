'use client';

import React from 'react';
import { Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function InventoryTimer() {
  const { isLocking, lockRemainingSeconds, lockExpiresAt } = useCart();

  if (!isLocking || !lockExpiresAt) return null;

  const minutes = Math.floor(lockRemainingSeconds / 60);
  const seconds = lockRemainingSeconds % 60;
  const isUrgent = lockRemainingSeconds < 120;

  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      isUrgent
        ? 'bg-rose-50 border-rose-300 shadow-md animate-pulse'
        : 'bg-teal-50/80 border-teal-200 shadow-sm'
    }`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isUrgent ? 'bg-rose-100 text-rose-700' : 'bg-teal-100 text-teal-700'
          }`}>
            {isUrgent ? <ShieldAlert className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
          </div>
          <div>
            <h4 className={`text-sm font-bold ${isUrgent ? 'text-rose-900' : 'text-teal-900'}`}>
              Đang tạm khóa giữ tồn kho cho bạn
            </h4>
            <p className="text-xs text-slate-600">
              {isUrgent 
                ? 'Sắp hết thời gian giữ chỗ! Vui lòng hoàn tất đơn để không bị hủy khóa.' 
                : 'Cá và phụ kiện được đảm bảo số lượng trong 10 phút, tránh bị khách khác mua tranh.'}
            </p>
          </div>
        </div>

        {/* Big Countdown Display */}
        <div className="text-right shrink-0">
          <div className={`text-2xl font-black font-mono tracking-wider ${
            isUrgent ? 'text-rose-600' : 'text-teal-700'
          }`}>
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </div>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Thời gian còn lại</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 rounded-full ${
            isUrgent ? 'bg-rose-500' : 'bg-gradient-to-r from-teal-500 to-cyan-500'
          }`}
          style={{ width: `${Math.min(100, (lockRemainingSeconds / 600) * 100)}%` }}
        />
      </div>
    </div>
  );
}
