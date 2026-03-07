import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/store/cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { useAuthLocal } from "@/hooks/use-auth-local";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const { t } = useLanguage();

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
        <p className="text-muted-foreground">{t.checkout.loading}</p>
      </div>
    );
  }

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <PackageOpen className="w-20 h-20 text-muted-foreground/30 mb-6" />
        <h2 className="text-3xl font-bold mb-4">{t.checkout.cartEmpty}</h2>
        <Button onClick={() => setLocation("/")} size="lg">{t.checkout.backToShopping}</Button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-black mb-4">{t.checkout.successTitle}</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-lg">{t.checkout.successDesc}</p>
        <div className="flex gap-4">
          <Button size="lg" onClick={() => setLocation("/orders")}>{t.checkout.trackOrder}</Button>
          <Button size="lg" variant="outline" onClick={() => setLocation("/")}>{t.checkout.backHome}</Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      toast({ title: t.checkout.errorTitle, description: t.checkout.addressRequired, variant: "destructive" });
      return;
    }

    if (!user) {
      toast({ title: t.checkout.errorTitle, description: t.checkout.loginRequired, variant: "destructive" });
      setLocation("/login");
      return;
    }

    try {
      const itemsByFamily = new Map<string, typeof items>();
      items.forEach(item => {
        const familyId = item.product.familyId;
        if (!itemsByFamily.has(familyId)) {
          itemsByFamily.set(familyId, []);
        }
        itemsByFamily.get(familyId)?.push(item);
      });

      let anySuccess = false;
      for (const [familyId, familyItems] of itemsByFamily.entries()) {
        const familySubtotal = familyItems.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
        const familyTotal = familySubtotal + 15;
        
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
          console.error(`Order error for family ${familyId}:`, err.message);
        }
      }
      
      if (anySuccess) {
        clearCart();
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        toast({ title: t.checkout.errorTitle, description: t.checkout.orderFailed, variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: t.checkout.errorGeneral, description: err.message || t.checkout.orderFailed, variant: "destructive" });
    }
  };

  const PAYMENT_OPTIONS = [
    { id: "مدى", label: "مدى", icon: CreditCard },
    { id: "Apple Pay", label: "Apple Pay", icon: CreditCard },
    { id: "الدفع عند الاستلام", label: t.checkout.paymentSection === "Payment Method" ? "Cash on Delivery" : "الدفع عند الاستلام", icon: Banknote },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black mb-10 text-foreground">{t.checkout.title}</h1>
      
      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* Form */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-card rounded-3xl p-6 md:p-8 shadow-sm border border-border/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              {t.checkout.deliverySection}
            </h2>
            <Textarea
              placeholder={t.checkout.addressPlaceholder}
              className="min-h-[120px] rounded-xl text-base resize-none focus-visible:ring-primary/20"
              value={address}
              onChange={e => setAddress(e.target.value)}
              data-testid="textarea-delivery-address"
            />
          </section>

          <section className="bg-card rounded-3xl p-6 md:p-8 shadow-sm border border-border/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              {t.checkout.paymentSection}
            </h2>
            <RadioGroup value={payment} onValueChange={setPayment} className="grid sm:grid-cols-3 gap-4">
              {PAYMENT_OPTIONS.map(opt => (
                <div key={opt.id} className="relative">
                  <RadioGroupItem value={opt.id} id={`pay-${opt.id}`} className="peer sr-only" />
                  <Label
                    htmlFor={`pay-${opt.id}`}
                    className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-border/50 bg-background cursor-pointer hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all h-full"
                    data-testid={`label-payment-${opt.id}`}
                  >
                    <opt.icon className="w-8 h-8 text-foreground/70" />
                    <span className="font-bold text-center text-sm">{opt.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </section>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-3xl p-6 md:p-8 shadow-sm border border-border/50 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">{t.checkout.orderSummary}</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pe-2">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm line-clamp-1">{item.product.name}</p>
                    <p className="text-muted-foreground text-xs mt-1">{t.checkout.quantity} {item.quantity}</p>
                    <p className="text-primary font-bold text-sm mt-1">{(Number(item.product.price) * item.quantity).toFixed(2)} {t.checkout.currency}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border/50 pt-6 space-y-4">
              <div className="flex justify-between text-muted-foreground">
                <span>{t.checkout.subtotal}</span>
                <span>{getTotal().toFixed(2)} {t.checkout.currency}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{t.checkout.deliveryFee}</span>
                <span>15.00 {t.checkout.currency}</span>
              </div>
              <div className="flex justify-between text-xl font-black text-foreground pt-4 border-t border-border/50">
                <span>{t.checkout.total}</span>
                <span className="text-primary">{(getTotal() + 15).toFixed(2)} {t.checkout.currency}</span>
              </div>

              <Button
                size="lg"
                className="w-full h-16 text-xl rounded-2xl shadow-lg shadow-primary/25 mt-6"
                onClick={handleSubmit}
                disabled={isPending}
                data-testid="button-confirm-order"
              >
                {isPending ? t.checkout.confirming : t.checkout.confirmOrder}
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
