import React from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { BookOpen, Sparkles, Clock, ArrowRight, Droplets, Fish } from 'lucide-react';

export const revalidate = 0;

export default function BlogPage() {
  const db = getDb();
  const blogs = db.blogs;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-3xl mx-auto space-y-3 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5 text-teal-600" />
          <span>Kiến Thức & Kỹ Thuật Thủy Sinh</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Cẩm Nang Nuôi Cá Cảnh & Setup Bể</h1>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          Tổng hợp kinh nghiệm chọn lọc sinh học, chu trình vi sinh Nitrat hóa, và tiêu chuẩn đóng gói sục khí Oxy y tế giao cá sống đường dài.
        </p>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {blogs.map((b) => (
          <Link
            key={b.id}
            href={`/blog/${b.slug}`}
            className="group bg-white rounded-3xl overflow-hidden border border-slate-200 flex flex-col hover:shadow-lg transition-all"
          >
            <div className="aspect-video w-full relative overflow-hidden bg-slate-100">
              <img
                src={b.coverImage}
                alt={b.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-white/95 border border-slate-200 text-teal-800 backdrop-blur-md shadow-xs">
                  {b.category}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 group-hover:text-teal-600 transition-colors leading-snug">
                  {b.title}
                </h2>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed font-medium">
                  {b.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-teal-700 font-bold">{b.author}</span>
                  <span>•</span>
                  <span>{b.date}</span>
                </div>
                <div className="flex items-center gap-1 text-teal-700 font-bold">
                  <span>Đọc bài</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
