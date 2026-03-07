import { useCart } from "@/store/cart";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, getTotal } = useCart();
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  const handleCheckout = () => {
    setIsOpen(false);
    setLocation("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col border-s-0 shadow-2xl">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-start flex items-center gap-2 text-2xl font-bold">
            <ShoppingBag className="w-6 h-6 text-primary" />
            {t.cart.title}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
              <ShoppingBag className="w-16 h-16 opacity-20" />
              <p className="text-lg font-medium">{t.cart.empty}</p>
              <Button variant="outline" onClick={() => setIsOpen(false)}>{t.cart.browse}</Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-4 bg-card rounded-2xl p-3 border border-border/50 shadow-sm">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h4 className="font-semibold text-foreground line-clamp-1">{item.product.name}</h4>
                    <p className="text-primary font-bold mt-1">{item.product.price} {t.cart.currency}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive h-8 w-8 hover:bg-destructive/10" onClick={() => removeItem(item.product.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t pt-6 pb-2 space-y-4">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>{t.cart.total}</span>
              <span className="text-primary text-2xl">{getTotal().toFixed(2)} {t.cart.currency}</span>
            </div>
            <Button
              className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-1"
              onClick={handleCheckout}
              data-testid="button-cart-checkout"
            >
              {t.cart.checkout}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
