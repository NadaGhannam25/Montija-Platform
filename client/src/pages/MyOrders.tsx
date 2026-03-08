import { useOrders } from "@/hooks/use-orders";
import { useAuthLocal } from "@/hooks/use-auth-local";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useLocation } from "wouter";
import { Package, Clock, Truck, CheckCircle2, ShoppingBag, ChevronRight, MapPin, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useEffect } from "react";

const STATUS_STEPS_AR = ["قيد المعالجة", "قيد التحضير", "خرج للتوصيل", "تم التسليم"];

const STATUS_CONFIG: Record<string, { icon: any; gradient: string; light: string; text: string }> = {
  "قيد المعالجة": { icon: Clock,         gradient: "from-slate-400 to-slate-500",   light: "bg-slate-50 border-slate-200 text-slate-700",     text: "text-slate-600" },
  "قيد التحضير":  { icon: Package,       gradient: "from-amber-400 to-orange-500",  light: "bg-amber-50 border-amber-200 text-amber-700",     text: "text-amber-600" },
  "خرج للتوصيل": { icon: Truck,          gradient: "from-blue-400 to-blue-600",     light: "bg-blue-50 border-blue-200 text-blue-700",        text: "text-blue-600" },
  "تم التسليم":  { icon: CheckCircle2,  gradient: "from-emerald-400 to-green-600",  light: "bg-emerald-50 border-emerald-200 text-emerald-700", text: "text-emerald-600" },
};

export default function MyOrders() {
  const { data: orders, isLoading } = useOrders();
  const { isAuthenticated, isLoading: authLoading, user } = useAuthLocal();
  const [, setLocation] = useLocation();
  const { t, lang } = useLanguage();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) setLocation("/login");
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
  const isAr = lang === "ar";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">

      {/* Page Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black">{t.orders.title}</h1>
          {!isLoading && (
            <p className="text-muted-foreground mt-1">
              {userOrders.length} {isAr ? "طلب" : "orders"}
            </p>
          )}
        </div>
        <Button asChild variant="outline" className="gap-2 rounded-xl hidden sm:flex">
          <Link href="/">
            <ShoppingBag className="w-4 h-4" />
            {t.orders.shopMore}
          </Link>
        </Button>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="space-y-5">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full rounded-3xl" />)}
        </div>

      /* Empty */
      ) : userOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-32 bg-card rounded-3xl border border-dashed border-border text-center"
        >
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
            <Package className="w-12 h-12 text-muted-foreground/40" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{t.orders.empty}</h2>
          <p className="text-muted-foreground mb-8 max-w-xs">{t.orders.emptyDesc}</p>
          <Button asChild size="lg" className="rounded-xl">
            <Link href="/">{t.orders.startShopping}</Link>
          </Button>
        </motion.div>

      /* Orders List */
      ) : (
        <div className="space-y-5">
          {userOrders.map((order, idx) => {
            const status = order.status || "قيد المعالجة";
            const currentStep = STATUS_STEPS_AR.indexOf(status);
            const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG["قيد المعالجة"];
            const StatusIcon = cfg.icon;
            const statusLabel = t.statuses[status as keyof typeof t.statuses] || status;
            const isDelivered = status === "تم التسليم";

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="bg-card rounded-3xl border border-border/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                data-testid={`card-order-${order.id}`}
              >
                {/* ─── Top Bar ──────────────────────────────────────────── */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-muted/30 border-b border-border/50">
                  <div className="flex items-center gap-5">
                    {/* Order # */}
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">{t.orders.orderNumber}</p>
                      <p className="font-black text-xl leading-none"># {order.id}</p>
                    </div>
                    <div className="h-8 w-px bg-border/70" />
                    {/* Date */}
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">{t.orders.date}</p>
                      <p className="font-semibold text-sm">
                        {order.createdAt ? format(new Date(order.createdAt), "dd MMM yyyy", { locale: dateLocale }) : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Status Badge */}
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${cfg.light}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusLabel}
                    </span>
                    {/* Total */}
                    <span className="font-black text-xl text-primary">{Number(order.totalAmount).toFixed(2)} <span className="text-sm font-semibold">{t.orders.currency}</span></span>
                    {/* Details Link */}
                    <Button asChild variant="outline" size="sm" className="rounded-xl gap-1 hidden sm:flex" data-testid={`button-order-details-${order.id}`}>
                      <Link href={`/orders/${order.id}`}>
                        {t.orders.details}
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="p-6 md:p-7 space-y-6">
                  {/* ─── Progress Tracker ─────────────────────────────── */}
                  <div className="relative pt-1">
                    {/* Track line */}
                    <div className="absolute top-5 start-6 end-6 h-1 bg-muted rounded-full" />
                    <div
                      className={`absolute top-5 start-6 h-1 rounded-full bg-gradient-to-${isAr ? "l" : "r"} ${cfg.gradient} transition-all duration-700`}
                      style={{ width: `calc(${(currentStep / (STATUS_STEPS_AR.length - 1)) * 100}% - 3rem)` }}
                    />
                    <div className="relative flex justify-between">
                      {STATUS_STEPS_AR.map((step, idx) => {
                        const done = idx <= currentStep;
                        const active = idx === currentStep;
                        const StepIcon = STATUS_CONFIG[step]?.icon || Clock;
                        const stepLabel = t.statuses[step as keyof typeof t.statuses] || step;
                        return (
                          <div key={step} className="flex flex-col items-center gap-2 w-1/4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 z-10 transition-all duration-500 ${
                              active
                                ? `bg-gradient-to-br ${cfg.gradient} border-white text-white scale-110 shadow-lg`
                                : done
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "bg-card border-muted text-muted-foreground"
                            }`}>
                              <StepIcon className="w-4 h-4" />
                            </div>
                            <span className={`text-[11px] font-semibold text-center leading-tight max-w-[60px] ${
                              active ? cfg.text : done ? "text-foreground" : "text-muted-foreground"
                            }`}>
                              {stepLabel}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ─── Items ────────────────────────────────────────── */}
                  <div>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">{t.orders.products}</p>
                    <div className="space-y-2">
                      {order.items?.map(item => (
                        <div key={item.id} className="flex items-center gap-4 p-3 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border/40">
                            <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm truncate">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {t.orders.quantity} <span className="font-semibold">{item.quantity}</span>
                            </p>
                          </div>
                          <div className="text-end shrink-0">
                            <p className="font-black text-primary">{(Number(item.price) * item.quantity).toFixed(2)}</p>
                            <p className="text-[11px] text-muted-foreground">{t.orders.currency}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ─── Footer Info ──────────────────────────────────── */}
                  <div className="grid sm:grid-cols-2 gap-3 pt-1">
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-muted/20 border border-border/40">
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">{t.orders.deliveryAddress}</p>
                        <p className="text-sm font-medium leading-snug truncate">{order.deliveryAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-muted/20 border border-border/40">
                      <CreditCard className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">{t.orders.paymentMethod}</p>
                        <p className="text-sm font-medium">{order.paymentMethod}</p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile details button */}
                  <Button asChild variant="outline" size="sm" className="sm:hidden w-full rounded-xl gap-1" data-testid={`button-order-details-mobile-${order.id}`}>
                    <Link href={`/orders/${order.id}`}>
                      {t.orders.details}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
