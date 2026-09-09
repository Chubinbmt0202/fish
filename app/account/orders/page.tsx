'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Order } from '@/lib/types';
import OrderTracker from '@/components/order-tracker';
import { formatVND, getOrderStatusInfo } from '@/lib/utils';
import { Package, Search, Clock, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchCode, setSearchCode] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = user ? `/api/orders?userId=${user.id}` : `/api/orders`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
        if (data.orders.length > 0 && !selectedOrder) {
          setSelectedOrder(data.orders[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const filteredOrders = searchCode
    ? orders.filter(o => o.orderNumber.toLowerCase().includes(searchCode.toLowerCase()))
    : orders;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-teal-600" /> Theo Dõi & Lịch Sử Đơn Hàng
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tra cứu hành trình cá cảnh từ khâu chọn giống, sục khí Oxy 99.5% đến khi nhận hàng.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-3.5 py-2 rounded-xl bg-white text-xs font-bold text-teal-700 hover:text-teal-800 border border-slate-200 hover:border-teal-300 shadow-xs flex items-center gap-1.5 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Làm mới
        </button>
      </div>

      {/* Orders View */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500 font-medium">Đang tải lịch sử đơn hàng...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <Package className="w-12 h-12 text-teal-600/40 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Bạn chưa có đơn hàng nào</h3>
          <p className="text-xs text-slate-500">Hãy đặt ngay những chú cá cảnh yêu thích đầu tiên của bạn!</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-md shadow-teal-600/20"
          >
            <ArrowLeft className="w-4 h-4" /> Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Orders List */}
          <div className="lg:col-span-5 space-y-4">
            {/* Search filter input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Tìm theo mã đơn (AQV-...)"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 shadow-xs"
              />
            </div>

            <div className="space-y-3">
              {filteredOrders.map((ord) => {
                const statusInfo = getOrderStatusInfo(ord.status);
                const isSelected = selectedOrder?.id === ord.id;

                return (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-teal-50/90 border-teal-400 shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-900 text-xs font-mono">{ord.orderNumber}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        ord.status === 'packing_oxygen'
                          ? 'bg-teal-100 text-teal-800 border-teal-300'
                          : ord.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 mt-2 line-clamp-1 font-medium">
                      {ord.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                    </div>

                    <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-slate-100">
                      <span className="text-[11px] text-slate-400">{new Date(ord.createdAt).toLocaleDateString('vi-VN')}</span>
                      <span className="font-bold text-teal-800 font-mono">{formatVND(ord.total)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Order Live Tracker */}
          <div className="lg:col-span-7 space-y-6">
            {selectedOrder ? (
              <div className="space-y-6">
                <OrderTracker order={selectedOrder} />

                {/* Items in selected order */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Danh Sách Cá & Thiết Bị Trong Kiện</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((i, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <img src={i.image} alt={i.name} className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200" />
                          <div>
                            <p className="font-bold text-slate-900">{i.name}</p>
                            <span className="text-slate-500">Số lượng: {i.quantity}</span>
                          </div>
                        </div>
                        <span className="font-bold text-teal-800 font-mono">{formatVND(i.price * i.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Người nhận:</span>
                      <span className="text-slate-900 font-bold">{selectedOrder.customerName} - {selectedOrder.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Địa chỉ:</span>
                      <span className="text-slate-800">{selectedOrder.address}, {selectedOrder.city}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-400 shadow-xs">
                Chọn một đơn hàng bên trái để xem chi tiết tiến trình vận chuyển.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
