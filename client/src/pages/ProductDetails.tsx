import { useParams, Link } from "wouter";
import { useProduct } from "@/hooks/use-products";
import { useCart } from "@/store/cart";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthLocal } from "@/hooks/use-auth-local";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Minus, Plus, ShoppingCart, ArrowRight, ShieldCheck, Truck, PackageOpen, UserCircle2, Send } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";

type Review = {
  id: number;
  productId: number;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string | null;
  user: { firstName: string | null; lastName: string | null };
};

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
          disabled={!onChange}
        >
          <Star className={`w-5 h-5 transition-colors ${
            star <= (hovered || value) ? "fill-orange-400 text-orange-400" : "text-muted-foreground/30"
          }`} />
        </button>
      ))}
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useProduct(Number(id));
  const { addItem } = useCart();
  const { user, isAuthenticated } = useAuthLocal();
  const { toast } = useToast();
  const { t, lang } = useLanguage();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  const dateLocale = lang === "ar" ? arSA : enUS;

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: [`/api/products/${id}/reviews`],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}/reviews`);
      return res.json();
    },
    enabled: !!id,
  });

  const submitReview = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/products/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rating: newRating, comment: newComment }),
      });
      if (!res.ok) throw new Error("فشل إرسال التقييم");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/${id}/reviews`] });
      setNewComment("");
      setNewRating(5);
      toast({ title: t.productDetails.reviewSuccess, description: t.productDetails.reviewSuccessDesc });
    },
    onError: () => {
      toast({ title: t.productDetails.reviewError, description: t.productDetails.reviewError, variant: "destructive" });
    }
  });

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
        <h2 className="text-3xl font-bold mb-4">{t.productDetails.notFound}</h2>
        <Button asChild variant="outline">
          <Link href="/">{t.productDetails.backToProducts}</Link>
        </Button>
      </div>
    );
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : product.rating;

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors font-medium">
          <ArrowRight className="w-5 h-5 rtl:rotate-180" />
          {t.productDetails.backToProducts}
        </Link>

        {/* Product Card */}
        <div className="bg-card rounded-3xl shadow-sm border border-border/50 overflow-hidden mb-12">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="aspect-square md:aspect-auto bg-muted relative min-h-[320px]">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 start-6 bg-background/90 backdrop-blur-md px-4 py-2 rounded-full font-bold text-foreground flex items-center gap-2 shadow-lg">
                <Star className="w-5 h-5 fill-orange-400 text-orange-400" />
                {avgRating}
                <span className="text-muted-foreground font-normal text-sm">({reviews.length || product.salesCount} {lang === "ar" ? "تقييم" : "reviews"})</span>
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
                  <p className="text-sm text-muted-foreground">{lang === "ar" ? "صنع بحب بواسطة:" : "Crafted with love by:"}</p>
                  <p className="font-bold text-lg">{product.family.firstName} {product.family.lastName}</p>
                </div>
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed mb-10">{product.description}</p>

              <div className="mb-10 flex flex-wrap items-center justify-between gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{lang === "ar" ? "السعر الإجمالي" : "Total Price"}</p>
                  <p className="text-5xl font-black text-primary flex items-baseline gap-2">
                    {product.price} <span className="text-2xl">{t.productDetails.currency}</span>
                  </p>
                </div>
                
                <div className="flex items-center gap-4 bg-muted p-2 rounded-2xl border border-border/50 shadow-inner">
                  <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-background shadow-sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus className="w-5 h-5" />
                  </Button>
                  <span className="text-2xl font-black w-10 text-center">{quantity}</span>
                  <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-background shadow-sm" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full h-16 text-xl font-bold rounded-2xl shadow-xl shadow-primary/25 hover:-translate-y-1 transition-all gap-3 group"
                onClick={() => {
                  addItem(product, quantity);
                  toast({ title: t.productDetails.addedToCart, description: product.name });
                }}
                data-testid="button-add-to-cart"
              >
                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {t.productDetails.addToCart}
              </Button>

              <div className="grid grid-cols-2 gap-4 mt-10">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/30">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                  <div className="text-sm">
                    <p className="font-bold">{t.productDetails.guarantee}</p>
                    <p className="text-muted-foreground">{t.productDetails.guaranteeDesc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/30">
                  <Truck className="w-8 h-8 text-primary" />
                  <div className="text-sm">
                    <p className="font-bold">{t.productDetails.fastDelivery}</p>
                    <p className="text-muted-foreground">{t.productDetails.fastDeliveryDesc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black mb-1">{t.productDetails.reviewsTitle}</h2>
                <p className="text-muted-foreground">{reviews.length} {lang === "ar" ? "تقييم" : "reviews"}</p>
              </div>
              {reviews.length > 0 && (
                <div className="text-center">
                  <p className="text-5xl font-black text-primary">{avgRating}</p>
                  <StarRating value={Math.round(Number(avgRating))} />
                </div>
              )}
            </div>
          </div>

          <div className="divide-y divide-border/50">
            {reviewsLoading ? (
              <div className="p-8 space-y-6">
                {[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
              </div>
            ) : reviews.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                <p className="font-semibold text-lg">{t.productDetails.noReviews}</p>
                <p className="text-sm mt-1">{t.productDetails.noReviewsDesc}</p>
              </div>
            ) : reviews.map(review => (
              <div key={review.id} className="p-6 hover:bg-muted/20 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {review.user.firstName?.[0] || <UserCircle2 className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className="font-bold">{review.user.firstName} {review.user.lastName}</p>
                      <p className="text-xs text-muted-foreground">
                        {review.createdAt ? format(new Date(review.createdAt), "dd MMM yyyy", { locale: dateLocale }) : ''}
                      </p>
                    </div>
                    <StarRating value={review.rating} />
                    <p className="mt-3 text-muted-foreground leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Write a review */}
          <div className="p-8 bg-muted/20 border-t border-border/50">
            <h3 className="text-xl font-bold mb-6">{t.productDetails.writeReview}</h3>
            {isAuthenticated ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{t.productDetails.yourRating}</p>
                  <StarRating value={newRating} onChange={setNewRating} />
                </div>
                <Textarea
                  placeholder={t.productDetails.commentPlaceholder}
                  className="min-h-[100px] rounded-xl resize-none"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  data-testid="input-review-comment"
                />
                <Button
                  onClick={() => submitReview.mutate()}
                  disabled={!newComment.trim() || submitReview.isPending}
                  className="gap-2"
                  data-testid="button-submit-review"
                >
                  <Send className="w-4 h-4" />
                  {submitReview.isPending ? t.productDetails.submittingReview : t.productDetails.submitReview}
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">{t.productDetails.loginToReview}</p>
                <Button asChild variant="outline">
                  <Link href="/login">{t.nav.login}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
