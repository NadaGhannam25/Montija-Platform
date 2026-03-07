import { useOrders } from "@/hooks/use-orders";
import { useAuthLocal } from "@/hooks/use-auth-local";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useLocation } from "wouter";
import { Package, Clock, Truck, CheckCircle2, ShoppingBag, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

const STATUS_STEPS_AR = ["قيد المعالجة", "قيد التحضير", "خرج للتوصيل", "تم التسليم"];

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: any }> = {
  "قيد المعالجة": { color: "text-slate-700",  bg: "bg-slate-100 border-slate-200",  icon: Clock },
  "قيد التحضير":  { color: "text-orange-700", bg: "bg-orange-100 border-orange-200", icon: Package },
  "خرج للتوصيل": { color: "text-blue-700",    bg: "bg-blue-100 border-blue-200",    icon: Truck },
  "تم التسليم":  { color: "text-green-700",   bg: "bg-green-100 border-green-200",  icon: CheckCircle2 },
};

export default function MyOrders() {
  const { data: orders, isLoading } = useOrders();
  const { isAuthenticated, isLoading: authLoading, user } = useAuthLocal();
  const [, setLocation] = useLocation();
  const { t, lang } = useLanguage();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const userOrders = orders?.filter(o => o.userId === user?.id) || [];
  const dateLocale = lang === "ar" ? arSA : enUS;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-black">{t.orders.title}</h1>
        <Link href="/" className="text-primary font-semibold hover:underline flex items-center gap-1">
          <ShoppingBag className="w-4 h-4" />
          {t.orders.shopMore}
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1,2,3].map(i => <Skeleton key={i} className="h-56 w-full rounded-3xl" />)}
        </div>
      ) : userOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-card rounded-3xl border border-dashed border-border/60 text-center">
          <Package className="w-20 h-20 text-muted-foreground/30 mb-6" />
          <h2 className="text-2xl font-bold mb-2">{t.orders.empty}</h2>
          <p className="text-muted-foreground mb-6">{t.orders.emptyDesc}</p>
          <Button asChild><Link href="/">{t.orders.startShopping}</Link></Button>
        </div>
      ) : (
        <div className="space-y-6">
          {userOrders.map(order => {
            const status = order.status || "قيد المعالجة";
            const currentStep = STATUS_STEPS_AR.indexOf(status);
            const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["قيد المعالجة"];
            const StatusIcon = cfg.icon;
            const statusLabel = t.statuses[status as keyof typeof t.statuses] || status;

            return (
              <div key={order.id} className="bg-card border border-border/50 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow" data-testid={`card-order-${order.id}`}>
                {/* Header */}
                <div className="bg-muted/30 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-border/50">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">{t.orders.orderNumber}</p>
                      <p className="font-black text-lg">#{order.id}</p>
                    </div>
                    <div className="h-10 w-px bg-border/50" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">{t.orders.date}</p>
                      <p className="font-semibold text-sm">
                        {order.createdAt ? format(new Date(order.createdAt), "dd MMM yyyy", { locale: dateLocale }) : '—'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold border ${cfg.bg} ${cfg.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      {statusLabel}
                    </span>
                    <p className="font-black text-xl text-primary">{Number(order.totalAmount).toFixed(2)} {t.orders.currency}</p>
                    <Button asChild variant="outline" size="sm" className="rounded-xl hidden sm:flex gap-1" data-testid={`button-order-details-${order.id}`}>
                      <Link href={`/orders/${order.id}`}>
                        <ChevronRight className="w-4 h-4" />
                        {t.orders.details}
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  {/* Progress tracker */}
                  <div className="mb-8 relative pt-2">
                    <div className="absolute top-6 start-4 end-4 h-1 bg-muted rounded-full" />
                    <div
                      className="absolute top-6 start-4 h-1 bg-primary rounded-full transition-all duration-700"
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
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 z-10 transition-all duration-500 ${
                              active ? 'bg-primary border-primary/30 text-primary-foreground scale-110 shadow-lg shadow-primary/30' :
                              done  ? 'bg-primary border-primary text-primary-foreground' :
                                      'bg-card border-muted text-muted-foreground'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className={`text-xs font-semibold text-center leading-tight ${active ? 'text-primary' : done ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {stepLabel}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wide mb-3">{t.orders.products}</h3>
                    {order.items?.map(item => (
                      <div key={item.id} className="flex items-center gap-4 p-3 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="w-14 h-14 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                          <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">{t.orders.quantity} {item.quantity}</p>
                        </div>
                        <div className="text-start">
                          <p className="font-bold">{Number(item.price).toFixed(2)} {t.orders.currency}</p>
                          <p className="text-xs text-muted-foreground">{t.orders.perUnit}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery + Payment */}
                  <div className="mt-6 pt-6 border-t border-border/50 grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">{t.orders.deliveryAddress}</p>
                      <p className="font-semibold">{order.deliveryAddress}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">{t.orders.paymentMethod}</p>
                      <p className="font-semibold">{order.paymentMethod}</p>
                    </div>
                  </div>

                  {order.deliveryPersonName && status === "خرج للتوصيل" && (
                    <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/20 flex items-center gap-3">
                      <Truck className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t.orderDetails.courierLabel}</p>
                        <p className="font-bold">{order.deliveryPersonName}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
