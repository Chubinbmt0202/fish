export type WaterType = 'freshwater' | 'saltwater' | 'brackish';
export type CareLevel = 'easy' | 'medium' | 'hard';
export type SizeCategory = 'small' | 'medium' | 'large';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'fish' | 'shrimp_snail' | 'plants' | 'aquarium' | 'accessories' | 'food_med';
  categoryName: string;
  price: number;
  originalPrice?: number;
  stock: number;
  image: string;
  gallery: string[];
  waterType: WaterType; // Nước ngọt, Nước mặn, Nước lợ
  careLevel: CareLevel; // Dễ, Trung bình, Khó
  size: SizeCategory;   // Nhỏ (<5cm), Trung bình (5-15cm), Lớn (>15cm)
  sizeText?: string;
  temperature?: string;
  ph?: string;
  origin?: string;
  description: string;
  features?: string[];
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isNew?: boolean;
}

export interface InventoryLock {
  id: string;
  productId: string;
  sessionId: string;
  userId?: string;
  quantity: number;
  createdAt: number; // timestamp ms
  expiresAt: number; // timestamp ms (10 minutes after create)
  status: 'active' | 'released' | 'committed';
}

export interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
}

export type OrderStatus = 
  | 'pending'           // Chờ xác nhận
  | 'confirmed'         // Đã xác nhận
  | 'packing_oxygen'    // Đóng gói bơm oxy sinh học
  | 'shipping'          // Đang giao hàng
  | 'delivered'         // Đã giao thành công
  | 'cancelled';        // Đã hủy

export interface OrderTimeline {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  waterType?: WaterType;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'cod' | 'banking' | 'vnpay';
  paymentStatus: 'pending' | 'paid' | 'failed';
  promoCode?: string;
  createdAt: string;
  updatedAt: string;
  timeline: OrderTimeline[];
  userId?: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  senderRole: 'customer' | 'admin';
  senderName: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  role: 'customer' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  date: string;
  readTime: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  maxDiscount?: number;
  minOrder: number;
  description: string;
}
