import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { CATEGORY_MAP } from "@/i18n/translations";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [, ] = useLocation();
  const { t, lang } = useLanguage();

  const ALL_AR = "الكل";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    if (cat && CATEGORY_MAP.some(c => c.ar === cat)) {
      setSelectedCategory(cat);
    }
  }, []);

  const { data: products, isLoading } = useProducts(
    selectedCategory !== ALL_AR ? selectedCategory : undefined,
    searchQuery || undefined
  );

  const getCategoryLabel = (arCat: string) => {
    if (arCat === ALL_AR) return lang === "ar" ? "الكل" : "All";
    const found = CATEGORY_MAP.find(c => c.ar === arCat);
    return found ? (lang === "ar" ? found.ar : found.en) : arCat;
  };

  const allCategories = CATEGORY_MAP.map(c => c.ar);

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background pt-16 pb-24">
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
            {t.home.heroBadge}
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-foreground mb-6 leading-tight"
          >
            {t.home.heroTitle1} <span className="text-gradient">{t.home.heroHighlight}</span> {t.home.heroTitle2} <br className="hidden md:block" /> {t.home.heroTitle3}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mb-10"
          >
            {t.home.heroDesc}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-xl relative flex items-center shadow-2xl shadow-primary/10 rounded-2xl"
          >
            <Search className="absolute start-4 text-muted-foreground w-6 h-6" />
            <Input
              placeholder={t.home.searchPlaceholder}
              className="w-full h-16 ps-14 pe-4 rounded-2xl text-lg border-2 border-border/50 bg-card focus-visible:ring-0 focus-visible:border-primary transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search"
            />
          </motion.div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Categories */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-3 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          {allCategories.map(arCat => (
            <button
              key={arCat}
              onClick={() => setSelectedCategory(arCat)}
              data-testid={`button-category-${arCat}`}
              className={`whitespace-nowrap px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex-shrink-0 ${
                selectedCategory === arCat
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30'
                  : 'bg-card text-foreground hover:bg-muted border border-border/50'
              }`}
            >
              {getCategoryLabel(arCat)}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-primary">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="text-lg font-medium">{t.home.loading}</p>
          </div>
        ) : !products?.length ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-card rounded-3xl border border-dashed border-border/60">
            <Search className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">{t.home.noResults}</h3>
            <p className="text-muted-foreground">{t.home.noResultsDesc}</p>
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

      {/* Customer Reviews Section */}
      <section className="mt-24 py-20 bg-gradient-to-b from-background to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 font-semibold text-sm mb-4 border border-orange-200 dark:border-orange-800">
              <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
              {t.home.reviewsBadge}
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">{t.home.reviewsTitle}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t.home.reviewsDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.testimonials.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-card rounded-3xl p-7 border border-border/50 shadow-sm hover:shadow-md transition-shadow relative"
                data-testid={`card-review-${i + 1}`}
              >
                <Quote className="absolute top-6 end-6 w-8 h-8 text-primary/10" />
                
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: item.rating }).map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-orange-400 text-orange-400" />
                  ))}
                </div>

                <p className="text-foreground leading-relaxed mb-6 text-[15px]">"{item.comment}"</p>

                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {item.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.store}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
