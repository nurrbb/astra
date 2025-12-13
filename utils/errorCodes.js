const ErrorCodes = {
  AUTH_001: 'Yetkisiz erişim.',
  AUTH_002: 'Token geçersiz veya süresi dolmuş.',
  AUTH_003: 'Kullanıcı bulunamadı.',
  AUTH_004: 'E-posta veya şifre hatalı.',
  AUTH_005: 'Bu e-posta adresi zaten kullanılıyor.',
  AUTH_006: 'Eksik bilgi gönderildi.',
  
  PROD_001: 'Ürün bulunamadı.',
  PROD_002: 'Ürün bilgileri eksik.',
  PROD_003: 'Geçersiz ürün ID.',
  
  CART_001: 'Sepet bulunamadı.',
  CART_002: 'Sepet boş.',
  CART_003: 'Ürün sepette bulunamadı.',
  CART_004: 'Geçersiz ürün veya miktar bilgisi.',
  
  PAY_001: 'Ödeme işlemi başarısız.',
  PAY_002: 'Ödeme servisi kullanılamıyor.',
  PAY_003: 'Eksik ödeme bilgisi.',
  
  INV_001: 'Fatura bulunamadı.',
  INV_002: 'Fatura oluşturulamadı.',
  
  SYS_001: 'Sistem hatası.',
  SYS_002: 'Arama servisi kullanılamıyor.',
  SYS_003: 'Cache hatası.',
};

module.exports = ErrorCodes;

