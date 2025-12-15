# 🧪 Test Senaryoları ve Kontrol Listesi

Bu doküman, projenin kritik akışlarının test edilmesi için adım adım talimatlar içermektedir.

## Ön Hazırlık

1. Tüm servisleri başlatın:
```bash
docker-compose up --build
```

2. Frontend'i başlatın (ayrı terminal):
```bash
cd frontend
npm install
npm run dev
```

3. Mevcut ürünleri Elasticsearch'e indeksleyin:
```bash
npm run seed:products
```

## Test Senaryoları

### 1. Kullanıcı Kayıt ve Giriş Testi

#### 1.1 Kullanıcı Kaydı
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Kullanıcı",
    "email": "test@example.com",
    "password": "test123456"
  }'
```

**Beklenen Sonuç:**
- Status: 201
- `success: true`
- `token` döndürülmeli
- Kullanıcı bilgileri döndürülmeli

#### 1.2 Kullanıcı Girişi
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```

**Beklenen Sonuç:**
- Status: 200
- `success: true`
- `token` döndürülmeli

#### 1.3 Geçersiz Giriş
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "yanlis_sifre"
  }'
```

**Beklenen Sonuç:**
- Status: 401
- `code: "AUTH_004"`
- `message: "E-posta veya şifre hatalı."`

### 2. Ürün İşlemleri Testi

#### 2.1 Ürün Listeleme (Cache Kontrolü)
```bash
# İlk istek - MongoDB'den gelecek
curl http://localhost:5000/api/products

# İkinci istek - Redis cache'den gelecek
curl http://localhost:5000/api/products
```

**Beklenen Sonuç:**
- İlk istek: `"Ürünler başarıyla getirildi"`
- İkinci istek: `"Ürünler cache'den getirildi"`

#### 2.2 Ürün Oluşturma (JWT Gerekli)
```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Ürünü",
    "description": "Test açıklaması",
    "price": 99.99,
    "imageUrl": "https://example.com/image.jpg",
    "category": "Test"
  }'
```

**Beklenen Sonuç:**
- Status: 201
- Ürün oluşturulmalı
- Elasticsearch'e indekslenmeli (Kibana'dan kontrol edin)

#### 2.3 Ürün Güncelleme
```bash
PRODUCT_ID="product_id_here"

curl -X PUT http://localhost:5000/api/products/$PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Güncellenmiş Ürün",
    "price": 149.99
  }'
```

**Beklenen Sonuç:**
- Status: 200
- Ürün güncellenmeli
- Elasticsearch'te güncellenmeli

#### 2.4 Ürün Silme
```bash
curl -X DELETE http://localhost:5000/api/products/$PRODUCT_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Beklenen Sonuç:**
- Status: 200
- Ürün silinmeli
- Elasticsearch'ten silinmeli

### 3. Sepet İşlemleri Testi

#### 3.1 Sepete Ürün Ekleme
```bash
curl -X POST http://localhost:5000/api/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "productId": "product_id_here",
    "quantity": 2
  }'
```

**Beklenen Sonuç:**
- Status: 200
- Sepete ürün eklenmeli
- `totalAmount` doğru hesaplanmalı

#### 3.2 Sepeti Görüntüleme
```bash
curl http://localhost:5000/api/cart \
  -H "Authorization: Bearer $TOKEN"
```

**Beklenen Sonuç:**
- Status: 200
- Sepet içeriği döndürülmeli
- Toplam tutar doğru olmalı

#### 3.3 Sepetten Ürün Çıkarma
```bash
curl -X DELETE http://localhost:5000/api/cart/items/$PRODUCT_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Beklenen Sonuç:**
- Status: 200
- Ürün sepetten çıkarılmalı
- Toplam tutar güncellenmeli

### 4. Ödeme ve Mikroservis İletişimi Testi

#### 4.1 Ödeme İşlemi
```bash
curl -X POST http://localhost:5000/api/cart/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "paymentMethod": "credit_card"
  }'
```

**Beklenen Sonuç:**
- Status: 200
- Payment service'e istek gönderilmeli
- Kafka'ya `payment_completed` event'i gönderilmeli
- Sepet temizlenmeli

#### 4.2 Fatura Kontrolü
```bash
# Invoicing service'den faturaları kontrol et
curl http://localhost:5002/api/invoices
```

**Beklenen Sonuç:**
- Yeni oluşturulan fatura görünmeli
- Fatura bilgileri doğru olmalı

### 5. Elasticsearch Arama Testi

#### 5.1 Basit Arama
```bash
curl "http://localhost:5000/api/search?q=laptop"
```

**Beklenen Sonuç:**
- Status: 200
- İlgili ürünler döndürülmeli
- Relevance score gösterilmeli

#### 5.2 Gelişmiş Arama (Filtrelerle)
```bash
curl "http://localhost:5000/api/search?q=telefon&category=Elektronik&minPrice=1000&maxPrice=5000&page=1&limit=10"
```

**Beklenen Sonuç:**
- Status: 200
- Filtrelenmiş sonuçlar döndürülmeli
- Sayfalama bilgisi gösterilmeli

#### 5.3 Fuzzy Search Testi
```bash
# Yazım hatası ile arama
curl "http://localhost:5000/api/search?q=lapotp"
```

**Beklenen Sonuç:**
- "laptop" ile ilgili sonuçlar döndürülmeli (fuzzy matching)

#### 5.4 Öneri (Autocomplete) Testi
```bash
curl "http://localhost:5000/api/search/suggest?q=lap"
```

**Beklenen Sonuç:**
- Status: 200
- En fazla 5 öneri döndürülmeli

### 6. Hata Senaryoları Testi

#### 6.1 Geçersiz JWT Token
```bash
curl http://localhost:5000/api/cart \
  -H "Authorization: Bearer invalid_token"
```

**Beklenen Sonuç:**
- Status: 401
- `code: "AUTH_002"`

#### 6.2 Token Olmadan Erişim
```bash
curl http://localhost:5000/api/cart
```

**Beklenen Sonuç:**
- Status: 401
- `code: "AUTH_001"`

#### 6.3 Bulunamayan Ürün
```bash
curl http://localhost:5000/api/products/invalid_id
```

**Beklenen Sonuç:**
- Status: 404
- `code: "PROD_001"` veya `"PROD_003"`

#### 6.4 Geçersiz Veri Girişi
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Eksik Ürün"
  }'
```

**Beklenen Sonuç:**
- Status: 400
- `code: "PROD_002"`

### 7. Docker Servis Sağlık Kontrolü

#### 7.1 Tüm Container'ları Kontrol Et
```bash
docker ps
```

**Beklenen Sonuç:**
- Tüm servisler çalışıyor olmalı:
  - mongodb
  - redis
  - zookeeper
  - kafka
  - elasticsearch
  - kibana
  - monolith-app
  - payment-service
  - invoicing-service

#### 7.2 MongoDB Bağlantı Kontrolü
```bash
docker exec -it mongodb mongosh --eval "db.adminCommand('ping')"
```

**Beklenen Sonuç:**
- `{ ok: 1 }`

#### 7.3 Redis Bağlantı Kontrolü
```bash
docker exec -it redis redis-cli ping
```

**Beklenen Sonuç:**
- `PONG`

#### 7.4 Elasticsearch Health Kontrolü
```bash
curl http://localhost:9200/_cluster/health
```

**Beklenen Sonuç:**
- `"status":"green"` veya `"status":"yellow"`

#### 7.5 Kafka Topic Kontrolü
```bash
docker exec -it kafka kafka-topics --list --bootstrap-server localhost:9092
```

**Beklenen Sonuç:**
- `payment_completed` topic'i listelenmeli

## Frontend Test Senaryoları

### 1. Kullanıcı Arayüzü Testleri
1. Ana sayfayı açın: http://localhost:3000
2. Kayıt sayfasına gidin ve yeni kullanıcı oluşturun
3. Giriş yapın
4. Ürünler sayfasına gidin
5. Ürünleri filtreleyin ve arayın
6. Ürünleri sepete ekleyin
7. Sepeti görüntüleyin
8. Checkout sayfasına gidin
9. Ödeme yapın
10. Sipariş onay sayfasını kontrol edin

### 2. Gerçek Zamanlı Bildirimler
1. Ödeme yapın
2. Invoicing service'in fatura oluşturmasını bekleyin
3. Bildirim modalının göründüğünü kontrol edin

## Sorun Giderme

### Servisler Başlamıyorsa
```bash
# Logları kontrol edin
docker-compose logs

# Belirli bir servisin loglarını kontrol edin
docker-compose logs monolith-app
docker-compose logs elasticsearch
```

### Elasticsearch Bağlantı Sorunu
```bash
# Elasticsearch container'ını kontrol edin
docker logs elasticsearch

# Elasticsearch'i yeniden başlatın
docker-compose restart elasticsearch
```

### Kafka Bağlantı Sorunu
```bash
# Zookeeper'ın çalıştığını kontrol edin
docker logs zookeeper

# Kafka'yı yeniden başlatın
docker-compose restart kafka
```

## Başarı Kriterleri

✅ Tüm test senaryoları başarıyla tamamlanmalı
✅ Hata mesajları doğru kod ve mesajlarla döndürülmeli
✅ Redis cache çalışmalı
✅ Elasticsearch arama çalışmalı
✅ Kafka event'leri gönderilmeli ve alınmalı
✅ Tüm Docker container'ları sağlıklı çalışmalı

