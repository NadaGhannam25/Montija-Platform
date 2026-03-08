import { useOrders } from "@/hooks/use-orders";
import { useAuthLocal } from "@/hooks/use-auth-local";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useLocation } from "wouter";
import {
  Package, Clock, Truck, CheckCircle2,
  ShoppingBag, ChevronRight, MapPin, CreditCard, CalendarDays, Hash,
} from "lucide-react";
import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useEffect } from "react";

const STATUS_STEPS_AR = ["قيد المعالجة", "قيد التحضير", "خرج للتوصيل", "تم التسليم"];

type StatusKey = "قيد المعالجة" | "قيد التحضير" | "خرج للتوصيل" | "تم التسليم";

const STATUS_CONFIG: Record<StatusKey, { icon: any; badge: string }> = {
  "قيد المعالجة": { icon: Clock,        badge: "bg-muted text-muted-foreground border-border/60" },
  "قيد التحضير":  { icon: Package,      badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800" },
  "خرج للتوصيل": { icon: Truck,         badge: "bg-primary/10 text-primary border-primary/25" },
  "تم التسليم":  { icon: CheckCircle2,  badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800" },
};

export default function MyOrders() {
  const { data: orders, isLoading } = useOrders();
  const { isAuthenticated, isLoading: authLoading, user } = useAuthLocal();
  const [, setLocation] = useLocation();
  const { t, lang } = useLanguage();
  const isAr = lang === "ar";
  const dateLocale = lang === "ar" ? arSA : enUS;

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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 min-h-screen">

      {/* ── Page Header ───────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">{t.orders.title}</h1>
          {!isLoading && (
            <p className="text-sm text-muted-foreground mt-1">
              {userOrders.length} {isAr ? "طلب" : "orders"}
            </p>
          )}
        </div>
        <Button asChild variant="outline" size="sm" className="gap-2 rounded-xl hidden sm:flex">
          <Link href="/">
            <ShoppingBag className="w-4 h-4" />
            {t.orders.shopMore}
          </Link>
        </Button>
      </div>

      {/* ── Loading Skeletons ──────────────────────────────── */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-72 w-full rounded-3xl" />)}
        </div>

      /* ── Empty State ───────────────────────────────────── */
      ) : userOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-28 bg-card rounded-3xl border border-dashed border-border text-center"
        >
          <div className="w-20 h-20 rounded-full bg-primary/8 flex items-center justify-center mb-5">
            <Package className="w-10 h-10 text-primary/50" />
          </div>
          <h2 className="text-xl font-bold mb-2">{t.orders.empty}</h2>
          <p className="text-sm text-muted-foreground mb-7 max-w-xs">{t.orders.emptyDesc}</p>
          <Button asChild size="sm" className="rounded-xl px-6">
            <Link href="/">{t.orders.startShopping}</Link>
          </Button>
        </motion.div>

      /* ── Order Cards ───────────────────────────────────── */
      ) : (
        <div className="space-y-5">
          {userOrders.map((order, cardIdx) => {
            const status = (order.status || "قيد المعالجة") as StatusKey;
            const stepIdx  = STATUS_STEPS_AR.indexOf(status);
            const cfg      = STATUS_CONFIG[status] ?? STATUS_CONFIG["قيد المعالجة"];
            const StatusIcon = cfg.icon;
            const statusLabel = t.statuses[status as keyof typeof t.statuses] || status;

            return (
              <motion.article
                key={order.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: cardIdx * 0.06 }}
                className="bg-card rounded-3xl border border-border/60 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                data-testid={`card-order-${order.id}`}
              >
                {/* ── Card Header ──────────────────────────── */}
                <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-muted/25 border-b border-border/40">
                  {/* Left: order # and date */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold leading-none mb-0.5">
                          {t.orders.orderNumber}
                        </p>
                        <p className="font-black text-lg leading-none">{order.id}</p>
                      </div>
                    </div>
                    <div className="h-7 w-px bg-border/60" />
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold leading-none mb-0.5">
                          {t.orders.date}
                        </p>
                        <p className="font-semibold text-sm leading-none">
                          {order.createdAt ? format(new Date(order.createdAt), "dd MMM yyyy", { locale: dateLocale }) : "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: status badge + total + details */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${cfg.badge}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusLabel}
                    </span>
                    <p className="font-black text-lg text-primary whitespace-nowrap">
                      {Number(order.totalAmount).toFixed(2)}
                      <span className="text-sm font-semibold ms-1">{t.orders.currency}</span>
                    </p>
                    <Button
                      asChild variant="ghost" size="sm"
                      className="rounded-xl h-8 px-3 text-xs gap-1 hidden sm:flex border border-border/60 hover:bg-muted"
                      data-testid={`button-order-details-${order.id}`}
                    >
                      <Link href={`/orders/${order.id}`}>
                        {t.orders.details}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="px-6 py-5 space-y-5">

                  {/* ── Progress Tracker ─────────────────── */}
                  <div className="relative py-2">
                    {/* Track background */}
                    <div className="absolute top-[22px] start-5 end-5 h-[3px] bg-border/50 rounded-full" />
                    {/* Active track — always uses primary color */}
                    <div
                      className="absolute top-[22px] start-5 h-[3px] rounded-full bg-primary transition-all duration-700"
                      style={{
                        width: stepIdx === 0
                          ? "0%"
                          : `calc(${(stepIdx / (STATUS_STEPS_AR.length - 1)) * 100}% - 2.5rem)`,
                      }}
                    />
                    <div className="relative flex justify-between">
                      {STATUS_STEPS_AR.map((step, si) => {
                        const done   = si < stepIdx;
                        const active = si === stepIdx;
                        const future = si > stepIdx;
                        const StepIcon = STATUS_CONFIG[step as StatusKey]?.icon || Clock;
                        const stepLabel = t.statuses[step as keyof typeof t.statuses] || step;
                        return (
                          <div key={step} className="flex flex-col items-center gap-2 w-1/4">
                            <div className={`
                              w-11 h-11 rounded-full flex items-center justify-center border-[3px] z-10
                              transition-all duration-500
                              ${active ? "bg-primary border-primary/20 text-primary-foreground scale-110 shadow-md shadow-primary/25"
                                : done  ? "bg-primary border-primary text-primary-foreground"
                                        : "bg-card border-border/60 text-muted-foreground/50"}
                            `}>
                              <StepIcon className="w-4 h-4" />
                            </div>
                            <span className={`
                              text-[10px] font-semibold text-center leading-snug max-w-[56px]
                              ${active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground/60"}
                            `}>
                              {stepLabel}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── Product Items ────────────────────── */}
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                      {t.orders.products}
                    </p>
                    <div className="space-y-2">
                      {order.items?.map(item => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 rounded-2xl bg-muted/20 border border-border/30"
                        >
                          {/* Thumbnail */}
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/40">
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Name & qty */}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm leading-tight truncate">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {t.orders.quantity}
                              <span className="font-bold text-foreground ms-1">{item.quantity}</span>
                            </p>
                          </div>

                          {/* Line total */}
                          <div className="text-end shrink-0">
                            <p className="font-bold text-sm text-primary">
                              {(Number(item.price) * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-[10px] text-muted-foreground">{t.orders.currency}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── Delivery & Payment ───────────────── */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-muted/20 border border-border/30">
                      <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                          {t.orders.deliveryAddress}
                        </p>
                        <p className="text-xs font-medium leading-relaxed line-clamp-2">
                          {order.deliveryAddress}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-muted/20 border border-border/30">
                      <CreditCard className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                          {t.orders.paymentMethod}
                        </p>
                        <p className="text-xs font-medium">{order.paymentMethod}</p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile details button */}
                  <Button
                    asChild variant="outline" size="sm"
                    className="sm:hidden w-full rounded-xl gap-1 h-9"
                    data-testid={`button-order-details-mobile-${order.id}`}
                  >
                    <Link href={`/orders/${order.id}`}>
                      {t.orders.details}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </Button>

                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
}
