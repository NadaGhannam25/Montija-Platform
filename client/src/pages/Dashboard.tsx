import { useState } from "react";
import { useAuthLocal } from "@/hooks/use-auth-local";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/use-products";
import { useOrders, useUpdateOrderStatus } from "@/hooks/use-orders";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit2, Trash2, Package, TrendingUp, DollarSign, Store, Activity } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Fake data for charts to make dashboard look alive
const CHART_DATA = [
  { name: 'السبت', sales: 4000, orders: 24 },
  { name: 'الأحد', sales: 3000, orders: 18 },
  { name: 'الإثنين', sales: 2000, orders: 15 },
  { name: 'الثلاثاء', sales: 2780, orders: 20 },
  { name: 'الأربعاء', sales: 1890, orders: 12 },
  { name: 'الخميس', sales: 2390, orders: 19 },
  { name: 'الجمعة', sales: 3490, orders: 28 },
];

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthLocal();
  const { data: products } = useProducts();
  const { data: orders } = useOrders();
  const { mutateAsync: createProduct } = useCreateProduct();
  const { mutateAsync: updateProduct } = useUpdateProduct();
  const { mutateAsync: deleteProduct } = useDeleteProduct();
  const { mutateAsync: updateOrderStatus } = useUpdateOrderStatus();
  const { toast } = useToast();

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(insertProductSchema),
    defaultValues: { familyId: user?.id || "" }
  });

  if (authLoading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );

  if (!isAuthenticated) return (
    <div className="p-20 text-center">
      <p className="text-xl font-bold mb-4">يرجى تسجيل الدخول أولاً</p>
      <a href="/login" className="text-primary underline">تسجيل الدخول</a>
    </div>
  );

  // Filter data for this family
  const myProducts = products?.filter(p => p.familyId === user?.id) || [];
  const myOrders = orders?.filter(o => o.familyId === user?.id) || [];

  const totalSales = myOrders.filter(o => o.status === 'تم التسليم').reduce((sum, o) => sum + Number(o.totalAmount), 0);
  
  const onSubmitProduct = async (data: any) => {
    try {
      if (editingId) {
        await updateProduct({ id: editingId, ...data });
        toast({ title: "تم", description: "تم تحديث المنتج بنجاح" });
      } else {
        await createProduct(data);
        toast({ title: "تم", description: "تم إضافة المنتج بنجاح" });
      }
      setIsProductModalOpen(false);
      reset();
      setEditingId(null);
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    }
  };

  const handleEdit = (prod: any) => {
    setEditingId(prod.id);
    reset({
      familyId: user!.id,
      name: prod.name,
      description: prod.description,
      price: prod.price,
      imageUrl: prod.imageUrl,
      category: prod.category
    });
    setIsProductModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black flex items-center gap-3">
            <Store className="w-10 h-10 text-primary" />
            لوحة تحكم المتجر
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">أهلاً بك، {user?.firstName} {user?.lastName}</p>
        </div>
        
        <Dialog open={isProductModalOpen} onOpenChange={(open) => {
          setIsProductModalOpen(open);
          if(!open) { reset(); setEditingId(null); }
        }}>
          <DialogTrigger asChild>
            <Button size="lg" className="rounded-xl shadow-lg shadow-primary/20 gap-2">
              <Plus className="w-5 h-5" />
              إضافة منتج جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">{editingId ? "تعديل المنتج" : "إضافة منتج جديد"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmitProduct)} className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">اسم المنتج</label>
                <Input {...register("name")} className="rounded-xl bg-muted/50" />
                {errors.name && <p className="text-destructive text-xs">{errors.name.message as string}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">الوصف</label>
                <Textarea {...register("description")} className="rounded-xl bg-muted/50 resize-none h-24" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">السعر (ر.س)</label>
                  <Input type="number" step="0.01" {...register("price")} className="rounded-xl bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">التصنيف</label>
                  <select {...register("category")} className="flex h-10 w-full rounded-xl border border-input bg-muted/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="حلويات">حلويات</option>
                    <option value="موالح">موالح</option>
                    <option value="هدايا">هدايا</option>
                    <option value="عطور">عطور</option>
                    <option value="مخبوزات">مخبوزات</option>
                    <option value="منتجات يدوية">منتجات يدوية</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">رابط الصورة (URL)</label>
                <Input {...register("imageUrl")} className="rounded-xl bg-muted/50 ltr-text" dir="ltr" placeholder="https://images.unsplash.com/..." />
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full h-12 text-lg rounded-xl" disabled={isSubmitting}>
                  {isSubmitting ? "جاري الحفظ..." : "حفظ المنتج"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="stats" className="space-y-8">
        <TabsList className="bg-card border border-border/50 p-1 rounded-2xl shadow-sm h-14 w-full justify-start overflow-x-auto hide-scrollbar">
          <TabsTrigger value="stats" className="rounded-xl px-8 py-2.5 text-base font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">الإحصائيات</TabsTrigger>
          <TabsTrigger value="products" className="rounded-xl px-8 py-2.5 text-base font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">إدارة المنتجات</TabsTrigger>
          <TabsTrigger value="orders" className="rounded-xl px-8 py-2.5 text-base font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">الطلبات الواردة</TabsTrigger>
        </TabsList>

        {/* STATS TAB */}
        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
                <DollarSign className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground mb-1">إجمالي المبيعات</p>
                <h3 className="text-3xl font-black">{totalSales.toFixed(2)} ر.س</h3>
              </div>
            </div>
            <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Package className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground mb-1">الطلبات المنجزة</p>
                <h3 className="text-3xl font-black">{myOrders.filter(o => o.status === 'تم التسليم').length}</h3>
              </div>
            </div>
            <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Activity className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground mb-1">المنتجات المعروضة</p>
                <h3 className="text-3xl font-black">{myProducts.length}</h3>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-sm h-96">
              <h3 className="text-xl font-bold mb-6">المبيعات الأسبوعية</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHART_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-sm h-96">
              <h3 className="text-xl font-bold mb-6">نمو الطلبات</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CHART_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="orders" stroke="hsl(var(--primary))" strokeWidth={4} dot={{ r: 6, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        {/* PRODUCTS TAB */}
        <TabsContent value="products">
          <div className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-start">
                <thead className="bg-muted/50 border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4 text-start font-bold text-muted-foreground">المنتج</th>
                    <th className="px-6 py-4 text-start font-bold text-muted-foreground">التصنيف</th>
                    <th className="px-6 py-4 text-start font-bold text-muted-foreground">السعر</th>
                    <th className="px-6 py-4 text-start font-bold text-muted-foreground">المبيعات</th>
                    <th className="px-6 py-4 text-start font-bold text-muted-foreground">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {myProducts.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">لا توجد منتجات حالياً. أضف منتجك الأول!</td></tr>
                  ) : myProducts.map(p => (
                    <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="font-bold">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold">{p.category}</span></td>
                      <td className="px-6 py-4 font-bold text-primary">{p.price} ر.س</td>
                      <td className="px-6 py-4">{p.salesCount || 0}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(p)} className="hover:text-blue-600 bg-blue-50 text-blue-600">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => { if(confirm('تأكيد الحذف؟')) deleteProduct(p.id) }} className="hover:text-destructive bg-red-50 text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* ORDERS TAB */}
        <TabsContent value="orders">
          <div className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden p-2">
            {myOrders.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">لا توجد طلبات واردة حالياً.</div>
            ) : (
              <div className="space-y-4">
                {myOrders.map(order => (
                  <div key={order.id} className="p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-colors flex flex-wrap items-center justify-between gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">طلب #{order.id} • {order.items?.length || 0} منتجات</p>
                      <h4 className="text-lg font-bold">{order.user?.firstName} {order.user?.lastName}</h4>
                      <p className="text-sm text-muted-foreground mt-1 max-w-sm line-clamp-1">{order.deliveryAddress}</p>
                    </div>
                    
                    <div className="text-end">
                      <p className="text-primary font-black text-xl mb-2">{order.totalAmount} ر.س</p>
                      <Select 
                        defaultValue={order.status || "قيد المعالجة"}
                        onValueChange={(val) => updateOrderStatus({ id: order.id, status: val })}
                      >
                        <SelectTrigger className="w-[180px] rounded-xl border-2 border-primary/20 bg-primary/5 font-bold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="قيد المعالجة">قيد المعالجة</SelectItem>
                          <SelectItem value="قيد التحضير">قيد التحضير</SelectItem>
                          <SelectItem value="خرج للتوصيل">خرج للتوصيل</SelectItem>
                          <SelectItem value="تم التسليم">تم التسليم</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
