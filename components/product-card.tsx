'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { formatVND, getWaterTypeLabel, getCareLevelLabel, getSizeLabel } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import { ShoppingBag, Star, Shield, Droplet } from 'lucide-react';

export default function ProductCard({ product }: { product: Product & { availableStock?: number } }) {
  const { addToCart } = useCart();
  const water = getWaterTypeLabel(product.waterType);
  const care = getCareLevelLabel(product.careLevel);
  const effectiveStock = product.availableStock !== undefined ? product.availableStock : product.stock;
  const isOutOfStock = effectiveStock <= 0;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden glass-panel-hover flex flex-col h-full border border-slate-200 shadow-xs">
      
      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border backdrop-blur-md shadow-xs ${
            product.waterType === 'freshwater' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
              : product.waterType === 'saltwater'
              ? 'bg-cyan-50 text-cyan-800 border-cyan-300'
              : 'bg-amber-50 text-amber-800 border-amber-300'
          }`}>
            {water.label}
          </span>
          {product.isNew && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-teal-600 text-white uppercase shadow-xs">
              Mới về
            </span>
          )}
        </div>

        {/* Stock Badge */}
        <div className="absolute bottom-2.5 right-2.5 z-10">
          {isOutOfStock ? (
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-300 backdrop-blur-md">
              Tạm hết hàng
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-white/95 text-emerald-700 border border-emerald-300 backdrop-blur-md shadow-xs">
              Còn {effectiveStock} con/cái
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Biology Attributes Strip */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2">
            <span className={`px-2 py-0.5 rounded border font-medium ${
              product.careLevel === 'easy'
                ? 'bg-green-50 text-green-700 border-green-200'
                : product.careLevel === 'medium'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              {care.label}
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-medium">{getSizeLabel(product.size)}</span>
          </div>

          {/* Title */}
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-bold text-slate-900 text-sm line-clamp-2 hover:text-teal-600 transition-colors group-hover:text-teal-600 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="text-xs font-bold ml-1 text-slate-800">{product.rating}</span>
            </div>
            <span className="text-xs text-slate-400">({product.reviewCount} đánh giá)</span>
          </div>
        </div>

        {/* Pricing & Cart Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-base font-extrabold text-teal-700">
              {formatVND(product.price)}
            </div>
            {product.originalPrice && (
              <div className="text-[11px] text-slate-400 line-through">
                {formatVND(product.originalPrice)}
              </div>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
              isOutOfStock 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold hover:brightness-105 shadow-md shadow-teal-500/20 active:scale-95'
            }`}
            title={isOutOfStock ? 'Tạm hết hàng' : 'Thêm vào giỏ'}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
