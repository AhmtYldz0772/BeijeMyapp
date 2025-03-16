# beije Frontend Assignment – Teknik Dokümantasyon

## İçindekiler
- [Proje Tanımı](#proje-tanımı)
- [Mimari ve Teknolojik Seçimler](#mimari-ve-teknolojik-seçimler)
- [Proje Dizini Yapısı](#proje-dizini-yapısı)
- [API Entegrasyonları](#api-entegrasyonları)
- [State Yönetimi (Redux)](#state-yönetimi-redux)
- [UI ve Animasyonlar](#ui-ve-animasyonlar)
- [Ortam Değişkenleri ve Konfigürasyon](#ortam-değişkenleri-ve-konfigürasyon)
- [Kurulum ve Çalıştırma](#kurulum-ve-çalıştırma)
- [Testler ve Diğer İyileştirmeler](#testler-ve-diğer-iyileştirmeler)
- [Git ve Sürüm Yönetimi](#git-ve-sürüm-yönetimi)

---

## Proje Tanımı

Bu proje, beije web sitesinin belirli sayfalarını (Login ve Packet Selection) içeren bir frontend ödevidir. Projede;

- **Login Sayfası:**  
  - Figma tasarımına uygun kullanıcı arayüzü geliştirilir.
  - Navbar’daki "Ürünler" bölümünde hover yapıldığında genişletilmiş ürün ve paket menüsü görüntülenir.
  - API’den çekilen veriler Redux store’da saklanır.
  - Form doğrulama, inline hata mesajları ve toast bildirimleri uygulanır.
  - Başarılı giriş sonrası, token kullanılarak profil bilgileri çekilip Redux’a aktarılır ve oturum bilgileri korunur.

- **Packets (Seçim) Sayfası:**  
  - İki kategoriye ayrılmış ürün listeleri (Menstrual ve Other) sunulur.
  - Her kategori için genişletilebilir/kapatılabilir bölümler bulunur.
  - Ürün adedi güncellemeleri sağ panelde anlık yansıtılır.
  - "Sepete Ekle" işlemi ile Verify Packet Price API çağrılır; başarılı doğrulamada sepet güncellenir.

---

## Mimari ve Teknolojik Seçimler

- **Framework:** [Next.js](https://nextjs.org)  
- **Programlama Dili:** TypeScript  
- **State Yönetimi:** Redux & Redux Toolkit  
- **UI Kütüphanesi:** MUI (Material UI)  
- **HTTP İstekleri:** Axios  
- **Animasyonlar:** MUI Transition bileşenleri ve CSS animasyonları  
- **Testler:** (Opsiyonel) Jest & React Testing Library

---
