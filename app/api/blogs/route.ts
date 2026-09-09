import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { BlogPost } from '@/lib/types';

export async function GET() {
  try {
    const db = getDb();
    return NextResponse.json({ success: true, blogs: db.blogs });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi tải bài viết' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDb();

    const newBlog: BlogPost = {
      id: `blog-${Date.now()}`,
      title: body.title,
      slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt: body.excerpt,
      content: body.content,
      coverImage: body.coverImage || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      author: body.author || 'AquaVibe Editorial',
      category: body.category || 'Cẩm Nang Nuôi Cá',
      date: new Date().toISOString().split('T')[0],
      readTime: body.readTime || '5 phút đọc'
    };

    db.blogs.unshift(newBlog);
    saveDb(db);

    return NextResponse.json({ success: true, blog: newBlog });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi tạo bài viết' }, { status: 500 });
  }
}
