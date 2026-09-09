'use client';

import React from 'react';
import { Order, OrderStatus } from '@/lib/types';
import { getOrderStatusInfo } from '@/lib/utils';
import { 
  CheckCircle2, 
  Clock, 
  Package, 
  Truck, 
  Home, 
  XCircle, 
  Sparkles, 
  Droplets,
  AlertCircle
} from 'lucide-react';

export default function OrderTracker({ order }: { order: Order }) {
  const currentStatusInfo = getOrderStatusInfo(order.status);
  const isCancelled = order.status === 'cancelled';

  const steps = [
    {
      status: 'pending',
      title: 'Đã nhận đơn',
      icon: Clock,
      desc: 'Hệ thống tự động tiếp nhận'
    },
    {
      status: 'confirmed',
      title: 'Xác nhận đơn',
      icon: CheckCircle2,
      desc: 'Duyệt cá và kiểm tra sức khỏe'
    },
    {
      status: 'packing_oxygen',
      title: 'Đóng gói Bơm Oxy',
      icon: Droplets,
      desc: 'Sục oxy 99.5% & chống sốc nhiệt'
    },
    {
      status: 'shipping',
      title: 'Đang vận chuyển',
      icon: Truck,
      desc: 'Hỏa tốc đường bộ / hàng không'
    },
    {
      status: 'delivered',
      title: 'Giao thành công',
      icon: Home,
      desc: 'Khách nhận kiện hàng an toàn'
    }
  ];

  const currentStepIdx = currentStatusInfo.stepIndex;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      
      {/* Header with Order Status Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs text-slate-500 font-medium">Mã đơn hàng:</span>
          <h3 className="text-lg font-extrabold text-slate-900 font-mono">{order.orderNumber}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
            order.status === 'packing_oxygen'
              ? 'bg-teal-50 text-teal-800 border-teal-300 animate-pulse'
              : order.status === 'delivered'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : order.status === 'cancelled'
              ? 'bg-rose-50 text-rose-800 border-rose-300'
              : 'bg-blue-50 text-blue-800 border-blue-300'
          }`}>
            {currentStatusInfo.label}
          </span>
        </div>
      </div>

      {/* Special Oxygen Packing Highlight Alert */}
      {order.status === 'packing_oxygen' && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-300 shadow-xs flex items-start gap-3 animate-pulse">
          <div className="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center text-teal-700 shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-teal-900">Đang thực hiện quy trình đóng gói sinh học cao cấp</h4>
            <p className="text-xs text-teal-800/90 mt-0.5">
              Kỹ thuật viên đang sục khí Oxy y tế nồng độ 99.5%, đo kiểm độ pH và đóng 2 lớp túi nilon y tế kèm thùng xốp cách nhiệt.
            </p>
          </div>
        </div>
      )}

      {isCancelled ? (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 flex items-center gap-3">
          <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-rose-900">Đơn hàng này đã bị hủy</h4>
            <p className="text-xs text-slate-600 mt-0.5">Số lượng cá và phụ kiện đã được hoàn lại kho.</p>
          </div>
        </div>
      ) : (
        /* Visual Stepper */
        <div className="relative py-4">
          <div className="grid grid-cols-5 gap-2">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isPast = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              const isFuture = idx > currentStepIdx;

              return (
                <div key={step.status} className="flex flex-col items-center text-center relative group">
                  {/* Step Connector Line */}
                  {idx < steps.length - 1 && (
                    <div 
                      className={`absolute top-4 left-1/2 w-full h-1 -z-0 transition-colors ${
                        idx < currentStepIdx ? 'bg-teal-500' : 'bg-slate-200'
                      }`}
                    />
                  )}

                  {/* Step Circle */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all z-10 ${
                    isPast
                      ? 'bg-teal-600 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white ring-4 ring-teal-100 scale-110 shadow-md'
                      : 'bg-slate-100 border border-slate-200 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Step Title & Desc */}
                  <div className="mt-2.5">
                    <p className={`text-xs font-bold ${
                      isCurrent ? 'text-teal-700' : isPast ? 'text-teal-800' : 'text-slate-400'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-[10px] text-slate-500 hidden sm:block mt-0.5 leading-tight">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Timeline Event Log */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Nhật Ký Hành Trình</h4>
        <div className="space-y-3">
          {order.timeline.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs">
              <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{item.title}</span>
                  <span className="text-[11px] text-slate-400">{item.timestamp}</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
