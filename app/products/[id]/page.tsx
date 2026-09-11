'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product, Review } from '@/lib/types';
import { formatVND, getWaterTypeLabel, getCareLevelLabel, getSizeLabel } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { 
  Fish, 
  Droplet, 
  Thermometer, 
  Sparkles, 
  ShieldCheck, 
  ShoppingBag, 
  Star, 
  CheckCircle2, 
  ArrowLeft,
  Truck,
  MessageSquare,
  Clock,
  Heart
} from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product & { availableStock?: number } | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [addedToast, setAddedToast] = useState(false);

  // Review Form state
  const [reviewName, setReviewName] = useState(user?.name || '');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    const loadProductData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${params.id}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
          setSelectedImage(data.product.image);
        }

        const revRes = await fetch(`/api/reviews?productId=${params.id}`);
        const revData = await revRes.json();
        if (revData.success && revData.reviews) {
          setReviews(revData.reviews);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadProductData();
  }, [params?.id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !reviewComment.trim()) return;

    setReviewSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userName: reviewName.trim() || 'Người nuôi thủy sinh',
          rating: reviewRating,
          comment: reviewComment.trim()
        })
      });
      const data = await res.json();
      if (data.success && data.review) {
        setReviews([data.review, ...reviews]);
        setReviewComment('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <Fish className="w-10 h-10 text-teal-600 mx-auto animate-bounce mb-3" />
        <p className="text-sm text-slate-500 font-medium">Đang tải thông số cá cảnh...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Không tìm thấy thông tin sản phẩm</h2>
        <Link href="/products" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs">
          <ArrowLeft className="w-4 h-4" /> Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  const water = getWaterTypeLabel(product.waterType);
  const care = getCareLevelLabel(product.careLevel);
  const effectiveStock = product.availableStock !== undefined ? product.availableStock : product.stock;
  const isOutOfStock = effectiveStock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/products" className="hover:text-teal-700 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Tất cả sản phẩm
        </Link>
        <span>/</span>
        <span className="text-teal-700 font-bold">{product.categoryName}</span>
        <span>/</span>
        <span className="text-slate-800 truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Showcase: Gallery + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Images */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square w-full rounded-3xl overflow-hidden bg-white border border-slate-200 relative shadow-md">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className={`px-3 py-1 rounded-lg text-xs font-bold border backdrop-blur-md shadow-xs ${
                product.waterType === 'freshwater'
                  ? 'bg-emerald-50/95 text-emerald-800 border-emerald-300'
                  : 'bg-cyan-50/95 text-cyan-800 border-cyan-300'
              }`}>
                {water.label}
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-bold border backdrop-blur-md bg-white/95 text-slate-800 border-slate-300 shadow-xs">
                {care.label}
              </span>
            </div>
          </div>

          {/* Gallery Thumbnails */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="flex gap-3">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img ? 'border-teal-500 shadow-sm scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info, Biology Parameters & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">{product.categoryName}</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 leading-snug">
              {product.name}
            </h1>
            
            {/* Rating summary */}
            <div className="flex items-center gap-2 mt-2.5">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-sm font-bold ml-1 text-slate-900">{product.rating}</span>
              </div>
              <span className="text-xs text-slate-500">({product.reviewCount} đánh giá khách hàng)</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-emerald-700 font-bold">Bảo hành sống 100% khi nhận</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 flex items-baseline gap-4">
            <span className="text-3xl font-black text-teal-800 font-mono">
              {formatVND(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-slate-400 line-through">
                {formatVND(product.originalPrice)}
              </span>
            )}
            {product.originalPrice && (
              <span className="px-2.5 py-0.5 rounded text-[11px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200 ml-auto">
                Tiết kiệm {formatVND(product.originalPrice - product.price)}
              </span>
            )}
          </div>

          {/* Biological Specs Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Bảng Thông Số Môi Trường Thủy Sinh
            </h3>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-500 block text-[11px] font-medium">Nhiệt độ thích hợp:</span>
                <span className="text-slate-900 font-bold flex items-center gap-1 mt-0.5">
                  <Thermometer className="w-3.5 h-3.5 text-rose-500" /> {product.temperature || '24 - 28°C'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-500 block text-[11px] font-medium">Độ pH nước:</span>
                <span className="text-slate-900 font-bold flex items-center gap-1 mt-0.5">
                  <Droplet className="w-3.5 h-3.5 text-cyan-600" /> {product.ph || '6.5 - 7.5'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-500 block text-[11px] font-medium">Kích thước cá:</span>
                <span className="text-slate-900 font-bold mt-0.5 block">
                  {product.sizeText || getSizeLabel(product.size)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-500 block text-[11px] font-medium">Nguồn gốc giống:</span>
                <span className="text-slate-900 font-bold mt-0.5 block truncate">
                  {product.origin || 'Trại Giống GuppyVibe'}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="text-xs text-slate-600 leading-relaxed space-y-2">
            <p>{product.description}</p>
            {product.features && (
              <ul className="space-y-1.5 pt-2 font-medium">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Stock Status & 10 Min Lock Callout */}
          <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isOutOfStock ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`} />
              <span className="text-slate-800 font-bold">
                {isOutOfStock ? 'Sản phẩm tạm thời hết hàng' : `Tồn kho khả dụng: ${effectiveStock} con/sản phẩm`}
              </span>
            </div>
            <span className="text-[11px] text-teal-800 font-mono font-bold">Khóa giữ chỗ 10p khi thanh toán</span>
          </div>

          {/* Quantity and Add To Cart */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 text-xs">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1 || isOutOfStock}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-200 font-bold disabled:opacity-30"
              >
                -
              </button>
              <span className="w-10 text-center font-black text-slate-900">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(effectiveStock, quantity + 1))}
                disabled={quantity >= effectiveStock || isOutOfStock}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-200 font-bold disabled:opacity-30"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-1 py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-md ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:brightness-105 active:scale-95 shadow-teal-500/20'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              {isOutOfStock ? 'Hết hàng' : `Thêm vào giỏ hàng • ${formatVND(product.price * quantity)}`}
            </button>
          </div>

          {/* Toast Notification */}
          {addedToast && (
            <div className="p-3 rounded-xl bg-teal-600 text-white font-bold text-xs flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Đã thêm sản phẩm vào giỏ hàng thành công!</span>
              </div>
              <Link href="/cart" className="underline hover:text-teal-100">Xem giỏ hàng →</Link>
            </div>
          )}

        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <div className="pt-12 border-t border-slate-200 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-teal-600" />
              Đánh Giá Của Khách Nuôi Cá ({reviews.length})
            </h2>
            <p className="text-xs text-slate-500 mt-1">Phản hồi thực tế sau khi nhận cá đóng gói thùng oxy</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Reviews List */}
          <div className="lg:col-span-7 space-y-4">
            {reviews.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500 shadow-xs">
                Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên gửi trải nghiệm của bạn!
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        {rev.userName}
                        {rev.verifiedPurchase && (
                          <span className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 text-[10px] font-bold border border-teal-200">
                            Đã mua hàng
                          </span>
                        )}
                      </h4>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Submit Review Box */}
          <div className="lg:col-span-5">
            <form onSubmit={handleReviewSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Gửi Đánh Giá Của Bạn</h3>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Họ tên của bạn</label>
                <input
                  type="text"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Đánh giá sao</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setReviewRating(s)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-5 h-5 ${s <= reviewRating ? 'fill-amber-400' : 'text-slate-200'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cảm nhận về cá và khâu đóng oxy</label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Cá bơi khỏe không? Đóng gói oxy thế nào?..."
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting || !reviewComment.trim()}
                className="w-full py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-500 disabled:opacity-50 transition-colors shadow-xs"
              >
                {reviewSubmitting ? 'Đang gửi...' : 'Gửi Đánh Giá Ngay'}
              </button>
            </form>
          </div>

        </div>
      </div>

    </div>
  );
}
