import { useParams, Link } from "wouter";
import { useProduct } from "@/hooks/use-products";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Star, Minus, Plus, ShoppingCart, ArrowRight, ShieldCheck, Truck, PackageOpen } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useProduct(Number(id));
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-3xl" />
          <div className="space-y-6 pt-8">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-16 w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <PackageOpen className="w-20 h-20 text-muted-foreground/30 mb-6" />
        <h2 className="text-3xl font-bold mb-4">المنتج غير موجود</h2>
        <Button asChild variant="outline">
          <Link href="/">العودة للرئيسية</Link>
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors font-medium">
          <ArrowRight className="w-5 h-5 rtl:rotate-180" />
          العودة للتسوق
        </Link>

        <div className="bg-card rounded-3xl shadow-sm border border-border/50 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Gallery */}
            <div className="aspect-square md:aspect-auto bg-muted relative">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 start-6 bg-background/90 backdrop-blur-md px-4 py-2 rounded-full font-bold text-foreground flex items-center gap-2 shadow-lg">
                <Star className="w-5 h-5 fill-orange-400 text-orange-400" />
                {product.rating} <span className="text-muted-foreground font-normal text-sm">({product.salesCount} تقييم)</span>
              </div>
            </div>

            {/* Details */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm w-max mb-6">
                {product.category}
              </div>
              
              <h1 className="text-4xl font-black text-foreground mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-3 mb-8 pb-8 border-b border-border/50">
                <div className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xl">
                  {product.family.firstName?.[0] || 'أ'}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">صنع بحب بواسطة:</p>
                  <p className="font-bold text-lg">{product.family.firstName} {product.family.lastName}</p>
                </div>
              </div>

              <div className="prose prose-neutral dark:prose-invert mb-10 text-muted-foreground text-lg leading-relaxed">
                <p>{product.description}</p>
              </div>

              <div className="mb-10 flex flex-wrap items-center justify-between gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">السعر الإجمالي</p>
                  <p className="text-5xl font-black text-primary flex items-baseline gap-2">
                    {product.price} <span className="text-2xl">ر.س</span>
                  </p>
                </div>
                
                <div className="flex items-center gap-4 bg-muted p-2 rounded-2xl border border-border/50 shadow-inner">
                  <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-background shadow-sm hover:bg-background/80" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus className="w-5 h-5" />
                  </Button>
                  <span className="text-2xl font-black w-10 text-center">{quantity}</span>
                  <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-background shadow-sm hover:bg-background/80" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full h-16 text-xl font-bold rounded-2xl shadow-xl shadow-primary/25 hover:-translate-y-1 transition-all gap-3 group"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                إضافة إلى السلة
              </Button>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-4 mt-10">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/30">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                  <div className="text-sm">
                    <p className="font-bold">جودة مضمونة</p>
                    <p className="text-muted-foreground">صنع منزلي أصيل</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/30">
                  <Truck className="w-8 h-8 text-primary" />
                  <div className="text-sm">
                    <p className="font-bold">توصيل سريع</p>
                    <p className="text-muted-foreground">لباب منزلك مباشرة</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
