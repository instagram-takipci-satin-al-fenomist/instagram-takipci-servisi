# instagram-follower-service (Template)

Provider-agnostik bir *sipariş akışı* servisi. **Gerçek takipçi/etkileşim göndermez.**  
Amaç: ürün tanımları, sipariş oluşturma, idempotency, adapter arayüzü, webhook iskeleti ve kuyruk mantığını örneklemek.

> Uyarı: Her türlü sosyal ağ otomasyonu ilgili platformların kullanım koşullarına tabidir.  
> Bu repo, *eğitim ve entegrasyon* amaçlı bir şablondur; scraping/ToS ihlali hedeflemez.

## Özellikler
- Ürün kataloğu (`config/products.yaml`)
- Sipariş oluşturma (idempotency key ile güvenli tekrar)
- Basit kuyruk/işleyici (fake provider simülasyonu)
- Sağlayıcı adapter arayüzü + `DummyAdapter`
- Webhook iskeleti (imza doğrulama şablonu)
- Tip güvenliği (TypeScript) ve input doğrulama (Zod)

## Hızlı Başlangıç
```bash
npm i
cp .env.example .env
npm run dev
