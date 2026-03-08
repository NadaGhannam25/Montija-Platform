import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Heart, Instagram, Twitter, Mail } from "lucide-react";

export function Footer() {
  const { lang, t } = useLanguage();

  const isAr = lang === "ar";

  return (
    <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-primary/20">
                م
              </div>
              <span className="font-black text-2xl tracking-tight text-gradient">منتجة</span>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-sm text-sm">
              {isAr
                ? "سوق رقمي يجمع أفضل ما تصنعه الأسر المنتجة المحلية — من المطبخ إلى باب منزلك."
                : "A digital marketplace bringing you the finest products from local productive families — from their kitchen to your door."}
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="#" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors" aria-label="Twitter/X">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="mailto:hello@muntija.sa" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors" aria-label="Email">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">
              {isAr ? "روابط سريعة" : "Quick Links"}
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: isAr ? "الرئيسية" : "Home" },
                { href: "/about", label: isAr ? "من نحن" : "About Us" },
                { href: "/faq", label: isAr ? "الأسئلة الشائعة" : "FAQ" },
                { href: "/orders", label: isAr ? "طلباتي" : "My Orders" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">
              {isAr ? "التصنيفات" : "Categories"}
            </h4>
            <ul className="space-y-3">
              {[
                { ar: "حلويات", en: "Sweets" },
                { ar: "مخبوزات", en: "Bakery" },
                { ar: "هدايا", en: "Gifts" },
                { ar: "عطور", en: "Perfumes" },
                { ar: "منتجات يدوية", en: "Handmade" },
              ].map(cat => (
                <li key={cat.ar}>
                  <Link
                    href={`/?category=${encodeURIComponent(cat.ar)}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {isAr ? cat.ar : cat.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50 pt-8 flex flex-col items-center gap-2 text-center">
          <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            {isAr ? "صُنع بكل الحب لأجلك" : "Made with love for you"}
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 inline" />
          </p>
          <p className="text-xs text-muted-foreground">
            {isAr
              ? `© ${new Date().getFullYear()} منتجة. جميع الحقوق محفوظة.`
              : `© ${new Date().getFullYear()} Muntija. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
