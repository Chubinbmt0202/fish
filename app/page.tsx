import Link from 'next/link';
import { getDb, cleanExpiredLocks } from '@/lib/db';
import ProductCard from '@/components/product-card';
import { 
  Fish, 
  Sparkles, 
  Droplets, 
  ShieldCheck, 
  ArrowRight, 
  Compass, 
  CheckCircle2, 
  HeartHandshake, 
  Layers, 
  BookOpen,
  Clock
} from 'lucide-react';

export const revalidate = 0;

export default function HomePage() {
  const db = getDb();
  cleanExpiredLocks(db);

  const featuredProducts = db.products.filter(p => p.isFeatured).slice(0, 8);
  const blogs = db.blogs.slice(0, 2);

  return (
    <div className="space-y-16 pb-12">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-24 border-b border-slate-200/80 bg-gradient-to-b from-teal-50/40 via-white to-white">
        {/* Soft Ambient Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-teal-200/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-cyan-200/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Trại Cá 7 Màu Thuần Chủng Hàng Đầu Việt Nam</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                Thiên Đường Cá 7 Màu <br />
                <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                  Sắc Màu Lộng Lẫy & Chuẩn Gen F1
                </span>
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
                <strong>GuppyVibe</strong> chuyên tuyển chọn và nhân giống các dòng cá 7 màu (Guppy) thuần chủng đỉnh cao: 
                Full Red BDS cờ cao, Full Gold 24K Ribbon, Koi Red Ear, Blue Topaz, Rồng Đỏ... 
                Đặc biệt áp dụng công nghệ <strong>Bơm Oxy Y Tế 48H</strong> và <strong>Khóa Giữ Cá 10 Phút</strong> giúp bạn an tâm sở hữu cặp cá giống hoàn mỹ nhất.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/products?category=fish"
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-teal-500/25 hover:brightness-105 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Fish className="w-4 h-4" />
                  Xem Bộ Sưu Tập Guppy
                </Link>

                <Link
                  href="/blog/cam-nang-nuoi-va-phoi-giong-ca-7-mau-guppy"
                  className="px-6 py-3.5 rounded-2xl bg-white text-teal-800 hover:text-teal-900 border border-slate-200 hover:border-teal-300 text-sm font-bold shadow-xs transition-all flex items-center gap-2"
                >
                  <Droplets className="w-4 h-4 text-teal-600" />
                  Bí Quyết Ép Đẻ & Dưỡng Nước
                </Link>
              </div>

              {/* Mini Features List */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 text-left">
                <div>
                  <div className="text-lg font-black text-teal-700 font-mono">100%</div>
                  <div className="text-[11px] text-slate-500 font-medium">Bảo hành cá sống tận nơi</div>
                </div>
                <div>
                  <div className="text-lg font-black text-cyan-700 font-mono">10 Phút</div>
                  <div className="text-[11px] text-slate-500 font-medium">Khóa giữ cá đẹp độc quyền</div>
                </div>
                <div>
                  <div className="text-lg font-black text-emerald-700 font-mono">48 Tiếng</div>
                  <div className="text-[11px] text-slate-500 font-medium">Bơm oxy y tế bơi xa khỏe mạnh</div>
                </div>
              </div>

            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden bg-white p-2 border border-slate-200 shadow-xl group">
                <img
                  src="https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=1000&q=80"
                  alt="Cá 7 Màu Albino Full Red GuppyVibe"
                  className="w-full h-[380px] sm:h-[440px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent rounded-2xl flex flex-col justify-end p-6">
                  <span className="px-2.5 py-1 rounded-md bg-teal-500 text-white text-xs font-bold w-fit mb-2 shadow-sm">
                    Dòng Bán Chạy Nhất
                  </span>
                  <h3 className="text-xl font-black text-white">Albino Full Red (AFR BDS Cờ Cao)</h3>
                  <p className="text-xs text-slate-200 mt-1">Đỏ rực rỡ từ đầu đến vây, mắt đỏ ngọc Ruby, vây lưng bồng bềnh.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Category Quick Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Phân Loại Dòng Cá 7 Màu</h2>
            <p className="text-xs text-slate-500 mt-1">Lựa chọn theo màu sắc, kiểu dáng tai bơi và hoa văn vảy</p>
          </div>
          <Link href="/products" className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1">
            Xem tất cả dòng cá <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              title: 'Dòng Đơn Sắc (Solid Color)',
              desc: 'Full Red, Full Gold 24K, Blue Topaz, Full Black',
              href: '/products?search=Full',
              img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=500&q=80',
              tag: 'Được chuộng nhất'
            },
            {
              title: 'Dòng Cá Koi & Tai To (Dumbo)',
              desc: 'Koi Red Ear, Koi Short Body, Dumbo Red Tail',
              href: '/products?search=Koi',
              img: 'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=500&q=80',
              tag: 'Phong thủy tài lộc'
            },
            {
              title: 'Dòng Hoa Văn & Vảy Rồng',
              desc: 'Red Dragon, Blue Grass Nhật Bản, Mosaic',
              href: '/products?search=Dragon',
              img: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=500&q=80',
              tag: 'Cực kỳ tinh xảo'
            },
            {
              title: 'Lồng Ép Đẻ & Thức Ăn Artemia',
              desc: 'Lồng mica 2 tầng, Cám Inve 3/5, Muối khoáng',
              href: '/products?category=accessories',
              img: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=500&q=80',
              tag: 'Phụ kiện dưỡng cá'
            },
          ].map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 aspect-[4/3] p-4 flex flex-col justify-end hover:shadow-lg transition-all"
            >
              <img
                src={cat.img}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-70 group-hover:opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="relative z-10">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500 text-white">
                  {cat.tag}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white mt-1 group-hover:text-teal-300 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-[11px] text-slate-300 line-clamp-1">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-teal-600" /> Tuyển Chọn Đặc Sắc
            </div>
            <h2 className="text-2xl font-black text-slate-900">Cá 7 Màu Thuần Chủng Đang Bán Chạy</h2>
          </div>
          <Link
            href="/products"
            className="px-4 py-2 rounded-xl bg-white text-xs font-bold text-teal-700 hover:text-teal-800 border border-slate-200 hover:border-teal-300 transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
          >
            Duyệt toàn bộ kho Guppy ({db.products.length} sản phẩm)
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 4. Biological Assurances & Inventory Locking */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-teal-50/90 via-cyan-50/50 to-white rounded-3xl p-8 sm:p-12 border border-teal-200/80 shadow-sm relative overflow-hidden">
          
          <div className="max-w-3xl space-y-6">
            <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 border border-teal-300 text-xs font-extrabold uppercase tracking-wider">
              Tiêu Chuẩn Vận Hành Độc Quyền
            </span>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
              An Tâm Sở Hữu Cá 7 Màu Đẹp <br />
              <span className="text-teal-700">Khóa Tồn Kho 10 Phút & Đóng Oxy Y Tế 48H</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex items-start gap-3.5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Khóa Tồn Kho 10 Phút (Chọn Cá Chuẩn Gen)</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Với các cặp cá 7 màu tuyển chọn đuôi to cờ cao số lượng có hạn, hệ thống tự động khóa giữ chỗ trong 10 phút ngay khi bạn thanh toán, đảm bảo không bị người khác mua mất.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-700 shrink-0">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Sục Khí Oxy Y Tế 99.5% & Dưỡng Nước Muối</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Nước đóng túi được bổ sung muối khoáng biển và vi sinh giảm stress. Túi 2 lớp dày dặn chèn thùng xốp giữ nhiệt, đảm bảo cá 7 màu bơi khỏe 48 tiếng khi nhận hàng.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-colors shadow-md shadow-teal-600/20"
              >
                Đặt Mua Cặp Giống Ngay
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Knowledge / Blog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Cẩm Nang Kỹ Thuật Nuôi Cá 7 Màu</h2>
            <p className="text-xs text-slate-500 mt-1">Hướng dẫn setup hồ, dưỡng nước hơi kiềm, tách đẻ và bảo tồn gen giống</p>
          </div>
          <Link href="/blog" className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1">
            Xem tất cả bài viết <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((b) => (
            <Link
              key={b.id}
              href={`/blog/${b.slug}`}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200 flex flex-col sm:flex-row hover:shadow-lg transition-all"
            >
              <div className="sm:w-2/5 aspect-video sm:aspect-auto relative overflow-hidden bg-slate-100">
                <img
                  src={b.coverImage}
                  alt={b.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 sm:w-3/5 flex flex-col justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                    {b.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-2 group-hover:text-teal-600 transition-colors line-clamp-2">
                    {b.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{b.excerpt}</p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-100">
                  <span className="font-medium text-slate-600">{b.author}</span>
                  <span>{b.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
