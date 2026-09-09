'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product-card';
import ProductFilters from '@/components/product-filters';
import { Product, WaterType, CareLevel, SizeCategory } from '@/lib/types';
import { Fish, Sparkles, Loader2, Frown } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const { sessionId } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [waterType, setWaterType] = useState<WaterType | 'all'>((searchParams.get('waterType') as any) || 'all');
  const [careLevel, setCareLevel] = useState<CareLevel | 'all'>((searchParams.get('careLevel') as any) || 'all');
  const [size, setSize] = useState<SizeCategory | 'all'>((searchParams.get('size') as any) || 'all');
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState('featured');

  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category !== 'all') params.append('category', category);
      if (waterType !== 'all') params.append('waterType', waterType);
      if (careLevel !== 'all') params.append('careLevel', careLevel);
      if (size !== 'all') params.append('size', size);
      if (inStock) params.append('inStock', 'true');
      if (sort) params.append('sort', sort);
      if (sessionId) params.append('sessionId', sessionId);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.products) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, [search, category, waterType, careLevel, size, inStock, sort, sessionId]);

  const handleReset = () => {
    setSearch('');
    setCategory('all');
    setWaterType('all');
    setCareLevel('all');
    setSize('all');
    setInStock(false);
    setSort('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-700 text-xs font-bold mb-1">
            <Fish className="w-4 h-4 text-teal-600" />
            <span>Kho Cá Cảnh & Phụ Kiện Thủy Sinh</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Danh Mục Sản Phẩm Toàn Diện</h1>
          <p className="text-xs text-slate-500 mt-1">
            Tìm kiếm theo đặc tính môi trường nước, độ khó chăm sóc và kích thước phù hợp với hồ của bạn.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-800 font-mono font-bold">
          Hiển thị: <strong>{products.length}</strong> sản phẩm
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Product Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Filter */}
        <div className="lg:col-span-4 xl:col-span-3">
          <ProductFilters
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            waterType={waterType}
            setWaterType={setWaterType}
            careLevel={careLevel}
            setCareLevel={setCareLevel}
            size={size}
            setSize={setSize}
            inStock={inStock}
            setInStock={setInStock}
            sort={sort}
            setSort={setSort}
            onReset={handleReset}
          />
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-8 xl:col-span-9">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200 shadow-xs">
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin mb-3" />
              <p className="text-xs text-slate-500 font-medium">Đang cập nhật danh sách cá và tồn kho realtime...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 text-center p-6 space-y-4 shadow-xs">
              <Frown className="w-12 h-12 text-teal-600/50" />
              <div>
                <h3 className="text-base font-bold text-slate-900">Không tìm thấy sản phẩm phù hợp</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Hãy thử thay đổi từ khóa hoặc đặt lại bộ lọc thuộc tính sinh học để xem các dòng cá khác.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold hover:bg-teal-100 transition-colors"
              >
                Đặt lại tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-teal-600 font-bold">Đang tải cửa hàng...</div>}>
      <ProductsCatalogContent />
    </Suspense>
  );
}
