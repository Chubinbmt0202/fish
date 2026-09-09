'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Fish, Lock, Mail, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    const success = await login(email.trim());
    setLoading(false);

    if (success) {
      router.push('/products');
    } else {
      setError('Đăng nhập không thành công. Vui lòng kiểm tra email.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 border border-teal-200 flex items-center justify-center mx-auto shadow-sm">
          <Fish className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">Đăng Nhập Tài Khoản</h1>
        <p className="text-xs text-slate-500">
          Quản lý đơn hàng và tự động đồng bộ giỏ hàng khách vãng lai
        </p>
      </div>

      {/* Cart Merge Callout Banner */}
      <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 flex items-start gap-2.5 text-xs text-teal-900 shadow-xs font-medium">
        <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <span>
          <strong className="font-bold">Tính năng Cart Merge:</strong> Toàn bộ sản phẩm bạn đã chọn khi xem trang sẽ được tự động gộp vào tài khoản ngay khi đăng nhập.
        </span>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Email của bạn</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hung.nguyen@example.com hoặc admin@aquavibe.vn"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white font-medium"
            />
          </div>
        </div>

        {/* Quick Demo Logins */}
        <div className="pt-2 text-[11px] text-slate-500 space-y-1.5">
          <span className="font-semibold text-slate-700">Tài khoản demo thử nghiệm:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setEmail('hung.nguyen@example.com')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-teal-800 font-bold hover:border-teal-400"
            >
              Khách hàng (Nguyễn Văn Hùng)
            </button>
            <button
              type="button"
              onClick={() => setEmail('admin@aquavibe.vn')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-cyan-800 font-bold hover:border-cyan-400"
            >
              Quản trị viên (Admin)
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-xs shadow-md shadow-teal-500/20 hover:brightness-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
        >
          {loading ? 'Đang xác thực...' : 'Đăng Nhập Ngay'}
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
          Chưa có tài khoản?{' '}
          <Link href="/account/register" className="text-teal-700 font-bold hover:underline">
            Đăng ký tại đây
          </Link>
        </div>
      </form>

    </div>
  );
}
