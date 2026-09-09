'use client';

import React from 'react';
import { Search, Filter, Droplet, Sparkles, Scale, RefreshCw } from 'lucide-react';
import { WaterType, CareLevel, SizeCategory } from '@/lib/types';

interface FilterProps {
  search: string;
  setSearch: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  waterType: WaterType | 'all';
  setWaterType: (v: WaterType | 'all') => void;
  careLevel: CareLevel | 'all';
  setCareLevel: (v: CareLevel | 'all') => void;
  size: SizeCategory | 'all';
  setSize: (v: SizeCategory | 'all') => void;
  inStock: boolean;
  setInStock: (v: boolean) => void;
  sort: string;
  setSort: (v: string) => void;
  onReset: () => void;
}

export default function ProductFilters({
  search,
  setSearch,
  category,
  setCategory,
  waterType,
  setWaterType,
  careLevel,
  setCareLevel,
  size,
  setSize,
  inStock,
  setInStock,
  sort,
  setSort,
  onReset
}: FilterProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6">
      
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
          <Filter className="w-4 h-4 text-teal-600" />
          <span>Bộ Lọc Sinh Học & Phân Loại</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-teal-600 flex items-center gap-1 transition-colors font-medium"
        >
          <RefreshCw className="w-3 h-3" />
          Đặt lại
        </button>
      </div>

      {/* 1. Keyword Search */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2">Tìm kiếm tên cá / phụ kiện</label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cá Rồng, Betta, Tép, Lọc..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* 2. Category selection */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2">Danh mục sản phẩm</label>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          {[
            { id: 'all', label: 'Tất cả danh mục' },
            { id: 'fish', label: 'Cá Cảnh Quý' },
            { id: 'shrimp_snail', label: 'Tép & Ốc' },
            { id: 'plants', label: 'Cây Thủy Sinh' },
            { id: 'accessories', label: 'Lọc & Thiết Bị' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-2.5 py-2 rounded-xl text-left truncate transition-all ${
                category === cat.id
                  ? 'bg-teal-50 border border-teal-300 text-teal-800 font-bold shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Water Environment */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold text-cyan-800 mb-2">
          <Droplet className="w-3.5 h-3.5 text-cyan-600" />
          <span>Môi trường nước</span>
        </label>
        <div className="flex flex-wrap gap-1.5 text-xs">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'freshwater', label: 'Nước Ngọt' },
            { id: 'saltwater', label: 'Nước Mặn' },
            { id: 'brackish', label: 'Nước Lợ' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setWaterType(item.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                waterType === item.id
                  ? 'bg-cyan-100 border border-cyan-400 text-cyan-900 font-bold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Care Level */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Mức độ chăm sóc</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          {[
            { id: 'all', label: 'Mọi cấp độ' },
            { id: 'easy', label: 'Dễ nuôi' },
            { id: 'medium', label: 'Trung bình' },
            { id: 'hard', label: 'Khó / Chuyên gia' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCareLevel(item.id as any)}
              className={`px-2.5 py-1.5 rounded-lg text-left transition-all ${
                careLevel === item.id
                  ? 'bg-amber-50 border border-amber-300 text-amber-900 font-bold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Size Category */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold text-indigo-800 mb-2">
          <Scale className="w-3.5 h-3.5 text-indigo-600" />
          <span>Kích thước cá</span>
        </label>
        <div className="flex flex-wrap gap-1.5 text-xs">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'small', label: 'Nhỏ (<5cm)' },
            { id: 'medium', label: 'Vừa (5-15cm)' },
            { id: 'large', label: 'Lớn (>15cm)' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSize(item.id as any)}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                size === item.id
                  ? 'bg-indigo-50 border border-indigo-300 text-indigo-900 font-bold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6. In stock toggle */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 bg-slate-50 border-slate-300"
          />
          <span className="text-xs font-bold text-slate-700">Chỉ hiển thị sản phẩm còn hàng</span>
        </label>
      </div>

      {/* 7. Sorting */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2">Sắp xếp theo</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-teal-500"
        >
          <option value="featured">Nổi bật nhất</option>
          <option value="newest">Hàng mới về</option>
          <option value="price-asc">Giá: Thấp đến Cao</option>
          <option value="price-desc">Giá: Cao đến Thấp</option>
          <option value="rating">Đánh giá cao nhất</option>
        </select>
      </div>

    </div>
  );
}
