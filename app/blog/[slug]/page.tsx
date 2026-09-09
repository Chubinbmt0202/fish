import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import { ArrowLeft, Clock, User, Calendar, BookOpen, ShieldCheck, Droplets } from 'lucide-react';

export const revalidate = 0;

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const db = getDb();
  const blog = db.blogs.find(b => b.slug === params.slug || b.id === params.slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back button */}
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs text-teal-700 hover:text-teal-800 font-bold">
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách cẩm nang
      </Link>

      {/* Header */}
      <div className="space-y-4">
        <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold">
          {blog.category}
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pb-4 border-b border-slate-200 font-medium">
          <span className="flex items-center gap-1.5 text-teal-700 font-bold">
            <User className="w-3.5 h-3.5" /> {blog.author}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> {blog.date}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> {blog.readTime}
          </span>
        </div>
      </div>

      {/* Hero Cover Image */}
      <div className="aspect-video w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md">
        <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <article className="prose prose-slate max-w-none bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs text-slate-800 text-sm sm:text-base leading-relaxed space-y-6">
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 font-medium italic text-sm">
          "{blog.excerpt}"
        </div>

        <div className="whitespace-pre-line text-slate-700 text-sm leading-loose">
          {blog.content}
        </div>
      </article>

      {/* CTA Box */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-50 via-cyan-50 to-emerald-50 border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Cần tư vấn trực tiếp loại cá phù hợp với hồ của bạn?</h4>
          <p className="text-xs text-slate-600 mt-0.5">Nhắn tin cho chuyên viên kỹ thuật qua khung chat góc dưới phải nhé!</p>
        </div>
        <Link
          href="/products"
          className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-500 whitespace-nowrap shadow-xs"
        >
          Khám phá đàn cá đẹp
        </Link>
      </div>

    </div>
  );
}
