# Global Tec

موقع متجر لابتوبات (جديد ومستعمل) — HTML / CSS / JS بدون أي framework، وشغّال فورًا من غير أي إعداد.

## 🚀 التشغيل

افتح `index.html` بالمتصفح مباشرة (دبل كليك) — الموقع كله شغال بأرقام وبيانات محلية داخل `js/data/products.js`، مفيش قاعدة بيانات ولا سيرفر مطلوب.

أفضل تجربة (اختياري): شغّله من خلال سيرفر محلي بسيط عشان روابط الصفحات والبحث تشتغل زي أي موقع حقيقي:
```
python3 -m http.server 8080
```
وبعدين افتح `http://localhost:8080`

## ✏️ إزاي تضيف/تعدّل منتج

افتح `js/data/products.js` وكل منتج عبارة عن object بالشكل ده:

| الحقل | القيمة |
|---|---|
| `name` | اسم اللابتوب كامل |
| `brand` | Dell, HP, Lenovo, ASUS, MSI, Acer... |
| `condition` | `new` أو `used` بالظبط |
| `price` | السعر الحالي (رقم بس) |
| `old_price` | سيبه `null` إلا لو فيه خصم |
| `processor`, `ram`, `storage`, `gpu`, `screen` | المواصفات |
| `description` | وصف قصير |
| `image_url` | رابط صورة رئيسية |
| `image_gallery` | array فيه روابط صور إضافية لصفحة التفاصيل |
| `in_stock` | `true` أو `false` |

ادّي كل منتج `id` فريد (زي `"p13"`) وضيفه في الـ array. الموقع بيحسب لوحده: العدّادات في الهوم، الفلاتر، البراند list، والمقارنة.

## 📁 هيكل المشروع

```
global-tec/
├── index.html              الصفحة الرئيسية
├── products.html           كل المنتجات + فلاتر (براند / سعر / حالة) + بحث + ترتيب
├── product-details.html    صفحة تفاصيل المنتج (جاليري صور، مواصفات كاملة، واتساب)
├── compare.html            مقارنة حتى 3 لابتوبات جنب بعض
│
├── css/
│   ├── variables.css       ألوان/خطوط/مسافات الموقع كله من هنا
│   ├── base.css, header.css, hero.css, product-card.css,
│   │   products-page.css, product-details.css, compare.css, footer.css
│
├── js/
│   ├── data/products.js         "قاعدة البيانات" — عدّل هنا لإضافة منتجات
│   ├── services/products-service.js   كل الاستعلامات (فلترة/بحث/ترتيب) من هنا
│   ├── components/               عناصر متكررة: كارت المنتج، صفحة التفاصيل،
│   │                              جدول المقارنة، الهيدر، تخزين المقارنة
│   └── main.js / products-page.js / product-details-page.js / compare-page.js
│       — كنترولر كل صفحة
│
└── sql/schema.sql          لو حبيت تربط الموقع بقاعدة بيانات حقيقية لاحقًا (Supabase)
```

## 🎨 تغيير الشكل

كل الألوان والخطوط في `css/variables.css` — غيّر `--accent`, `--price`, `--bg` وهيتغير الموقع كله.

## 🧩 ملاحظات

- زرار "Contact to Buy" في صفحة التفاصيل بيفتح واتساب برسالة جاهزة. غيّر الرقم في `js/components/render-details.js` (دور على `WHATSAPP_NUMBER`) لرقمك الحقيقي.
- اختيارات المقارنة متخزنة في متصفح الزائر (`localStorage`) — مش على سيرفر.
- ده موقع تجريبي (demo) ببيانات محلية عشان يشتغل فورًا. لو عايز البيانات على قاعدة بيانات حقيقية بحيث تقدر تضيف منتجات من غير ما تلمس الكود، ملف `sql/schema.sql` جاهز لـ Supabase — تقدر تطلب مني أربط الموقع بيه في أي وقت.
