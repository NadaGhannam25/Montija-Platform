import { useParams, useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuthLocal } from "@/hooks/use-auth-local";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { Package, Clock, Truck, CheckCircle2, ArrowRight, MapPin, CreditCard, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { OrderWithDetails } from "@shared/schema";
import NoticeBanner from "@/components/layout/NoticeBanner";

const STATUS_STEPS_AR = ["قيد المعالجة", "قيد التحضير", "خرج للتوصيل", "تم التسليم"];

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: any }> = {
  "قيد المعالجة": { color: "text-slate-700",  bg: "bg-slate-100 border-slate-200",  icon: Clock },
  "قيد التحضير":  { color: "text-orange-700", bg: "bg-orange-100 border-orange-200", icon: Package },
  "خرج للتوصيل": { color: "text-blue-700",    bg: "bg-blue-100 border-blue-200",    icon: Truck },
  "تم التسليم":  { color: "text-green-700",   bg: "bg-green-100 border-green-200",  icon: CheckCircle2 },
};

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuthLocal();
  const { t, lang } = useLanguage();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  const { data: order, isLoading } = useQuery<OrderWithDetails>({
    queryKey: ["/api/orders", id],
    enabled: !!id && isAuthenticated,
  });

  const dateLocale = lang === "ar" ? arSA : enUS;

  if (authLoading || isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
        <Skeleton className="h-48 w-full rounded-3xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <Package className="w-20 h-20 text-muted-foreground/30 mb-6" />
        <h2 className="text-2xl font-bold mb-2">{t.orderDetails.notFound}</h2>
        <Button asChild className="mt-4"><Link href="/orders">{t.orderDetails.backButton}</Link></Button>
      </div>
    );
  }

  const status = order.status || "قيد المعالجة";
  const currentStep = STATUS_STEPS_AR.indexOf(status);
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["قيد المعالجة"];
  const StatusIcon = cfg.icon;
  const statusLabel = t.statuses[status as keyof typeof t.statuses] || status;
  const subtotal = order.items?.reduce((s, i) => s + Number(i.price) * i.quantity, 0) || (Number(order.totalAmount) - 15);
  const delivery = 15;

  return (
    <>
      <NoticeBanner />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 min-h-screen space-y-6">
      {/* Back */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => setLocation("/orders")} className="gap-2 text-muted-foreground" data-testid="button-back-orders">
          <ArrowRight className="w-4 h-4" />
          {t.orderDetails.back}
        </Button>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-semibold">{t.orderDetails.title} #{order.id}</span>
      </div>

      {/* Header Card */}
      <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
        <div className="bg-muted/30 px-6 py-5 flex flex-wrap items-center justify-between gap-4 border-b border-border/50">
          <div className="flex items-center gap-5">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">{t.orders.orderNumber}</p>
              <p className="font-black text-2xl" data-testid="text-order-id">#{order.id}</p>
            </div>
            <div className="h-10 w-px bg-border/50" />
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">{t.orders.date}</p>
              <p className="font-semibold">
                {order.createdAt ? format(new Date(order.createdAt), "dd MMMM yyyy", { locale: dateLocale }) : "—"}
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${cfg.bg} ${cfg.color}`} data-testid="badge-order-status">
            <StatusIcon className="w-4 h-4" />
            {statusLabel}
          </span>
        </div>

        {/* Progress */}
        <div className="p-6 pb-4">
          <div className="relative pt-2">
            <div className="absolute top-6 start-4 end-4 h-1.5 bg-muted rounded-full" />
            <div
              className="absolute top-6 start-4 h-1.5 bg-primary rounded-full transition-all duration-700"
              style={{ width: `calc(${(currentStep / (STATUS_STEPS_AR.length - 1)) * 100}% - 2rem)` }}
            />
            <div className="relative flex justify-between">
              {STATUS_STEPS_AR.map((step, idx) => {
                const done = idx <= currentStep;
                const active = idx === currentStep;
                const Icon = STATUS_CONFIG[step]?.icon || Clock;
                const stepLabel = t.statuses[step as keyof typeof t.statuses] || step;
                return (
                  <div key={step} className="flex flex-col items-center gap-2 w-1/4">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center border-4 z-10 transition-all duration-500 ${
                      active ? "bg-primary border-primary/30 text-primary-foreground scale-110 shadow-lg shadow-primary/30" :
                      done  ? "bg-primary border-primary text-primary-foreground" :
                              "bg-card border-muted text-muted-foreground"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-xs font-semibold text-center leading-tight ${active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"}`}>
                      {stepLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary" />
          {t.orderDetails.orderedProducts}
        </h2>
        <div className="space-y-3">
          {order.items?.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-3 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors" data-testid={`row-order-item-${item.id}`}>
              <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold">{item.product.name}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{item.product.category}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{t.orderDetails.quantity} {item.quantity}</p>
              </div>
              <div className="text-start shrink-0">
                <p className="font-black text-primary">{(Number(item.price) * item.quantity).toFixed(2)} {t.orderDetails.currency}</p>
                <p className="text-xs text-muted-foreground">{Number(item.price).toFixed(2)} {t.orderDetails.currency}{t.orderDetails.perUnit}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-6 pt-5 border-t border-border/50 space-y-3">
          <div className="flex justify-between text-muted-foreground text-sm">
            <span>{t.orderDetails.subtotal}</span>
            <span>{subtotal.toFixed(2)} {t.orderDetails.currency}</span>
          </div>
          <div className="flex justify-between text-muted-foreground text-sm">
            <span>{t.orderDetails.deliveryFee}</span>
            <span>{delivery.toFixed(2)} {t.orderDetails.currency}</span>
          </div>
          <div className="flex justify-between font-black text-xl pt-3 border-t border-border/50">
            <span>{t.orderDetails.total}</span>
            <span className="text-primary" data-testid="text-order-total">{Number(order.totalAmount).toFixed(2)} {t.orderDetails.currency}</span>
          </div>
        </div>
      </div>

      {/* Delivery & Payment */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold">{t.orderDetails.deliveryAddress}</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed" data-testid="text-delivery-address">{order.deliveryAddress}</p>
        </div>

        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold">{t.orderDetails.paymentDetails}</h3>
          </div>
          <p className="font-semibold" data-testid="text-payment-method">{order.paymentMethod}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {status === "تم التسليم" ? t.orderDetails.paid : t.orderDetails.pendingPayment}
          </p>
        </div>
      </div>

      {order.deliveryPersonName && status === "خرج للتوصيل" && (
        <div className="bg-card border border-primary/20 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Truck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t.orderDetails.courierLabel}</p>
            <p className="font-bold text-lg">{order.deliveryPersonName}</p>
          </div>
        </div>
      )}

      <Button variant="outline" asChild className="w-full h-12 rounded-2xl text-base">
        <Link href="/orders">{t.orderDetails.backToOrders}</Link>
      </Button>
    </div>
    </>
  );
}
