# 🛒 Astra - E-Ticaret Platformu

**Patika.dev & NewMind Fullstack Bootcamp Bitirme Projesi**

Astra, monolitik yapıya entegre mikroservislerle geliştirilmiş modern bir e-ticaret platformudur. Proje, kullanıcı yönetimi, ürün kataloğu, sepet işlemleri, ödeme sistemi ve faturalandırma gibi temel e-ticaret özelliklerini içermektedir.

## 📋 İçindekiler

- [Proje Özellikleri](#-proje-özellikleri)
- [Kullanılan Teknolojiler](#-kullanılan-teknolojiler)
- [Mimari Şeması](#-mimari-şeması)
- [Kurulum ve Çalıştırma](#-kurulum-ve-çalıştırma)
- [API Endpoint'leri](#-api-endpointleri)
- [Proje Yapısı](#-proje-yapısı)
- [Geliştirme Ekibi](#-geliştirme-ekibi)

## ✨ Proje Özellikleri

### Backend Özellikleri
- **Kullanıcı Yönetimi**: JWT tabanlı kimlik doğrulama, kayıt, giriş, profil güncelleme
- **Ürün Yönetimi**: CRUD işlemleri, kategori ve fiyat filtreleme
- **Sepet İşlemleri**: Ürün ekleme/çıkarma, miktar güncelleme
- **Ödeme Sistemi**: Bağımsız mikroservis ile ödeme işleme
- **Faturalandırma**: Kafka event-driven faturalandırma sistemi
- **Caching**: Redis ile ürün listesi cache'leme
- **Gelişmiş Arama**: Elasticsearch ile full-text ve fuzzy search
- **Asenkron İletişim**: Kafka ile mikroservisler arası iletişim

### Frontend Özellikleri
- **Kullanıcı Arayüzü**: Modern ve responsive React arayüzü
- **Ürün Listeleme**: Filtreleme ve arama özellikleri
- **Sepet Yönetimi**: Gerçek zamanlı sepet güncellemeleri
- **Ödeme Akışı**: Kapsamlı ödeme formu ve sipariş takibi
- **Gerçek Zamanlı Bildirimler**: WebSocket ile sipariş durumu bildirimleri

## 🛠️ Kullanılan Teknolojiler

### Backend (Monolitik ve Mikroservisler)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Veritabanı**: MongoDB (Mongoose ODM)
- **Cache**: Redis
- **Arama Motoru**: Elasticsearch
- **Mesajlaşma**: Apache Kafka
- **Kimlik Doğrulama**: JWT (JSON Web Tokens)
- **Şifreleme**: bcrypt
- **HTTP Client**: Axios

### Frontend
- **Framework**: React 18
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **WebSocket**: Socket.IO Client

### DevOps/Altyapı
- **Konteynerizasyon**: Docker
- **Orkestrasyon**: Docker Compose
- **Multi-stage Build**: Optimized Docker images
- **Monitoring**: Kibana (Elasticsearch için)

## 🏗️ Mimari Şeması

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                        │
│                    http://localhost:3000                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP/REST
┌───────────────────────────▼─────────────────────────────────────┐
│                    MONOLITHIC BACKEND                            │
│                  http://localhost:5000                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Auth API   │  │ Product API  │  │   Cart API   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         │                 │                  │                  │
│         │                 │                  │                  │
│  ┌──────▼─────────────────▼──────────────────▼──────┐          │
│  │         MongoDB (User, Product, Cart)            │          │
│  └──────────────────────────────────────────────────┘          │
│         │                                                       │
│  ┌──────▼──────────────────────────────────────────┐          │
│  │         Redis (Cache Layer)                      │          │
│  └──────────────────────────────────────────────────┘          │
└───────────┬─────────────────────────────────────────────────────┘
            │ HTTP
┌───────────▼─────────────────────────────────────────────────────┐
│                    PAYMENT SERVICE                               │
│                  http://localhost:5001                           │
│  ┌──────────────────────────────────────────────────┐           │
│  │         Payment Processing                      │           │
│  └──────────────────────────────────────────────────┘           │
│                            │                                    │
│                            │ Kafka Producer                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   KAFKA        │
                    │   (Event Bus)  │
                    └────────┬────────┘
                             │ Kafka Consumer
┌────────────────────────────┼─────────────────────────────────────┐
│                    INVOICING SERVICE                             │
│                  http://localhost:5002                           │
│  ┌──────────────────────────────────────────────────┐           │
│  │         Invoice Generation                       │           │
│  └──────────────────────────────────────────────────┘           │
│                            │                                    │
│  ┌─────────────────────────▼──────────────────────┐            │
│  │    MongoDB (Invoice Collection)               │            │
│  └────────────────────────────────────────────────┘            │
└──────────────────────────────────────────────────────────────────┘
```

### Mimari Açıklamaları

1. **Monolitik Backend**: Kullanıcı, ürün ve sepet işlemlerini yönetir
2. **Payment Service**: Bağımsız ödeme işleme mikroservisi
3. **Invoicing Service**: Kafka event'lerini dinleyerek otomatik fatura oluşturur
4. **Kafka**: Mikroservisler arası asenkron iletişim sağlar
5. **Redis**: Ürün listesi için cache katmanı
6. **MongoDB**: Ana veritabanı (User, Product, Cart, Invoice)

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler

- **Node.js**: v18 veya üzeri
- **Docker**: v20 veya üzeri
- **Docker Compose**: v2 veya üzeri
- **Git**: Projeyi klonlamak için

### Adım 1: Projeyi Klonlama

```bash
git clone <repository-url>
cd Astra
```

### Adım 2: Environment Variables Ayarlama

#### Monolitik Backend (.env)

Proje kök dizininde `.env` dosyası oluşturun:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://mongodb:27017/astra
REDIS_URL=redis://redis:6379
ELASTICSEARCH_URL=http://elasticsearch:9200
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PAYMENT_SERVICE_URL=http://payment-service:5001
```

#### Payment Service (.env)

`payment-service/.env` dosyası oluşturun:

```env
PORT=5001
NODE_ENV=production
KAFKA_BROKERS=kafka:29092
```

#### Invoicing Service (.env)

`invoicing-service/.env` dosyası oluşturun:

```env
PORT=5002
NODE_ENV=production
MONGODB_URI=mongodb://mongodb:27017/astra-invoicing
KAFKA_BROKERS=kafka:29092
```

#### Frontend (.env)

`frontend/.env` dosyası oluşturun (opsiyonel):

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Adım 3: Docker ile Tüm Servisleri Başlatma

Tüm servisleri (MongoDB, Redis, Kafka, Zookeeper ve tüm Node.js servisleri) tek komutla başlatın:

```bash
docker-compose up --build
```

Bu komut:
- Tüm Docker image'larını oluşturur
- MongoDB, Redis, Kafka, Zookeeper container'larını başlatır
- Monolitik backend, payment-service ve invoicing-service'i başlatır
- Tüm servisler arasındaki bağımlılıkları yönetir

### Adım 4: Frontend'i Başlatma (Ayrı Terminal)

Yeni bir terminal penceresi açın ve frontend'i başlatın:

```bash
cd frontend
npm install
npm run dev
```

### Adım 5: Servis Erişim URL'leri

Tüm servisler başlatıldıktan sonra:

- **Frontend**: http://localhost:3000
- **Monolitik Backend API**: http://localhost:5000
- **Payment Service**: http://localhost:5001
- **Invoicing Service**: http://localhost:5002
- **MongoDB**: localhost:27019
- **Redis**: localhost:6380
- **Kafka**: localhost:9092
- **Elasticsearch**: http://localhost:9200
- **Kibana**: http://localhost:5601

### Adım 6: Servisleri Durdurma

```bash
docker-compose down
```

Verileri de silmek için:

```bash
docker-compose down -v
```

## 📡 API Endpoint'leri

### Authentication Endpoints

#### Kullanıcı Kaydı
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Kullanıcı Adı",
  "email": "kullanici@example.com",
  "password": "sifre123"
}
```

#### Kullanıcı Girişi
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "kullanici@example.com",
  "password": "sifre123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Giriş başarılı",
  "data": {
    "user": {
      "id": "user_id",
      "name": "Kullanıcı Adı",
      "email": "kullanici@example.com"
    },
    "token": "jwt_token_here"
  }
}
```

#### Profil Güncelleme (Protected)
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Yeni İsim",
  "email": "yeni@example.com",
  "password": "yeni_sifre" // Opsiyonel
}
```

### Product Endpoints

#### Tüm Ürünleri Listele
```http
GET /api/products
```

#### Ürün Detayı
```http
GET /api/products/:id
```

#### Ürün Oluştur (Protected)
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Ürün Adı",
  "description": "Ürün açıklaması",
  "price": 99.99,
  "imageUrl": "https://example.com/image.jpg",
  "category": "Elektronik"
}
```

#### Ürün Güncelle (Protected)
```http
PUT /api/products/:id
Authorization: Bearer <token>
```

#### Ürün Sil (Protected)
```http
DELETE /api/products/:id
Authorization: Bearer <token>
```

### Cart Endpoints

#### Sepeti Getir (Protected)
```http
GET /api/cart
Authorization: Bearer <token>
```

#### Sepete Ürün Ekle (Protected)
```http
POST /api/cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id",
  "quantity": 2
}
```

#### Sepetten Ürün Çıkar (Protected)
```http
DELETE /api/cart/items/:productId
Authorization: Bearer <token>
```

#### Sepeti Temizle (Protected)
```http
DELETE /api/cart
Authorization: Bearer <token>
```

#### Ödeme İşlemi (Protected)
```http
POST /api/cart/checkout
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentMethod": "credit_card"
}
```

### Payment Service Endpoints

#### Ödeme İşle
```http
POST /api/payments/process
Content-Type: application/json

{
  "orderId": "ORDER-123",
  "amount": 199.99,
  "userId": "user_id",
  "paymentMethod": "credit_card"
}
```

### Invoicing Service Endpoints

#### Tüm Faturaları Listele
```http
GET /api/invoices
```

#### Fatura Detayı
```http
GET /api/invoices/:id
```

#### Kullanıcı Faturaları
```http
GET /api/invoices/user/:userId
```

### Search Endpoints

#### Gelişmiş Ürün Arama
```http
GET /api/search?q=laptop&category=Elektronik&minPrice=1000&maxPrice=5000&page=1&limit=20
```

**Query Parameters:**
- `q`: Arama terimi (opsiyonel)
- `category`: Kategori filtresi (opsiyonel)
- `minPrice`: Minimum fiyat (opsiyonel)
- `maxPrice`: Maximum fiyat (opsiyonel)
- `page`: Sayfa numarası (varsayılan: 1)
- `limit`: Sayfa başına sonuç (varsayılan: 20)

**Response:**
```json
{
  "success": true,
  "message": "Arama sonuçları getirildi",
  "data": [
    {
      "_id": "product_id",
      "name": "Ürün Adı",
      "description": "Açıklama",
      "price": 199.99,
      "category": "Elektronik",
      "score": 2.5
    }
  ],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

#### Ürün Önerileri (Autocomplete)
```http
GET /api/search/suggest?q=lap
```

## 📁 Proje Yapısı

```
Astra/
├── config/                 # Yapılandırma dosyaları
│   └── index.js           # MongoDB ve Redis bağlantıları
├── controllers/            # Controller katmanı
│   ├── authController.js
│   ├── cartController.js
│   └── productController.js
├── middlewares/            # Middleware'ler
│   ├── auth.js           # JWT doğrulama
│   └── error.js          # Hata yönetimi
├── models/                # Mongoose modelleri
│   ├── User.js
│   ├── Product.js
│   └── Cart.js
├── routes/                 # Route tanımları
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── searchRoutes.js
├── services/               # Servis katmanı
│   └── paymentService.js  # Payment service entegrasyonu
├── utils/                  # Yardımcı fonksiyonlar
│   └── errorCodes.js     # Hata kodları
├── seeds/                  # Seed script'leri
│   └── indexProducts.js  # Elasticsearch toplu indeksleme
├── seeds/                  # Seed script'leri
│   └── indexProducts.js  # Elasticsearch toplu indeksleme
├── payment-service/        # Ödeme mikroservisi
│   ├── config/
│   │   └── kafka.js
│   ├── controllers/
│   │   └── paymentController.js
│   ├── routes/
│   │   └── paymentRoutes.js
│   └── server.js
├── invoicing-service/      # Faturalandırma mikroservisi
│   ├── config/
│   │   ├── db.js
│   │   └── kafka.js
│   ├── controllers/
│   │   └── invoiceController.js
│   ├── models/
│   │   └── Invoice.js
│   ├── routes/
│   │   └── invoiceRoutes.js
│   └── server.js
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React bileşenleri
│   │   ├── pages/        # Sayfa bileşenleri
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API servisleri
│   │   └── App.jsx
│   └── package.json
├── docker-compose.yml      # Docker Compose yapılandırması
├── Dockerfile             # Monolitik backend Dockerfile
└── package.json
```

## 🔐 Güvenlik

- JWT tabanlı kimlik doğrulama
- bcrypt ile şifre hash'leme
- Protected route'lar için middleware
- CORS yapılandırması
- Environment variables ile hassas bilgi yönetimi

## 🧪 Test Senaryoları

Detaylı test senaryoları için [TESTING.md](./TESTING.md) dosyasına bakın.

### Hızlı Test Kontrol Listesi

1. ✅ **Kullanıcı Kayıt ve Giriş**: Frontend'de kayıt ol, giriş yap, token kontrolü
2. ✅ **Ürün İşlemleri**: Listeleme (Redis cache), CRUD işlemleri
3. ✅ **Sepet İşlemleri**: Ekleme, çıkarma, miktar güncelleme, toplam hesaplama
4. ✅ **Ödeme Akışı**: Checkout, payment service çağrısı, Kafka event
5. ✅ **Mikroservis İletişimi**: Payment → Kafka → Invoicing akışı
6. ✅ **Elasticsearch Arama**: Gelişmiş arama, fuzzy search, filtreleme
7. ✅ **Hata Yönetimi**: Geçersiz token, bulunamayan kaynak, validasyon hataları
8. ✅ **Docker Servisleri**: Tüm container'ların sağlıklı çalışması

## 🐛 Sorun Giderme

### MongoDB Bağlantı Hatası
```bash
# MongoDB container'ının çalıştığını kontrol edin
docker ps | grep mongodb

# MongoDB loglarını kontrol edin
docker logs mongodb
```

### Redis Bağlantı Hatası
```bash
# Redis container'ının çalıştığını kontrol edin
docker ps | grep redis

# Redis'e bağlanmayı test edin
docker exec -it redis redis-cli ping
```

### Kafka Bağlantı Hatası
```bash
# Kafka ve Zookeeper container'larını kontrol edin
docker ps | grep kafka
docker ps | grep zookeeper

# Kafka topic'lerini listeleyin
docker exec -it kafka kafka-topics --list --bootstrap-server localhost:9092
```

### Elasticsearch Bağlantı Hatası
```bash
# Elasticsearch container'ının çalıştığını kontrol edin
docker ps | grep elasticsearch

# Elasticsearch health kontrolü
curl http://localhost:9200/_cluster/health

# Kibana container'ını kontrol edin
docker ps | grep kibana
docker logs kibana
```

### Port Çakışması
Eğer portlar kullanılıyorsa, `docker-compose.yml` dosyasındaki port mapping'leri değiştirin.

## 📝 Notlar

- Production ortamında `JWT_SECRET` değerini güvenli bir şekilde yönetin
- MongoDB, Redis ve Elasticsearch verileri Docker volume'larında saklanır
- Kafka topic'leri otomatik oluşturulur (`KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true"`)
- Elasticsearch index'i uygulama başlangıcında otomatik oluşturulur
- Mevcut ürünleri Elasticsearch'e indekslemek için: `npm run seed:products`
- Frontend development modunda hot-reload aktif
- Elasticsearch bağlantısı başarısız olsa bile uygulama çalışmaya devam eder (graceful degradation)

## 👥 Geliştirme Ekibi

**Geliştirici**: [Nur Bülbül]


## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.


