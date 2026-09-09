'use client';

import React, { useState, useEffect } from 'react';
import { Product, Order, OrderStatus, ChatMessage, User, BlogPost, WaterType, CareLevel, SizeCategory } from '@/lib/types';
import { formatVND, getOrderStatusInfo, getWaterTypeLabel, getCareLevelLabel, getSizeLabel } from '@/lib/utils';
import { 
  BarChart3, 
  ShoppingBag, 
  Package, 
  MessageSquare, 
  Users, 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Droplets, 
  XCircle, 
  Send, 
  Search,
  RefreshCw,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'stats' | 'orders' | 'products' | 'chat' | 'blogs' | 'users'>('stats');

  // Stats & Data state
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Product CRUD Modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'fish' as any,
    categoryName: 'Cá Cảnh',
    price: 250000,
    originalPrice: 300000,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80',
    waterType: 'freshwater' as WaterType,
    careLevel: 'easy' as CareLevel,
    size: 'small' as SizeCategory,
    temperature: '24 - 28°C',
    ph: '6.5 - 7.5',
    origin: 'Việt Nam',
    description: '',
    isFeatured: true
  });

  // Blog Create Modal state
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [blogForm, setBlogForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Cẩm Nang Nuôi Cá',
    coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
  });

  // Chat reply state
  const [selectedChatSession, setSelectedChatSession] = useState<string>('guest-session-1');
  const [replyText, setReplyText] = useState('');

  // Order status filter
  const [orderFilter, setOrderFilter] = useState<string>('all');

  const fetchAllAdminData = async () => {
    setLoading(true);
    try {
      const [sRes, oRes, pRes, cRes, uRes, bRes] = await Promise.all([
        fetch('/api/stats').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/products').then(r => r.json()),
        fetch('/api/chat').then(r => r.json()),
        fetch('/api/auth').then(r => r.json()),
        fetch('/api/blogs').then(r => r.json()),
      ]);

      if (sRes.success) setStats(sRes.stats);
      if (oRes.success) setOrders(oRes.orders);
      if (pRes.success) setProducts(pRes.products);
      if (cRes.success) setMessages(cRes.messages);
      if (uRes.success) setUsers(uRes.users);
      if (bRes.success) setBlogs(bRes.blogs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
    const interval = setInterval(fetchAllAdminData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchAllAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Product CRUD Handlers
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProductId ? `/api/products/${editingProductId}` : '/api/products';
      const method = editingProductId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm)
      });
      const data = await res.json();
      if (data.success) {
        setShowProductModal(false);
        setEditingProductId(null);
        fetchAllAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này khỏi kho?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchAllAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProductForm({
      name: prod.name,
      category: prod.category,
      categoryName: prod.categoryName,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      stock: prod.stock,
      image: prod.image,
      waterType: prod.waterType,
      careLevel: prod.careLevel,
      size: prod.size,
      temperature: prod.temperature || '24 - 28°C',
      ph: prod.ph || '6.5 - 7.5',
      origin: prod.origin || 'Việt Nam',
      description: prod.description,
      isFeatured: Boolean(prod.isFeatured)
    });
    setShowProductModal(true);
  };

  // Send Admin Chat Reply
  const handleSendChatReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: selectedChatSession,
          senderRole: 'admin',
          senderName: 'Tư Vấn Viên AquaVibe',
          message: replyText.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setReplyText('');
        fetchAllAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save Blog Post
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogForm)
      });
      const data = await res.json();
      if (data.success) {
        setShowBlogModal(false);
        setBlogForm({
          title: '',
          excerpt: '',
          content: '',
          category: 'Cẩm Nang Nuôi Cá',
          coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
        });
        fetchAllAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Unique chat sessions
  const uniqueSessions = Array.from(new Set(messages.map(m => m.sessionId)));
  const sessionMessages = messages.filter(m => m.sessionId === selectedChatSession);

  const filteredOrders = orderFilter === 'all'
    ? orders
    : orders.filter(o => o.status === orderFilter);

  return (
    <div className="space-y-8">
      
      {/* Admin Tab Navigation */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-200">
        {[
          { id: 'stats', label: 'Báo Cáo & Doanh Thu', icon: BarChart3 },
          { id: 'orders', label: `Xử Lý Đơn Hàng (${orders.length})`, icon: Package },
          { id: 'products', label: `Quản Trị Sản Phẩm (${products.length})`, icon: ShoppingBag },
          { id: 'chat', label: `Hỗ Trợ Live Chat (${messages.length})`, icon: MessageSquare },
          { id: 'blogs', label: 'Cẩm Nang & Blog', icon: BookOpen },
          { id: 'users', label: `Tài Khoản (${users.length})`, icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={fetchAllAdminData}
          className="ml-auto p-2.5 rounded-xl bg-white text-slate-600 hover:text-cyan-700 border border-slate-200 shadow-xs transition-colors"
          title="Làm mới dữ liệu"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* TAB 1: STATS & REVENUE REPORT */}
      {activeTab === 'stats' && stats && (
        <div className="space-y-8">
          
          {/* Top 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Tổng Doanh Thu</span>
              <div className="text-2xl font-black text-teal-800 font-mono">
                {formatVND(stats.totalRevenue)}
              </div>
              <span className="text-[10px] text-emerald-700 flex items-center gap-1 font-bold">
                <ArrowUpRight className="w-3 h-3" /> Đã khấu trừ khuyến mãi
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Tổng Đơn Hàng</span>
              <div className="text-2xl font-black text-cyan-800 font-mono">
                {stats.totalOrders}
              </div>
              <span className="text-[10px] text-cyan-700 font-bold">
                {stats.orderStatusCounts.packing_oxygen} đơn đang đóng oxy
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Tồn Kho Đang Khóa 10p</span>
              <div className="text-2xl font-black text-amber-700 font-mono">
                {stats.activeLocksCount} phiên
              </div>
              <span className="text-[10px] text-amber-700 font-bold">
                Cơ chế Inventory Locking đang kích hoạt
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Tổng Số Cá & Thiết Bị</span>
              <div className="text-2xl font-black text-indigo-800 font-mono">
                {stats.totalStock} con/cái
              </div>
              <span className="text-[10px] text-slate-500 font-medium">
                Qua {stats.totalProducts} dòng sản phẩm
              </span>
            </div>

          </div>

          {/* Status Breakdown & Category Sales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Order Status Breakdown */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Trạng Thái Đơn Hàng Vận Hành</h3>
              <div className="space-y-3">
                {[
                  { label: 'Chờ xác nhận', count: stats.orderStatusCounts.pending, color: 'bg-amber-400' },
                  { label: 'Đã xác nhận', count: stats.orderStatusCounts.confirmed, color: 'bg-blue-400' },
                  { label: 'Đang đóng gói bơm Oxy', count: stats.orderStatusCounts.packing_oxygen, color: 'bg-teal-500' },
                  { label: 'Đang vận chuyển hỏa tốc', count: stats.orderStatusCounts.shipping, color: 'bg-indigo-500' },
                  { label: 'Đã giao thành công', count: stats.orderStatusCounts.delivered, color: 'bg-emerald-500' },
                  { label: 'Đã hủy', count: stats.orderStatusCounts.cancelled, color: 'bg-rose-500' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      <span className="text-slate-700 font-medium">{item.label}</span>
                    </div>
                    <span className="font-bold text-slate-900 font-mono">{item.count} đơn</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active 10-Min Inventory Locks Realtime View */}
            <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" /> Khóa Giữ Chỗ Tồn Kho Realtime (10 Phút)
              </h3>
              
              {stats.activeLocks.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  Hiện không có phiên thanh toán nào đang tạm giữ số lượng.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {stats.activeLocks.map((lock: any) => {
                    const prod = products.find(p => p.id === lock.productId);
                    const remainingSec = Math.max(0, Math.floor((lock.expiresAt - Date.now()) / 1000));
                    return (
                      <div key={lock.id} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-900">{prod?.name || lock.productId}</p>
                          <span className="text-slate-500">Khóa {lock.quantity} con • Phiên: {lock.sessionId.slice(-6)}</span>
                        </div>
                        <span className="font-black text-amber-800 font-mono">
                          {Math.floor(remainingSec / 60)}:{(remainingSec % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: ORDER FULFILLMENT MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5 text-xs">
              {[
                { id: 'all', label: 'Tất cả đơn' },
                { id: 'pending', label: 'Chờ duyệt' },
                { id: 'confirmed', label: 'Đã xác nhận' },
                { id: 'packing_oxygen', label: 'Đóng gói Oxy' },
                { id: 'shipping', label: 'Đang giao' },
                { id: 'delivered', label: 'Đã giao' },
                { id: 'cancelled', label: 'Đã hủy' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setOrderFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    orderFilter === f.id
                      ? 'bg-cyan-600 text-white font-bold shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredOrders.map((ord) => {
              const statusInfo = getOrderStatusInfo(ord.status);
              return (
                <div key={ord.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-slate-900 font-mono">{ord.orderNumber}</span>
                      <span className="text-xs text-slate-500">• {new Date(ord.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      ord.status === 'packing_oxygen'
                        ? 'bg-teal-50 text-teal-800 border-teal-300'
                        : ord.status === 'delivered'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : ord.status === 'cancelled'
                        ? 'bg-rose-50 text-rose-800 border-rose-300'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Customer Info & Items */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
                    <div className="lg:col-span-4 space-y-1">
                      <p className="font-bold text-slate-900">{ord.customerName}</p>
                      <p className="text-slate-500">SĐT: {ord.phone}</p>
                      <p className="text-slate-500">Địa chỉ: {ord.address}, {ord.city}</p>
                      {ord.note && <p className="text-teal-700 font-semibold italic">Ghi chú: {ord.note}</p>}
                    </div>

                    <div className="lg:col-span-5 space-y-2">
                      {ord.items.map((i, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <img src={i.image} alt={i.name} className="w-8 h-8 rounded object-cover bg-slate-100 border border-slate-200" />
                          <span className="text-slate-800 font-medium">{i.name}</span>
                          <span className="text-slate-500 font-mono">x{i.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="lg:col-span-3 text-right">
                      <span className="text-slate-500 block">Tổng tiền:</span>
                      <span className="text-base font-black text-teal-800 font-mono">{formatVND(ord.total)}</span>
                      <span className="text-[10px] text-slate-400 block uppercase mt-0.5 font-bold">{ord.paymentMethod}</span>
                    </div>
                  </div>

                  {/* Order Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 justify-end">
                    <span className="text-xs text-slate-500 mr-2 font-medium">Chuyển trạng thái:</span>

                    <button
                      onClick={() => handleUpdateOrderStatus(ord.id, 'confirmed')}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold hover:bg-blue-100"
                    >
                      Duyệt đơn
                    </button>

                    <button
                      onClick={() => handleUpdateOrderStatus(ord.id, 'packing_oxygen')}
                      className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-300 text-xs font-black hover:bg-teal-100 flex items-center gap-1 shadow-xs"
                    >
                      <Droplets className="w-3.5 h-3.5 text-teal-600" /> Đóng gói bơm Oxy
                    </button>

                    <button
                      onClick={() => handleUpdateOrderStatus(ord.id, 'shipping')}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-bold hover:bg-indigo-100 flex items-center gap-1"
                    >
                      <Truck className="w-3.5 h-3.5" /> Giao hàng
                    </button>

                    <button
                      onClick={() => handleUpdateOrderStatus(ord.id, 'delivered')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đã giao thành công
                    </button>

                    <button
                      onClick={() => handleUpdateOrderStatus(ord.id, 'cancelled')}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold hover:bg-rose-100"
                    >
                      Hủy đơn & hoàn kho
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 3: PRODUCT MANAGEMENT (CRUD) */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Danh Sách Cá Cảnh & Phụ Kiện Trong Kho</h2>
            <button
              onClick={() => {
                setEditingProductId(null);
                setProductForm({
                  name: '',
                  category: 'fish',
                  categoryName: 'Cá Cảnh',
                  price: 250000,
                  originalPrice: 300000,
                  stock: 10,
                  image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80',
                  waterType: 'freshwater',
                  careLevel: 'easy',
                  size: 'small',
                  temperature: '24 - 28°C',
                  ph: '6.5 - 7.5',
                  origin: 'Việt Nam',
                  description: '',
                  isFeatured: true
                });
                setShowProductModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-cyan-500 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" /> Thêm Sản Phẩm Mới
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => {
              const water = getWaterTypeLabel(prod.waterType);
              const care = getCareLevelLabel(prod.careLevel);

              return (
                <div key={prod.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div className="relative aspect-video w-full bg-slate-100">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 flex gap-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold border backdrop-blur-md bg-white/95 text-slate-800 border-slate-200 shadow-xs">
                        {water.label}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold border backdrop-blur-md bg-white/95 text-slate-800 border-slate-200 shadow-xs">
                        {care.label}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{prod.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{prod.categoryName} • Tồn kho: <strong className="text-teal-700">{prod.stock}</strong></p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                      <span className="font-black text-teal-800 font-mono text-sm">{formatVND(prod.price)}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditProduct(prod)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-cyan-700 hover:bg-cyan-50"
                          title="Sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 4: LIVE CHAT DESK */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
          
          {/* Chat Sessions Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 space-y-3 overflow-y-auto shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Hội Thoại Khách Hàng ({uniqueSessions.length})</h3>
            
            <div className="space-y-2">
              {uniqueSessions.map((sid) => {
                const sMsgs = messages.filter(m => m.sessionId === sid);
                const lastMsg = sMsgs[sMsgs.length - 1];
                const isSelected = selectedChatSession === sid;

                return (
                  <div
                    key={sid}
                    onClick={() => setSelectedChatSession(sid)}
                    className={`p-3 rounded-xl cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-cyan-50 border-cyan-400 text-slate-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-900">Khách #{sid.slice(-6)}</span>
                      <span className="text-[10px] text-slate-400">{new Date(lastMsg?.timestamp || '').toLocaleTimeString('vi-VN')}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 truncate">{lastMsg?.message}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Chat Thread */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Đang hỗ trợ phiên: {selectedChatSession}</h4>
                <p className="text-[10px] text-teal-700 font-medium">Tư vấn viên trực tiếp phản hồi khách</p>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/40">
              {sessionMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.senderRole === 'admin' ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-slate-400 mb-1 px-1">{msg.senderName}</span>
                  <div
                    className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      msg.senderRole === 'admin'
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200 shadow-xs'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChatReply} className="p-3 bg-white border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Nhập câu trả lời tư vấn cho khách..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 text-white font-bold text-xs rounded-xl hover:bg-cyan-500 shadow-xs"
              >
                Gửi
              </button>
            </form>
          </div>

        </div>
      )}

      {/* TAB 5: BLOG CMS */}
      {activeTab === 'blogs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Cẩm Nang Kỹ Thuật Thủy Sinh</h2>
            <button
              onClick={() => setShowBlogModal(true)}
              className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-cyan-500 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Đăng Bài Hướng Dẫn Mới
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((b) => (
              <div key={b.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <span className="px-2.5 py-0.5 rounded bg-teal-50 text-teal-800 text-[10px] font-bold border border-teal-200">
                  {b.category}
                </span>
                <h3 className="font-bold text-slate-900 text-base">{b.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{b.excerpt}</p>
                <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-100">
                  <span className="font-medium text-slate-600">{b.author}</span>
                  <span>{b.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: USERS LIST */}
      {activeTab === 'users' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Danh Sách Tài Khoản Hệ Thống</h2>
          <div className="space-y-3">
            {users.map((u) => (
              <div key={u.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{u.name}</p>
                  <span className="text-slate-500">{u.email} {u.phone && `• ${u.phone}`}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  u.role === 'admin' ? 'bg-cyan-100 text-cyan-800 border border-cyan-300' : 'bg-teal-100 text-teal-800'
                }`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PRODUCT */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingProductId ? 'Chỉnh Sửa Thông Tin Cá / Thiết Bị' : 'Thêm Sản Phẩm Mới Vào Hồ'}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Ví dụ: Cá Betta Halfmoon Koi Super Red"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-cyan-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Giá bán (VND) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-cyan-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Số lượng tồn kho *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-cyan-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Môi trường nước</label>
                  <select
                    value={productForm.waterType}
                    onChange={(e) => setProductForm({ ...productForm, waterType: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-cyan-500"
                  >
                    <option value="freshwater">Nước Ngọt</option>
                    <option value="saltwater">Nước Mặn</option>
                    <option value="brackish">Nước Lợ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Độ khó nuôi</label>
                  <select
                    value={productForm.careLevel}
                    onChange={(e) => setProductForm({ ...productForm, careLevel: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-cyan-500"
                  >
                    <option value="easy">Dễ nuôi</option>
                    <option value="medium">Trung bình</option>
                    <option value="hard">Khó / Chuyên gia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Kích thước</label>
                  <select
                    value={productForm.size}
                    onChange={(e) => setProductForm({ ...productForm, size: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-cyan-500"
                  >
                    <option value="small">Nhỏ (&lt;5cm)</option>
                    <option value="medium">Vừa (5-15cm)</option>
                    <option value="large">Lớn (&gt;15cm)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Link ảnh sản phẩm (URL)</label>
                <input
                  type="url"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-cyan-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Mô tả chi tiết & nguồn gốc</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Đặc tính sinh học, chế độ ăn, tập tính..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-cyan-500 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-cyan-600 text-white font-bold hover:bg-cyan-500 shadow-xs"
                >
                  Lưu Sản Phẩm
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL: ADD BLOG */}
      {showBlogModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Đăng Tải Bài Viết Cẩm Nang Mới</h3>
            <form onSubmit={handleSaveBlog} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Tiêu đề bài viết</label>
                <input
                  type="text"
                  required
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Tóm tắt ngắn</label>
                <input
                  type="text"
                  required
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Nội dung bài viết</label>
                <textarea
                  rows={4}
                  required
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowBlogModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-cyan-600 text-white font-bold rounded-xl shadow-xs">Đăng Bài</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
