import { useOrders } from "@/hooks/use-orders";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Package, Clock, Truck, CheckCircle2, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_STEPS = ["قيد المعالجة", "قيد التحضير", "خرج للتوصيل", "تم التسليم"];

const getStatusColor = (status: string) => {
  switch(status) {
    case "قيد المعالجة": return "bg-slate-100 text-slate-700 border-slate-200";
    case "قيد التحضير": return "bg-orange-100 text-orange-700 border-orange-200";
    case "خرج للتوصيل": return "bg-blue-100 text-blue-700 border-blue-200";
    case "تم التسليم": return "bg-green-100 text-green-700 border-green-200";
    default: return "bg-muted text-muted-foreground";
  }
};

const getStatusIcon = (status: string) => {
  switch(status) {
    case "قيد المعالجة": return <Clock className="w-5 h-5" />;
    case "قيد التحضير": return <Package className="w-5 h-5" />;
    case "خرج للتوصيل": return <Truck className="w-5 h-5" />;
    case "تم التسليم": return <CheckCircle2 className="w-5 h-5" />;
    default: return <Clock className="w-5 h-5" />;
  }
};

export default function MyOrders() {
  const { data: orders, isLoading } = useOrders();
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();

  if (!isAuthenticated) {
    setLocation("/api/login");
    return null;
  }

  // Filter orders for the current user as buyer
  const userOrders = orders?.filter(o => o.userId === user?.id) || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <h1 className="text-4xl font-black mb-10">طلباتي</h1>

      {isLoading ? (
        <div className="space-y-6">
          {[1,2,3].map(i => <Skeleton key={i} className="h-48 w-full rounded-3xl" />)}
        </div>
      ) : userOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-card rounded-3xl border border-border/50 text-center">
          <Package className="w-20 h-20 text-muted-foreground/30 mb-6" />
          <h2 className="text-2xl font-bold mb-2">لا توجد طلبات سابقة</h2>
          <p className="text-muted-foreground mb-6">لم تقم بإجراء أي طلبات حتى الآن.</p>
          <Link href="/" className="text-primary font-bold hover:underline">ابدأ التسوق الآن</Link>
        </div>
      ) : (
        <div className="space-y-8">
          {userOrders.map(order => {
            const currentStep = STATUS_STEPS.indexOf(order.status || "قيد المعالجة");
            
            return (
              <div key={order.id} className="bg-card border border-border/50 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="bg-muted/30 p-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/50">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">رقم الطلب #{order.id}</p>
                    <p className="font-bold">{order.createdAt ? format(new Date(order.createdAt), "dd MMMM yyyy, hh:mm a", { locale: arSA }) : ''}</p>
                  </div>
                  <div className="text-end">
                    <p className="text-sm text-muted-foreground mb-1">الإجمالي</p>
                    <p className="font-black text-xl text-primary">{order.totalAmount} ر.س</p>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  {/* Progress Tracker */}
                  <div className="mb-10 relative">
                    <div className="absolute top-1/2 start-0 end-0 h-1 bg-muted -translate-y-1/2 z-0 rounded-full" />
                    <div 
                      className="absolute top-1/2 start-0 h-1 bg-primary -translate-y-1/2 z-0 rounded-full transition-all duration-1000"
                      style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
                    />
                    
                    <div className="relative z-10 flex justify-between">
                      {STATUS_STEPS.map((step, idx) => {
                        const isCompleted = idx <= currentStep;
                        const isActive = idx === currentStep;
                        return (
                          <div key={step} className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                              isActive ? 'bg-primary border-primary/20 text-primary-foreground scale-110 shadow-lg shadow-primary/30' : 
                              isCompleted ? 'bg-primary border-primary text-primary-foreground' : 
                              'bg-card border-muted text-muted-foreground'
                            }`}>
                              {getStatusIcon(step)}
                            </div>
                            <span className={`text-xs sm:text-sm font-bold ${isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">تفاصيل المنتجات</h3>
                    {order.items?.map(item => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                          <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">الكمية: {item.quantity}</p>
                        </div>
                        <div className="font-bold text-lg">{item.price} ر.س</div>
                      </div>
                    ))}
                  </div>

                  {order.deliveryPersonName && order.status === "خرج للتوصيل" && (
                    <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/20 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <Truck className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">المندوب</p>
                        <p className="font-bold text-lg">{order.deliveryPersonName}</p>
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
