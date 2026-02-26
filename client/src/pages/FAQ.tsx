import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function FAQ() {
  const faqs = [
    {
      q: "كيف يمكنني الطلب من الأسر المنتجة؟",
      a: "يمكنك تصفح المنتجات عبر الصفحة الرئيسية، إضافتها إلى السلة، ثم الانتقال لصفحة إتمام الطلب وإدخال عنوانك واختيار طريقة الدفع المناسبة."
    },
    {
      q: "ما هي طرق الدفع المتاحة؟",
      a: "نوفر خيارات دفع متعددة وآمنة تشمل مدى، Apple Pay، والبطاقات الائتمانية، بالإضافة إلى خيار الدفع عند الاستلام."
    },
    {
      q: "كم يستغرق توصيل الطلبات؟",
      a: "يعتمد وقت التوصيل على نوع المنتج وتجهيز الأسرة له. عادة ما يتم التوصيل في نفس اليوم للمأكولات الطازجة، أو خلال 1-3 أيام للمنتجات الأخرى."
    },
    {
      q: "كيف يمكنني تتبع طلبي؟",
      a: "من خلال صفحة 'طلباتي' في حسابك، يمكنك رؤية حالة الطلب بشكل مباشر بدءاً من قيد المعالجة وحتى تم التسليم."
    },
    {
      q: "هل يمكنني الانضمام كعائلة منتجة؟",
      a: "نعم بالتأكيد! بعد تسجيل الدخول، يمكنك الانتقال إلى 'لوحة التحكم' والبدء في إضافة منتجاتك فوراً للوصول إلى آلاف العملاء."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 min-h-[70vh]">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
          <HelpCircle className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-black text-foreground mb-4">الأسئلة الشائعة</h1>
        <p className="text-xl text-muted-foreground">كل ما تحتاج معرفته عن منصة منتجة</p>
      </div>

      <div className="bg-card rounded-3xl p-6 md:p-10 shadow-sm border border-border/50">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border border-border/50 rounded-2xl px-6 data-[state=open]:bg-primary/5 data-[state=open]:border-primary/20 transition-colors">
              <AccordionTrigger className="text-lg font-bold hover:no-underline py-6 text-start text-foreground data-[state=open]:text-primary">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base pb-6 leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
