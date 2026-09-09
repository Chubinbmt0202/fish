import { NextResponse } from 'next/server';
import { getDb, saveDb, getAvailableStock } from '@/lib/db';
import { Product, WaterType, CareLevel, SizeCategory } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const category = searchParams.get('category') || 'all';
    const waterType = searchParams.get('waterType') as WaterType | 'all' || 'all';
    const careLevel = searchParams.get('careLevel') as CareLevel | 'all' || 'all';
    const size = searchParams.get('size') as SizeCategory | 'all' || 'all';
    const inStock = searchParams.get('inStock') === 'true';
    const sort = searchParams.get('sort') || 'featured';
    const sessionId = searchParams.get('sessionId') || undefined;

    const db = getDb();
    let products = db.products.map(p => ({
      ...p,
      availableStock: getAvailableStock(p.id, sessionId)
    }));

    // Filtering
    if (search) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.categoryName.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
      );
    }

    if (category !== 'all') {
      products = products.filter(p => p.category === category);
    }

    if (waterType !== 'all') {
      products = products.filter(p => p.waterType === waterType);
    }

    if (careLevel !== 'all') {
      products = products.filter(p => p.careLevel === careLevel);
    }

    if (size !== 'all') {
      products = products.filter(p => p.size === size);
    }

    if (inStock) {
      products = products.filter(p => p.availableStock > 0);
    }

    // Sorting
    if (sort === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDb();

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: body.category || 'fish',
      categoryName: body.categoryName || 'Cá Cảnh',
      price: Number(body.price) || 0,
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      stock: Number(body.stock) || 0,
      image: body.image || 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80',
      gallery: body.gallery && body.gallery.length > 0 ? body.gallery : [body.image],
      waterType: body.waterType || 'freshwater',
      careLevel: body.careLevel || 'easy',
      size: body.size || 'small',
      sizeText: body.sizeText || '',
      temperature: body.temperature || '24 - 28°C',
      ph: body.ph || '6.5 - 7.5',
      origin: body.origin || 'Việt Nam',
      description: body.description || '',
      features: body.features || ['Đóng gói oxy chuyên dụng bảo hành 100%'],
      rating: 5.0,
      reviewCount: 0,
      isFeatured: Boolean(body.isFeatured),
      isNew: true
    };

    db.products.unshift(newProduct);
    saveDb(db);

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, message: 'Lỗi thêm sản phẩm' }, { status: 500 });
  }
}
