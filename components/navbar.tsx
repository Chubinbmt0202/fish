'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { 
  Fish, 
  ShoppingBag, 
  Search, 
  User as UserIcon, 
  ShieldCheck, 
  Clock, 
  Menu, 
  X, 
  Layers, 
  BookOpen, 
  Sparkles,
  ChevronDown,
  LogOut,
  Package
} from 'lucide-react';
import { formatVND } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount, subtotal, lockRemainingSeconds, isLocking } = useCart();
  const { user, role, switchRole, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isAdmin = role === 'admin';
  const minutes = Math.floor(lockRemainingSeconds / 60);
  const seconds = lockRemainingSeconds % 60;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner: Oxygen Guarantee & Role Quick Switcher */}
      <div className="bg-gradient-to-r from-teal-50 via-cyan-50 to-emerald-50 px-4 py-1.5 border-b border-teal-100/80 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-teal-800 font-semibold">
            <span className="inline-block w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Cam kết đóng gói Oxy y tế 99.5% &mdash; Bảo hành sống 100% khi nhận hàng</span>
          </div>

          {/* Quick Actor Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 hidden sm:inline text-[11px] font-medium">Chế độ xem:</span>
            <div className="flex bg-white/80 rounded-lg p-0.5 border border-slate-200 shadow-xs text-[11px]">
              <button 
                onClick={() => switchRole('guest')}
                className={`px-2.5 py-0.5 rounded transition-colors ${role === 'guest' ? 'bg-slate-800 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Khách Vãng Lai
              </button>
              <button 
                onClick={() => switchRole('customer')}
                className={`px-2.5 py-0.5 rounded transition-colors ${role === 'customer' ? 'bg-teal-600 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Khách Đã Đăng Nhập
              </button>
              <button 
                onClick={() => switchRole('admin')}
                className={`px-2.5 py-0.5 rounded transition-colors ${role === 'admin' ? 'bg-cyan-600 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Admin Quản Trị
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Fish className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-teal-700 via-cyan-600 to-teal-800 bg-clip-text text-transparent">
                AquaVibe
              </span>
              <span className="block text-[10px] text-teal-600 font-bold tracking-wider uppercase -mt-1">
                Thủy Cung Xanh & Cá Cảnh
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold">
            <Link 
              href="/products" 
              className={`transition-colors hover:text-teal-600 ${pathname === '/products' ? 'text-teal-600 font-bold' : 'text-slate-700'}`}
            >
              Cửa Hàng Thủy Sinh
            </Link>
            <Link 
              href="/products?waterType=freshwater" 
              className="text-slate-700 hover:text-teal-600 transition-colors"
            >
              Cá Nước Ngọt
            </Link>
            <Link 
              href="/products?waterType=saltwater" 
              className="text-slate-700 hover:text-cyan-600 transition-colors"
            >
              Cá Nước Mặn (San Hô)
            </Link>
            <Link 
              href="/blog" 
              className={`transition-colors hover:text-teal-600 ${pathname.startsWith('/blog') ? 'text-teal-600 font-bold' : 'text-slate-700'}`}
            >
              Cẩm Nang Nuôi Cá
            </Link>
            {isAdmin && (
              <Link 
                href="/admin" 
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 font-bold hover:bg-cyan-200 transition-all text-xs border border-cyan-300"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Vào Admin Portal
              </Link>
            )}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            
            {/* Active Lock Indicator */}
            {isLocking && lockRemainingSeconds > 0 && (
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold animate-pulse">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Giữ kho: {minutes}:{seconds.toString().padStart(2, '0')}</span>
              </div>
            )}

            {/* Cart Icon with Live Count */}
            <Link 
              href="/cart"
              className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-teal-50 border border-slate-200 text-slate-700 hover:text-teal-600 transition-all group"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-xs flex items-center justify-center shadow-md animate-bounce">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Account */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-teal-700">
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs hidden sm:inline font-semibold max-w-[100px] truncate text-slate-800">
                  {user ? user.name : 'Tài khoản'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:inline" />
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 glass-dropdown rounded-2xl shadow-xl p-2 z-50 border border-slate-200 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  {user ? (
                    <>
                      <div className="px-3 py-2 border-b border-slate-100 mb-1 bg-slate-50 rounded-xl">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-teal-600 truncate font-medium">{user.email}</p>
                        <span className="inline-block px-1.5 py-0.5 mt-1 text-[10px] rounded bg-teal-100 text-teal-800 uppercase font-extrabold">
                          {user.role}
                        </span>
                      </div>
                      <Link href="/account/orders" className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:text-teal-700 hover:bg-teal-50 rounded-lg">
                        <Package className="w-3.5 h-3.5 text-teal-600" />
                        Đơn hàng của tôi
                      </Link>
                      {isAdmin && (
                        <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-cyan-700 hover:bg-cyan-50 rounded-lg">
                          <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                          Trang Quản Trị (Admin)
                        </Link>
                      )}
                      <button 
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-3 py-2 text-xs text-slate-500 border-b border-slate-100 mb-1">
                        Chào bạn! Đăng nhập để lưu đơn hàng và gộp giỏ.
                      </div>
                      <Link href="/account/login" className="block px-3 py-2 text-xs text-teal-700 font-bold hover:bg-teal-50 rounded-lg">
                        Đăng Nhập
                      </Link>
                      <Link href="/account/register" className="block px-3 py-2 text-xs text-slate-700 font-medium hover:bg-slate-100 rounded-lg">
                        Đăng Ký Tài Khoản
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-slate-700 hover:text-teal-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3 shadow-lg">
          <Link 
            href="/products" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-800 hover:text-teal-600 font-bold py-1"
          >
            Tất Cả Sản Phẩm
          </Link>
          <Link 
            href="/products?waterType=freshwater" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-700 hover:text-teal-600 py-1 font-medium"
          >
            Cá Cảnh Nước Ngọt
          </Link>
          <Link 
            href="/products?waterType=saltwater" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-700 hover:text-cyan-600 py-1 font-medium"
          >
            Cá Nước Mặn San Hô
          </Link>
          <Link 
            href="/blog" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-700 hover:text-teal-600 py-1 font-medium"
          >
            Cẩm Nang Thủy Sinh
          </Link>
          <Link 
            href="/account/orders" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-teal-700 font-bold py-1"
          >
            Theo Dõi Đơn Hàng
          </Link>
          {isAdmin && (
            <Link 
              href="/admin" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-cyan-700 font-extrabold py-1"
            >
              Bảng Quản Trị Admin
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
