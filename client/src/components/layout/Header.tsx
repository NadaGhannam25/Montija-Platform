import { Link, useLocation } from "wouter";
import { ShoppingCart, Bell, Menu, LogOut, ChevronDown, Grid3x3, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { useAuthLocal } from "@/hooks/use-auth-local";
import { useNotifications } from "@/hooks/use-notifications";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CATEGORY_MAP, categoryLabel } from "@/i18n/translations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const { getItemCount, setIsOpen } = useCart();
  const { user, isAuthenticated, logout } = useAuthLocal();
  const { data: notifications } = useNotifications();
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;
  const navCategories = CATEGORY_MAP.slice(1); // exclude "الكل" / "All"

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Logo & Main Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-primary/20">
              م
            </div>
            <span className="font-black text-2xl tracking-tight text-gradient">منتجة</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 font-medium text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">{t.nav.home}</Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 p-0 h-auto hover:text-primary text-muted-foreground font-medium" data-testid="button-categories-dropdown">
                  <Grid3x3 className="w-4 h-4" />
                  {t.nav.categories}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                {navCategories.map(cat => (
                  <DropdownMenuItem key={cat.ar} asChild>
                    <button
                      onClick={() => setLocation(`/?category=${encodeURIComponent(cat.ar)}`)}
                      className={`w-full ${lang === "ar" ? "text-right" : "text-left"}`}
                      data-testid={`menu-cat-${cat.en}`}
                    >
                      {lang === "ar" ? cat.ar : cat.en}
                    </button>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/faq" className="hover:text-primary transition-colors">{t.nav.faq}</Link>
            {isAuthenticated && (
              <Link href="/orders" className="hover:text-primary transition-colors">{t.nav.myOrders}</Link>
            )}
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Language Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="rounded-full border-border/50 gap-1.5 font-bold text-sm px-3 h-9"
            data-testid="button-lang-toggle"
          >
            <Languages className="w-4 h-4" />
            {t.lang}
          </Button>

          {/* Notifications */}
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover-elevate rounded-full">
                  <Bell className="w-5 h-5 text-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 end-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background animate-pulse" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>{t.nav.notifications}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications?.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">{t.nav.noNotifications}</div>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {notifications?.map(note => (
                      <DropdownMenuItem key={note.id} className="flex flex-col items-start p-3 gap-1 cursor-default">
                        <span className={`font-semibold text-sm ${!note.isRead ? 'text-primary' : ''}`}>{note.title}</span>
                        <span className="text-xs text-muted-foreground">{note.message}</span>
                      </DropdownMenuItem>
                    ))}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Cart */}
          <Button 
            variant="outline" 
            className="relative rounded-full border-border/50 bg-background/50 hover:bg-primary/5 hover:border-primary/30 transition-all gap-2"
            onClick={() => setIsOpen(true)}
            data-testid="button-cart"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-bold">{getItemCount()}</span>
          </Button>

          {/* User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden sm:flex items-center gap-2 rounded-full hover-elevate ps-2">
                  <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-sm">
                    {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col">
                  <span>{user?.firstName} {user?.lastName}</span>
                  <span className="text-xs text-muted-foreground font-normal">{user?.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">{t.nav.dashboard}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="cursor-pointer">{t.nav.myOrders}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4 me-2" />
                  {t.nav.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="hidden sm:flex rounded-full px-6 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
              <Link href="/login">{t.nav.login}</Link>
            </Button>
          )}

          {/* Mobile Menu Toggle */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="start" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-start">{t.nav.menu}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium p-2 hover:bg-muted rounded-lg">{t.nav.home}</Link>
                <Link href="/faq" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium p-2 hover:bg-muted rounded-lg">{t.nav.faq}</Link>
                <div className="text-sm font-bold text-muted-foreground px-2 mt-1">{t.nav.categories}</div>
                <div className="flex flex-col gap-1 ps-2">
                  {navCategories.map(cat => (
                    <button
                      key={cat.ar}
                      onClick={() => { setLocation(`/?category=${encodeURIComponent(cat.ar)}`); setMobileMenuOpen(false); }}
                      className="text-start text-sm p-2 hover:bg-muted rounded-lg"
                    >
                      {lang === "ar" ? cat.ar : cat.en}
                    </button>
                  ))}
                </div>
                {isAuthenticated ? (
                  <>
                    <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium p-2 hover:bg-muted rounded-lg">{t.nav.myOrders}</Link>
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium p-2 hover:bg-muted rounded-lg">{t.nav.dashboardShort}</Link>
                    <Button variant="destructive" className="mt-4 w-full" onClick={() => logout()}>
                      {t.nav.logout}
                    </Button>
                  </>
                ) : (
                  <Button asChild className="mt-4 w-full">
                    <Link href="/login">{t.nav.login}</Link>
                  </Button>
                )}
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                    className="w-full gap-2 font-bold"
                  >
                    <Languages className="w-4 h-4" />
                    {t.lang}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

        </div>
      </div>
    </header>
  );
}
