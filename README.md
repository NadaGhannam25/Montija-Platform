# Montija – Digital Marketplace Platform

Montija is a complete digital marketplace platform designed to empower home-based families (productive families) to showcase and sell their products through a modern, clean, and user-friendly system.

The platform provides a full end-to-end purchasing experience, starting from browsing products to placing orders and tracking their status, along with a dedicated dashboard for sellers.

---

## Project Overview

Montija aims to create a professional digital environment that supports small family businesses by offering:

- Organized product listings with high-quality images
- Category-based browsing
- Smooth search experience
- Shopping cart system
- Checkout and order creation
- Order tracking with status updates
- Seller dashboard for product and order management
- Notifications system
- FAQ page and simple chatbot
- Login & Registration system with role selection

---

## Core Features

### Customer Features
- Browse products by categories
- Search functionality
- Product details page
- Add to cart / modify quantity
- Checkout process
- Order tracking (Processing → Preparing → Out for Delivery → Delivered)
- Rate delivery representative after completion

### Seller (Family) Features
- Register as a productive family
- Seller dashboard
- Add / Edit / Delete products (CRUD)
- View incoming orders
- Advanced statistics (Revenue, Orders count, Top sellers)
- Insights & analytics section

### System Features
- Mock notification system:
  - Order confirmed
  - Order preparation started
  - Status updates
- Notification badge counter
- FAQ section (Expansion tiles)
- Simple keyword-based chatbot

---

## End-to-End Order Flow

1. Browse products  
2. View product details  
3. Add to cart  
4. Checkout  
5. Create order with initial status "Processing"  
6. Order appears in "My Orders"  
7. Notifications triggered  
8. Status updates handled  


---

## Prompt Used to Build the Project

```
بصفتك خبيرًا في تطوير الأنظمة الرقمية، أريد منك مراجعة وتحسين منصة "منتجة" بشكل شامل بعد التحديثات الأخيرة.

أولاً: معالجة مشكلة إتمام الطلب (Checkout)
يوجد خلل في مرحلة إتمام الطلب حيث لا يتم أحيانًا إنشاء الطلب أو لا يظهر مباشرة في صفحة "طلباتي". المطلوب مراجعة منطق إنشاء الطلب والتأكد من أن الضغط على زر "تأكيد الطلب" يقوم بالخطوات التالية:

1. إنشاء كائن Order فعلي داخل النظام
2. إضافة الطلب إلى نظام إدارة الطلبات
3. تعيين الحالة الابتدائية للطلب إلى "قيد المعالجة"
4. الانتقال مباشرة إلى صفحة "طلباتي"
5. تحديث الواجهة فورًا دون الحاجة لإعادة تشغيل النظام

ثانياً: إضافة نظام تسجيل الدخول والتسجيل
أريد إضافة نظام مصادقة متكامل يتضمن:

- تسجيل حساب جديد (Register)
- تسجيل الدخول (Login)
- اختيار نوع الحساب:
  • عميل
  • أسرة منتجة

كما يجب إضافة التحقق من صحة البيانات (Validation) لجميع الحقول مثل:
- البريد الإلكتروني
- كلمة المرور
- رقم الجوال
- الحقول المطلوبة

ويجب أيضاً:
- حفظ حالة تسجيل الدخول (Session)
- منع المستخدم من إتمام الطلب أو الوصول إلى لوحة تحكم الأسرة المنتجة أو صفحة الإحصائيات بدون تسجيل الدخول

ثالثاً: تحسين واجهات المستخدم
أريد تحسين تصميم واجهات الصفحات التالية:

- صفحة تسجيل الدخول
- صفحة إنشاء حساب
- صفحة المنتجات
- صفحة السلة
- صفحة الطلبات

مع التركيز على:

- تحسين المحاذاة بين العناصر
- وضوح الحقول والنصوص
- توزيع العناصر بشكل متوازن
- وضوح الأزرار
- تصميم عصري وسهل الاستخدام

رابعاً: تحسين تجربة المستخدم العامة
يرجى التأكد من تحسين تجربة المستخدم في جميع صفحات المنصة من خلال:

- توحيد محاذاة النصوص والأزرار
- ضبط أحجام صور المنتجات داخل البطاقات
- وضوح زر "إضافة إلى السلة"
- تحسين استقرار نظام الإشعارات

كما يجب إرسال إشعارات عند:
- إنشاء الطلب
- تغيير حالة الطلب

الهدف النهائي:
جعل المنصة مستقرة، خالية من الأخطاء، ومكتملة الوظائف الأساسية لتكون جاهزة للتسليم كنموذج MVP احترافي.


```


---

## Project Status

- Completed as a Professional MVP  
- Ready for future enhancements (Real backend integration, Payment gateway, Push notifications)

---

## Goal

To build a scalable and professional digital marketplace that supports small family businesses while delivering a smooth, modern, and reliable user experience.

