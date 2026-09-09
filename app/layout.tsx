import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth-context';
import { CartProvider } from '@/lib/cart-context';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import LiveChatWidget from '@/components/live-chat-widget';

export const metadata: Metadata = {
  title: 'AquaVibe - Cửa Hàng Thủy Sinh & Cá Cảnh Cao Cấp Toàn Quốc',
  description: 'Nền tảng thương mại điện tử chuyên cung cấp cá cảnh cao cấp, tép kiểng, cây thủy sinh và phụ kiện. Cam kết đóng gói bơm Oxy y tế 99.5%, bảo hành sống 100% toàn quốc.',
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
