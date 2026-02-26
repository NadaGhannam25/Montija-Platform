import { useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const CATEGORIES = ["الكل", "حلويات", "موالح", "هدايا", "عطور"];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: products, isLoading } = useProducts(
    selectedCategory !== "الكل" ? selectedCategory : undefined,
    searchQuery || undefined
  );

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background pt-16 pb-24">
        {/* landing page hero background abstract shapes */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 border border-primary/20"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            دعم الأسر المنتجة المحلية
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-foreground mb-6 leading-tight"
          >
            اكتشف <span className="text-gradient">الإبداع</span> في <br className="hidden md:block"/> كل منتج
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mb-10"
          >
            سوق رقمي يجمع لك أفضل ما تصنعه الأيدي المحلية بعناية وحب. من الحلويات الشهية إلى الهدايا الفريدة.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-xl relative flex items-center shadow-2xl shadow-primary/10 rounded-2xl"
          >
            <Search className="absolute start-4 text-muted-foreground w-6 h-6" />
            <Input 
              placeholder="ابحث عن منتج، متجر، أو صنف..." 
              className="w-full h-16 ps-14 pe-4 rounded-2xl text-lg border-2 border-border/50 bg-card focus-visible:ring-0 focus-visible:border-primary transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Categories */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-3 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                selectedCategory === cat 
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30' 
                  : 'bg-card text-foreground hover:bg-muted border border-border/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-primary">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="text-lg font-medium">جاري تحميل المنتجات...</p>
          </div>
        ) : !products?.length ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-card rounded-3xl border border-dashed border-border/60">
            <Search className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">لا توجد نتائج</h3>
            <p className="text-muted-foreground">لم نتمكن من العثور على منتجات تطابق بحثك. جرب كلمات أخرى.</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
