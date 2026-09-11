import React from 'react';
import Link from 'next/link';
import { Fish, ShieldCheck, Truck, Droplets, Phone, Mail, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200/90 pt-12 pb-8 text-slate-600 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 3 Core Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-200">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-teal-50/50 border border-teal-100">
            <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 shrink-0">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Đóng Gói Bơm Oxy 99.5%</h4>
              <p className="text-xs text-slate-600">Túi nilon y tế kép, nén oxy nguyên chất kèm dung dịch khoáng vi lượng chống stress cho cá.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-cyan-50/50 border border-cyan-100">
            <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-700 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Giao Sống 100% Toàn Quốc</h4>
              <p className="text-xs text-slate-600">Vận chuyển hỏa tốc bằng thùng xốp giữ nhiệt. Hoàn tiền hoặc gửi bù cá mới nếu có rủi ro.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Dưỡng Khỏe & Chuẩn Gen</h4>
              <p className="text-xs text-slate-600">100% cá cảnh được kiểm dịch, thuần hóa ăn cám và dưỡng nước ổn định trước khi xuất hồ.</p>
            </div>
          </div>
        </div>

        {/* Footer Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
                <Fish className="w-5 h-5" />
              </div>
              <span className="text-lg font-extrabold text-slate-900">GuppyVibe Vietnam</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Trại cá 7 màu thuần chủng và phụ kiện Guppy chuyên nghiệp hàng đầu Việt Nam. Cung cấp các dòng cá Full Red, Full Gold, Koi Red Ear, Blue Topaz, lồng ép đẻ và thức ăn artemia cao cấp.
            </p>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold mb-3 text-xs uppercase tracking-wider">Dòng Cá 7 Màu (Guppy)</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><Link href="/products?search=Full%20Red" className="hover:text-teal-600 transition-colors">Dòng Albino Full Red (AFR)</Link></li>
              <li><Link href="/products?search=Full%20Gold" className="hover:text-teal-600 transition-colors">Dòng Full Gold 24K Ribbon</Link></li>
              <li><Link href="/products?search=Koi" className="hover:text-teal-600 transition-colors">Dòng Albino Koi Red Ear</Link></li>
              <li><Link href="/products?search=Dumbo" className="hover:text-teal-600 transition-colors">Dòng Tai To Dumbo Red Tail</Link></li>
              <li><Link href="/products?category=accessories" className="hover:text-teal-600 transition-colors">Lồng Ép Đẻ & Thức Ăn Artemia</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold mb-3 text-xs uppercase tracking-wider">Kỹ Thuật & Cẩm Nang</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><Link href="/blog/cam-nang-nuoi-va-phoi-giong-ca-7-mau-guppy" className="hover:text-teal-600 transition-colors">Kỹ thuật dưỡng nước & ép đẻ Guppy</Link></li>
              <li><Link href="/blog/quy-trinh-dong-goi-oxy-ca-song-an-toan" className="hover:text-teal-600 transition-colors">Quy chuẩn sục Oxy đóng thùng xốp 48h</Link></li>
              <li><Link href="/account/orders" className="hover:text-teal-600 transition-colors">Kiểm tra tiến trình đơn hàng</Link></li>
              <li><Link href="/admin" className="text-cyan-700 hover:text-cyan-800 font-bold transition-colors">Cổng Quản Trị Trại Cá</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold mb-3 text-xs uppercase tracking-wider">Trại Giống & Cửa Hàng</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-teal-600 shrink-0" /> 124 Nguyễn Thị Minh Khai, Q.3, TP.HCM</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-teal-600 shrink-0" /> Hotline: 1900 6868 (8:00 - 21:00)</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-teal-600 shrink-0" /> contact@guppyvibe.vn</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 GuppyVibe - Trại Cá 7 Màu Thuần Chủng. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Dành trọn đam mê cho dòng cá 7 màu</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>

      </div>
    </footer>
  );
}
