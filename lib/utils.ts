import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { OrderStatus, WaterType, CareLevel, SizeCategory } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
}

export function getWaterTypeLabel(type: WaterType): { label: string; color: string; bg: string } {
  switch (type) {
    case 'freshwater':
      return { label: 'Nước Ngọt', color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' };
    case 'saltwater':
      return { label: 'Nước Mặn', color: 'text-cyan-400', bg: 'bg-cyan-500/15 border-cyan-500/30' };
    case 'brackish':
      return { label: 'Nước Lợ', color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30' };
  }
}

export function getCareLevelLabel(level: CareLevel): { label: string; color: string; bg: string } {
  switch (level) {
    case 'easy':
      return { label: 'Dễ nuôi', color: 'text-green-400', bg: 'bg-green-500/15 border-green-500/30' };
    case 'medium':
      return { label: 'Trung bình', color: 'text-yellow-400', bg: 'bg-yellow-500/15 border-yellow-500/30' };
    case 'hard':
      return { label: 'Khó / Cao cấp', color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30' };
  }
}

export function getSizeLabel(size: SizeCategory): string {
  switch (size) {
    case 'small':
      return 'Nhỏ (< 5cm)';
    case 'medium':
      return 'Trung bình (5 - 15cm)';
    case 'large':
      return 'Lớn (> 15cm)';
  }
}

export function getOrderStatusInfo(status: OrderStatus): { label: string; color: string; badgeBg: string; stepIndex: number } {
  switch (status) {
    case 'pending':
      return { label: 'Chờ xác nhận', color: 'text-amber-400', badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', stepIndex: 0 };
    case 'confirmed':
      return { label: 'Đã xác nhận', color: 'text-blue-400', badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40', stepIndex: 1 };
    case 'packing_oxygen':
      return { label: 'Đóng gói Oxy sinh học', color: 'text-teal-400', badgeBg: 'bg-teal-500/25 text-teal-300 border-teal-400/50 animate-pulse', stepIndex: 2 };
    case 'shipping':
      return { label: 'Đang vận chuyển', color: 'text-indigo-400', badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40', stepIndex: 3 };
    case 'delivered':
      return { label: 'Giao thành công', color: 'text-emerald-400', badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', stepIndex: 4 };
    case 'cancelled':
      return { label: 'Đã hủy', color: 'text-rose-400', badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40', stepIndex: -1 };
  }
}
