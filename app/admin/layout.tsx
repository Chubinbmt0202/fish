'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { 
  ShieldCheck, 
  Layers, 
  ShoppingBag, 
  Package, 
  MessageSquare, 
  Users, 
  BookOpen, 
  ArrowLeft,
  Fish
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role } = useAuth();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800">
      
      {/* Admin Topbar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3 sticky top-0 z-30 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              Hệ Thống Quản Trị AquaVibe
              <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-100 text-cyan-800 font-extrabold border border-cyan-300">
                ADMIN PORTAL
              </span>
            </h1>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-teal-700 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Xem Cửa Hàng (Client)
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
