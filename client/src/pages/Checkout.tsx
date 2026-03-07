import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/store/cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { useAuthLocal } from "@/hooks/use-auth-local";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, CreditCard, Banknote, MapPin, PackageOpen, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Checkout() {
  const { items, getTotal, clearCart } = useCart();
  const { user, isLoading: authLoading, isAuthenticated } = useAuthLocal();
  const [, setLocation] = useLocation();
  const { mutateAsync: createOrder, isPending } = useCreateOrder();
  const { toast } = useToast();

  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("مدى");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-6"></div>
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    );
  }

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <PackageOpen className="w-20 h-20 text-muted-foreground/30 mb-6" />
        <h2 className="text-3xl font-bold mb-4">السلة فارغة</h2>
        <Button onClick={() => setLocation("/")} size="lg">العودة للتسوق</Button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-black mb-4">تم تأكيد طلبك بنجاح!</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-lg">
          شكراً لثقتك بنا. جاري تحضير طلبك من قبل الأسرة المنتجة، يمكنك تتبع حالة الطلب من صفحة طلباتي.
        </p>
        <div className="flex gap-4">
          <Button size="lg" onClick={() => setLocation("/orders")}>تتبع الطلب</Button>
          <Button size="lg" variant="outline" onClick={() => setLocation("/")}>الرئيسية</Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      toast({ title: "خطأ", description: "يرجى إدخال عنوان التوصيل", variant: "destructive" });
      return;
    }

    if (!user) {
      toast({ title: "خطأ", description: "يرجى تسجيل الدخول أولاً", variant: "destructive" });
      setLocation("/login");
      return;
    }

    try {
      // Group items by family and create orders for each
      const itemsByFamily = new Map<string, typeof items>();
      items.forEach(item => {
        const familyId = item.product.familyId;
        if (!itemsByFamily.has(familyId)) {
          itemsByFamily.set(familyId, []);
        }
        itemsByFamily.get(familyId)?.push(item);
      });

      // Create an order for each family
      let anySuccess = false;
      for (const [familyId, familyItems] of itemsByFamily.entries()) {
        const familyTotal = familyItems.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
        
        try {
          await createOrder({
            familyId,
            items: familyItems.map(i => ({
              productId: i.product.id,
              quantity: i.quantity,
              price: i.product.price
            })),
            deliveryAddress: address,
            paymentMethod: payment,
            totalAmount: familyTotal.toString()
          });
          anySuccess = true;
        } catch (err: any) {
          console.error(`خطأ في إنشاء طلب العائلة ${familyId}:`, err.message);
        }
      }
      
      if (anySuccess) {
        clearCart();
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        toast({ title: "خطأ", description: "فشل إنشاء الطلب", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "حدث خطأ", description: err.message || "فشل إنشاء الطلب", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black mb-10 text-foreground">إتمام الطلب</h1>
      
      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* Form */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-card rounded-3xl p-6 md:p-8 shadow-sm border border-border/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              عنوان التوصيل
            </h2>
            <Textarea 
              placeholder="المدينة، الحي، الشارع، رقم المبنى..." 
              className="min-h-[120px] rounded-xl text-base resize-none focus-visible:ring-primary/20"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </section>

          <section className="bg-card rounded-3xl p-6 md:p-8 shadow-sm border border-border/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              طريقة الدفع
            </h2>
            <RadioGroup value={payment} onValueChange={setPayment} className="grid sm:grid-cols-3 gap-4">
              {[
                { id: "مدى", label: "مدى", icon: CreditCard },
                { id: "Apple Pay", label: "Apple Pay", icon: CreditCard },
                { id: "الدفع عند الاستلام", label: "الدفع عند الاستلام", icon: Banknote },
              ].map(opt => (
                <div key={opt.id} className="relative">
                  <RadioGroupItem value={opt.id} id={opt.id} className="peer sr-only" />
                  <Label 
                    htmlFor={opt.id} 
                    className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-border/50 bg-background cursor-pointer hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all h-full"
                  >
                    <opt.icon className="w-8 h-8 text-foreground/70 peer-data-[state=checked]:text-primary" />
                    <span className="font-bold text-center">{opt.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </section>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-3xl p-6 md:p-8 shadow-sm border border-border/50 sticky top-28">
            <h2 className="text-2xl font-bold mb-6">ملخص الطلب</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pe-2">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm line-clamp-1">{item.product.name}</p>
                    <p className="text-muted-foreground text-xs mt-1">الكمية: {item.quantity}</p>
                    <p className="text-primary font-bold text-sm mt-1">{(Number(item.product.price) * item.quantity).toFixed(2)} ر.س</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border/50 pt-6 space-y-4">
              <div className="flex justify-between text-muted-foreground">
                <span>المجموع الفرعي</span>
                <span>{getTotal().toFixed(2)} ر.س</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>رسوم التوصيل</span>
                <span>15.00 ر.س</span>
              </div>
              <div className="flex justify-between text-xl font-black text-foreground pt-4 border-t border-border/50">
                <span>الإجمالي</span>
                <span className="text-primary">{(getTotal() + 15).toFixed(2)} ر.س</span>
              </div>

              <Button 
                size="lg" 
                className="w-full h-16 text-xl rounded-2xl shadow-lg shadow-primary/25 mt-6"
                onClick={handleSubmit}
                disabled={isPending}
              >
                {isPending ? "جاري التأكيد..." : "تأكيد الطلب"}
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
