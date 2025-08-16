# Sacrel - Medusa E-ticaret Storefront

Modern ve şık bir e-ticaret deneyimi sunan Nuxt.js tabanlı Medusa storefront uygulaması.

## Özellikler

- **🛍️ Medusa E-ticaret Entegrasyonu**: Tam Medusa v2 backend entegrasyonu
- **🎨 Modern UI/UX**: Tailwind CSS ile responsive tasarım
- **🔍 Ürün Yönetimi**: Dinamik ürün listeleme, filtreleme ve arama
- **🛒 Sepet Yönetimi**: Pinia ile state management
- **💳 Ödeme Sistemi**: Checkout flow ve sipariş yönetimi
- **👤 Kullanıcı Yönetimi**: Kayıt, giriş, profil yönetimi
- **❤️ Favori Sistem**: Ürünleri favorilere ekleme
- **📱 Responsive Tasarım**: Mobil uyumlu modern arayüz
- **🔒 Güvenlik**: Auth middleware ve route protection
- **⚡ SEO Optimizasyonu**: Nuxt.js built-in SEO özellikleri
- **📝 TypeScript Desteği**: Tam type safety

## Teknolojiler

- **Frontend**: Nuxt.js 4.x, Vue.js 3
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **E-ticaret Backend**: Medusa.js v2
- **Icons**: Nuxt Icon
- **Language**: TypeScript

## Kurulum

### Gereksinimler

- Node.js 18+ 
- pnpm (önerilen)
- Medusa backend server v2

### Adımlar

1. Repository'yi klonlayın
```bash
git clone <repo-url>
cd sacrel-medusa-storefront
```

2. Bağımlılıkları yükleyin
```bash
pnpm install
```

3. Environment dosyasını oluşturun
```bash
cp .env.example .env
```

4. Environment değişkenlerini düzenleyin
```bash
# .env
NUXT_PUBLIC_MEDUSA_URL=http://localhost:9000
NUXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=your_publishable_key
```

5. Development server'ı başlatın
```bash
pnpm dev
```

## Proje Yapısı

```
├── components/           # Vue bileşenler
│   ├── Banner.vue        # Ana sayfa banner
│   ├── Footer.vue        # Footer bileşeni
│   ├── Navbar.vue        # Navigation bar
│   ├── ProductCard.vue   # Ürün kartı
│   └── ...
├── composables/          # Vue composables  
│   ├── useAuth.ts        # Auth işlemleri
│   ├── useCart.ts        # Sepet işlemleri
│   ├── useProducts.ts    # Ürün işlemleri
│   └── useCategories.ts  # Kategori işlemleri
├── layouts/              # Nuxt layouts
│   └── default.vue       # Varsayılan layout
├── middleware/           # Route middleware
│   └── auth.ts           # Authentication middleware
├── pages/                # Nuxt sayfalar
│   ├── index.vue         # Ana sayfa
│   ├── login.vue         # Giriş sayfası
│   ├── register.vue      # Kayıt sayfası
│   ├── profile.vue       # Profil sayfası
│   ├── cart.vue          # Sepet sayfası
│   ├── checkout.vue      # Ödeme sayfası
│   ├── favorites.vue     # Favoriler sayfası
│   ├── orders.vue        # Siparişler sayfası
│   └── products/         # Ürün sayfaları
│       ├── index.vue     # Ürün listesi
│       └── [id].vue      # Ürün detay
├── stores/               # Pinia stores
│   ├── auth.ts           # Kimlik doğrulama
│   ├── cart.ts           # Sepet yönetimi
│   ├── checkout.ts       # Ödeme süreci
│   └── favorites.ts      # Favori ürünler
├── assets/               # Statik varlıklar
│   └── css/
│       └── tailwind.css  # Tailwind stilleri
└── public/               # Public dosyalar
    └── images/           # Resim dosyaları
```

## Kullanım

### Auth Sistemi

Kullanıcı kayıt, giriş ve profil yönetimi:

```vue
<script setup>
import { useAuth } from '~/composables/useAuth'

const { login, register, logout, customer, isAuthenticated } = useAuth()

// Giriş yapma
await login('email@example.com', 'password')

// Kayıt olma
await register({
  first_name: 'Ad',
  last_name: 'Soyad',
  email: 'email@example.com',
  password: 'password'
})
</script>
```

### Sepet Yönetimi

```vue
<script setup>
const cartStore = useCartStore()

// Ürün ekleme
await cartStore.addItem('variant_id', 2)

// Ürün güncelleme
await cartStore.updateItem('line_item_id', 3)

// Ürün silme
await cartStore.removeItem('line_item_id')
</script>
```

### Ürün İşlemleri

```vue
<script setup>
const { getProducts, getProduct, searchProducts } = useProducts()

// Ürün listesi
const { products } = await getProducts({ limit: 12 })

// Tek ürün
const product = await getProduct('product_id')

// Ürün arama
const { products } = await searchProducts('arama terimi')
</script>
```

## API Entegrasyonu

Medusa v2 API'si ile entegrasyon:

- Store API endpoints kullanılır
- Automatic error handling
- Type-safe responses
- Session management

## Deployment

### Build

```bash
pnpm build
```

### Vercel

```bash
pnpm build
# Vercel'e deploy
```

### Netlify

```bash
pnpm generate
# Netlify'a deploy
```

## Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## API Entegrasyonu

- Ürün listeleme, detay ve arama
- Sepet yönetimi (ekleme, güncelleme, silme)
- Checkout flow ve sipariş tamamlama

**Sacrel** - Modern moda, modern teknoloji 🚀
