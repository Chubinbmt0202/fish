import { Product, BlogPost, PromoCode, Review } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Cá Rồng Huyết Long (Super Red Arowana)',
    slug: 'ca-rong-huyet-long-super-red',
    category: 'fish',
    categoryName: 'Cá Cảnh Cao Cấp',
    price: 12500000,
    originalPrice: 15000000,
    stock: 3,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80'
    ],
    waterType: 'freshwater',
    careLevel: 'hard',
    size: 'large',
    sizeText: '25 - 30 cm',
    temperature: '26 - 30°C',
    ph: '6.5 - 7.5',
    origin: 'Kalimantan, Indonesia (Kèm Chip & CITES)',
    description: 'Cá Rồng Huyết Long đẳng cấp bậc nhất, vảy ánh kim đỏ rực rỡ, body chuẩn đuôi quạt càng dài. Biểu tượng của tài lộc, vượng khí phong thủy cho gia chủ.',
    features: ['Có chip định danh và giấy chứng nhận CITES quốc tế', 'Đã thuần hóa ăn sâu canxi và tôm đông lạnh', 'Bảo hành sống 100% khi nhận hàng kèm đóng gói oxy 48h'],
    rating: 4.9,
    reviewCount: 18,
    isFeatured: true,
    isNew: true,
  },
  {
    id: 'prod-2',
    name: 'Cá Dĩa Heckel Xanh Hoàng Gia (Discus Fish)',
    slug: 'ca-dia-heckel-xanh-hoang-gia',
    category: 'fish',
    categoryName: 'Cá Cảnh Nước Ngọt',
    price: 850000,
    originalPrice: 980000,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80'
    ],
    waterType: 'freshwater',
    careLevel: 'medium',
    size: 'medium',
    sizeText: '8 - 10 cm',
    temperature: '28 - 31°C',
    ph: '6.0 - 6.8',
    origin: 'Amazon Basin',
    description: 'Được mệnh danh là "Nhất Đại Mỹ Ngư" của dòng nước ngọt, thân đĩa tròn hoàn hảo với các sọc vân xanh sapphire phát quang quyến rũ.',
    features: ['Dáng tròn, mắt đỏ, không khuyết tật vây', 'Thích hợp nuôi hồ biotop nước mềm', 'Ăn tốt tim bò đông lạnh và cám dĩa'],
    rating: 4.8,
    reviewCount: 32,
    isFeatured: true,
  },
  {
    id: 'prod-3',
    name: 'Cá Betta Halfmoon Koi Galaxy Siêu Phẩm',
    slug: 'ca-betta-halfmoon-koi-galaxy',
    category: 'fish',
    categoryName: 'Cá Betta & Thủy Sinh',
    price: 250000,
    originalPrice: 320000,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80'
    ],
    waterType: 'freshwater',
    careLevel: 'easy',
    size: 'small',
    sizeText: '4 - 5 cm',
    temperature: '24 - 29°C',
    ph: '6.5 - 7.5',
    origin: 'Việt Nam Breeder Champion',
    description: 'Cá Betta đực đuôi xòe 180 độ Halfmoon tuyệt mỹ, mảng màu đốm vảy ánh kim galaxy lấp lánh như dải ngân hà. Cực kỳ dễ chăm sóc.',
    features: ['Cá độc bản (mỗi con là một mẫu hoa văn duy nhất)', 'Tặng kèm hũ thức ăn viên cao cấp', 'Rất khỏe, thích hợp để bàn làm việc'],
    rating: 5.0,
    reviewCount: 45,
    isFeatured: true,
  },
  {
    id: 'prod-4',
    name: 'Cá Neon Vua (Cardinal Tetra) - Đàn 10 Con',
    slug: 'ca-neon-vua-cardinal-tetra-dan-10-con',
    category: 'fish',
    categoryName: 'Cá Bầy Thủy Sinh',
    price: 150000,
    originalPrice: 180000,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80'
    ],
    waterType: 'freshwater',
    careLevel: 'easy',
    size: 'small',
    sizeText: '2.5 - 3 cm',
    temperature: '23 - 28°C',
    ph: '5.5 - 7.0',
    origin: 'Nam Mỹ',
    description: 'Neon Vua với vệt sọc đỏ chạy dài suốt bụng từ đầu đến đuôi, bơi theo đàn đồng điệu tạo nên hiệu ứng thị giác kỳ ảo trong hồ thủy sinh rậm rạp.',
    features: ['Bơi theo đàn đẹp mắt', 'Thân thiện tuyệt đối với tép và cây thủy sinh', 'Đóng combo 10 con tiện lợi'],
    rating: 4.7,
    reviewCount: 88,
    isFeatured: false,
  },
  {
    id: 'prod-5',
    name: 'Cá Hề Ocellaris Nemo Nước Mặn',
    slug: 'ca-he-ocellaris-nemo-nuoc-man',
    category: 'fish',
    categoryName: 'Cá Nước Mặn (San Hô)',
    price: 190000,
    originalPrice: 240000,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
    ],
    waterType: 'saltwater',
    careLevel: 'medium',
    size: 'small',
    sizeText: '4 - 6 cm',
    temperature: '24 - 27°C',
    ph: '8.1 - 8.4 (Độ mặn 1.023 - 1.025)',
    origin: 'Biển Nha Trang / Nuôi cấy nhân tạo F1',
    description: 'Chú cá hề Nemo kinh điển màu cam rực rỡ với 3 dải sọc trắng viền đen. Đã thuần thức ăn công nghiệp, cộng sinh hoàn hảo với hải quỳ.',
    features: ['Cá captive-bred (sinh sản nhân tạo) siêu khỏe', 'Tương thích 100% với bể san hô reef', 'Tính tình hiền lành, năng động'],
    rating: 4.9,
    reviewCount: 56,
    isFeatured: true,
  },
  {
    id: 'prod-6',
    name: 'Cá Bắp Nẻ Xanh (Blue Tang - Dory)',
    slug: 'ca-bap-ne-xanh-blue-tang',
    category: 'fish',
    categoryName: 'Cá Nước Mặn (San Hô)',
    price: 650000,
    originalPrice: 750000,
    stock: 6,
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=800&q=80'
    ],
    waterType: 'saltwater',
    careLevel: 'hard',
    size: 'medium',
    sizeText: '7 - 10 cm',
    temperature: '24 - 26°C',
    ph: '8.2 - 8.4',
    origin: 'Ấn Độ Dương - Thái Bình Dương',
    description: 'Blue Tang xanh biếc với đuôi vàng tươi tắn. Loài cá bơi lội thanh thoát, chuyên chăm chỉ dọn rêu hại trong các hồ san hô lớn.',
    features: ['Màu xanh lam óng ả tuyệt đẹp', 'Ăn rong tảo và thức ăn hạt rong biển', 'Cần bể nước mặn dung tích từ 250L trở lên'],
    rating: 4.6,
    reviewCount: 19,
  },
  {
    id: 'prod-7',
    name: 'Combo 20 Tép Cảnh Red Cherry Cực Đỏ',
    slug: 'combo-20-tep-canh-red-cherry',
    category: 'shrimp_snail',
    categoryName: 'Tép & Ốc Thủy Sinh',
    price: 120000,
    originalPrice: 160000,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=800&q=80'
    ],
    waterType: 'freshwater',
    careLevel: 'easy',
    size: 'small',
    sizeText: '1.2 - 1.8 cm',
    temperature: '22 - 27°C',
    ph: '6.5 - 7.5',
    origin: 'Việt Nam',
    description: 'Tép đỏ Red Cherry màu lên chuẩn như quả ớt chín. Chuyên gia ăn rêu nhớt, thức ăn thừa dưới đáy hồ, sinh sản nhanh trong môi trường thủy sinh.',
    features: ['Màu đỏ đồng đều cả đực và cái', 'Tỉ lệ sống cực cao, sinh sản tốt', 'Giúp hồ luôn trong vắt và sạch rêu'],
    rating: 4.8,
    reviewCount: 94,
    isFeatured: true,
  },
  {
    id: 'prod-8',
    name: 'Cây Thủy Sinh Bucephalandra Ghost 2011 (Gắn Giá Thể)',
    slug: 'cay-thuy-sinh-bucephalandra-ghost-2011',
    category: 'plants',
    categoryName: 'Cây Thủy Sinh Cao Cấp',
    price: 450000,
    originalPrice: 550000,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80'
    ],
    waterType: 'freshwater',
    careLevel: 'medium',
    size: 'small',
    sizeText: '5 - 7 cm (Bụi 6-8 lá)',
    temperature: '22 - 26°C',
    ph: '6.0 - 7.0',
    origin: 'Borneo, Indonesia',
    description: 'Dòng Bucep Ghost huyền thoại với lá ánh tím than nhũ bạc sang trọng. Phát triển chậm trên giá thể đá nham thạch hoặc lũa.',
    features: ['Cây cạn đã ươm hạ thủy ổn định 100%', 'Lên màu tím ma mị dưới ánh sáng WRGB', 'Không cần cắm nền, chỉ cần dán lũa/đá'],
    rating: 5.0,
    reviewCount: 27,
    isFeatured: true,
  },
  {
    id: 'prod-9',
    name: 'Đèn Thủy Sinh Chihiros WRGB II Pro 60cm',
    slug: 'den-thuy-sinh-chihiros-wrgb-ii-pro-60cm',
    category: 'accessories',
    categoryName: 'Đèn & Thiết Bị Ánh Sáng',
    price: 3450000,
    originalPrice: 3800000,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80'
    ],
    waterType: 'freshwater',
    careLevel: 'easy',
    size: 'medium',
    sizeText: '60 cm',
    origin: 'Chihiros Aquatic Studio',
    description: 'Đỉnh cao đèn thủy sinh chuyên dụng, quang phổ 4 kênh WRGB tái tạo màu sắc cây và cá rực rỡ nhất. Điều khiển bluetooth qua app thông minh.',
    features: ['Quản lý hẹn giờ bình minh/hoàng hôn mượt mà', 'Công suất 74W, quang thông 5630lm', 'Bảo hành chính hãng 12 tháng'],
    rating: 4.9,
    reviewCount: 41,
  },
  {
    id: 'prod-10',
    name: 'Lọc Thùng Cao Cấp Eheim Classic 250 (2213)',
    slug: 'loc-thung-eheim-classic-250',
    category: 'accessories',
    categoryName: 'Hệ Thống Lọc & Bơm',
    price: 1890000,
    originalPrice: 2150000,
    stock: 7,
    image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80'
    ],
    waterType: 'freshwater',
    careLevel: 'easy',
    size: 'medium',
    origin: 'Germany (Đức)',
    description: 'Huyền thoại lọc thùng của Đức vận hành êm ái tuyệt đối 24/7, tiết kiệm điện, độ bền trên 10 năm với khoang chứa vật liệu lọc tối ưu.',
    features: ['Tặng kèm trọn bộ vật liệu lọc Substrat Pro & Mech', 'Độ ồn gần như bằng 0 (dưới 20dB)', 'Công suất bơm 440 L/h cực kỳ ổn định'],
    rating: 5.0,
    reviewCount: 38,
  }
];

export const PROMO_CODES: PromoCode[] = [
  {
    code: 'AQUAVIBE10',
    discountPercent: 10,
    maxDiscount: 500000,
    minOrder: 300000,
    description: 'Giảm 10% tối đa 500k cho đơn từ 300k'
  },
  {
    code: 'FREESHIP',
    discountPercent: 5,
    maxDiscount: 40000,
    minOrder: 200000,
    description: 'Hỗ trợ phí vận chuyển đóng oxy 40k'
  },
  {
    code: 'VIPAQUA',
    discountPercent: 15,
    maxDiscount: 1000000,
    minOrder: 1000000,
    description: 'Ưu đãi thành viên VIP giảm 15% cho đơn lớn'
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Quy Trình Đóng Gói Oxy Chuyên Dụng Vận Chuyển Cá Sống Toàn Quốc',
    slug: 'quy-trinh-dong-goi-oxy-ca-song-an-toan',
    excerpt: 'Tìm hiểu công nghệ đóng gói cá sống 2 lớp túi nilon y tế, sục khí Oxy nguyên chất 99% và thùng xốp cách nhiệt đảm bảo cá khỏe 48 tiếng.',
    content: `
# Tại sao quy trình đóng gói cá cảnh lại quyết định 90% tỉ lệ sống?

Tại **AquaVibe**, chúng tôi áp dụng quy chuẩn nghiêm ngặt hàng đầu Đông Nam Á đối với tất cả đơn hàng giao xa:

### 1. Khâu nhịn ăn và dưỡng cá (Conditioning)
Trước khi gửi 24 giờ, cá được cho nhịn ăn để ruột sạch, tránh xả phân làm độc nước (giảm tích tụ Amoniac $NH_3$ và $NO_2$).

### 2. Dung dịch nước dưỡng sinh học
Nước đóng túi được pha chế khoáng biển vi lượng, lá bàng lên men tự nhiên và dung dịch kháng khuẩn giúp cá chống sốc nhiệt và giảm stress tối đa.

### 3. Sục khí Oxy y tế nồng độ 99.5%
Tỉ lệ nước và khí trong túi luôn được giữ chuẩn xác: **1/3 Nước - 2/3 Khí Oxy nguyên chất**, sau đó hàn nhiệt 2 lớp và buộc dây chun kép chịu lực.

### 4. Thùng xốp cách nhiệt & Gel giữ nhiệt
Tùy thuộc vào thời tiết mùa hè hay mùa đông, thùng xốp dày 3cm được chèn túi gel lạnh hoặc túi sưởi ấm để duy trì dải nhiệt độ lý tưởng $25 - 28^\\circ C$.

> **Cam kết của AquaVibe:** Đền bù 100% hoặc gửi bù cá mới nếu phát sinh rủi ro trong quá trình vận chuyển!
    `,
    coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    author: 'Master Thủy Sinh Hoàng Long',
    category: 'Cẩm Nang Vận Hành',
    date: '2026-03-01',
    readTime: '4 phút đọc'
  },
  {
    id: 'blog-2',
    title: 'Hướng Dẫn Setup Hồ Thủy Sinh Cho Người Mới Bắt Đầu (A-Z)',
    slug: 'huong-dan-setup-ho-thuy-sinh-cho-nguoi-moi',
    excerpt: 'Các bước chuẩn bị phân nền, lũa đá, trồng cây, chu trình vi sinh Nitrat hóa (Cycling) trước khi thả cá cảnh an toàn.',
    content: `
# Bắt đầu với thú chơi thủy sinh thư thái

Nuôi cá và trồng cây thủy sinh mang lại cảm giác bình yên, cân bằng năng lượng sau những giờ làm việc căng thẳng.

### Bước 1: Chọn kích thước hồ và vị trí
Nên chọn hồ kích thước 50x30x30cm hoặc 60x40x40cm dùng kính siêu trong (Ultra-Clear) dán dấu keo thẩm mỹ.

### Bước 2: Setup layout nền và hardscape
Trải cốt nền dinh dưỡng, phủ phân nền công nghiệp (như Gex, Amazonia). Xếp đá da voi hoặc lũa săn tìm tạo bố cục Tam Giác hoặc Chữ U.

### Bước 3: Chạy chu trình vi sinh (Cycle hồ)
Đây là bước quan trọng nhất! Chạy lọc và sủi khí liên tục từ 7 - 14 ngày kết hợp châm vi sinh sống để thiết lập hệ vi khuẩn chuyển hóa độc tố trước khi thả cá.
    `,
    coverImage: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
    author: 'AquaVibe Team',
    category: 'Hướng Dẫn Setup',
    date: '2026-02-20',
    readTime: '6 phút đọc'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userName: 'Trần Minh Quang (Hà Nội)',
    rating: 5,
    comment: 'Cá Rồng nhận được cực kỳ khỏe mạnh! Đóng thùng xốp oxy cẩn thận, mở ra cá bơi lội xung mãn, vảy ánh kim rất nét. Giấy CITES đầy đủ.',
    date: '2026-03-05',
    verifiedPurchase: true,
  },
  {
    id: 'rev-2',
    productId: 'prod-3',
    userName: 'Nguyễn Thị Thu Trang',
    rating: 5,
    comment: 'Bé Betta đuôi Halfmoon xòe to tuyệt đẹp, màu galaxy lấp lánh như hình. Shop tư vấn rất nhiệt tình qua khung chat!',
    date: '2026-03-06',
    verifiedPurchase: true,
  },
  {
    id: 'rev-3',
    productId: 'prod-5',
    userName: 'Lê Hoàng Hải',
    rating: 5,
    comment: 'Cặp cá hề Nemo bơi cùng hải quỳ cực dễ thương, ăn cám hạt ngon lành. Đóng gói oxy rất chuyên nghiệp.',
    date: '2026-03-07',
    verifiedPurchase: true,
  }
];
