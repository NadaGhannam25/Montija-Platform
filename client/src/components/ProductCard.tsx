import { Link } from "wouter";
import { Star, ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import type { ProductWithFamily } from "@shared/schema";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export function ProductCard({ product }: { product: ProductWithFamily }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const { t } = useLanguage();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Link href={`/product/${product.id}`}>
      <div
        className="group bg-card rounded-2xl border border-border/50 overflow-hidden card-hover h-full flex flex-col"
        data-testid={`card-product-${product.id}`}
      >
        <div className="aspect-[4/3] relative overflow-hidden bg-muted">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 start-3 bg-background/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-foreground flex items-center gap-1 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
            {product.rating}
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <span>{t.productCard.store}</span>
            <span className="font-semibold text-foreground">{product.family.firstName || 'أسرة منتجة'}</span>
          </div>
          
          <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
            {product.description}
          </p>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
            <span className="font-black text-xl text-primary">{product.price} <span className="text-sm font-semibold">{t.productCard.currency}</span></span>
            
            <Button 
              size="icon" 
              className={`rounded-full transition-all duration-300 ${added ? 'bg-green-500 hover:bg-green-600' : ''}`}
              onClick={handleAdd}
              data-testid={`button-add-cart-${product.id}`}
            >
              {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
