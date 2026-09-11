import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth-context';
import { CartProvider } from '@/lib/cart-context';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import LiveChatWidget from '@/components/live-chat-widget';

export const metadata: Metadata = {
  title: 'GuppyVibe - Trại Cá 7 Màu Thuần Chủng & Cửa Hàng Guppy Toàn Quốc',
  description: 'Trang thương mại chuyên các dòng cá 7 màu (Guppy) thuần chủng, F1, Ribbon, BDS cờ cao, lồng ép đẻ và thức ăn artemia. Cam kết đóng gói bơm Oxy y tế 99.5%, bảo hành sống 100% khi nhận hàng.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <LiveChatWidget />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
