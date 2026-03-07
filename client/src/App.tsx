import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";

// Components
import { Header } from "@/components/layout/Header";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Chatbot } from "@/components/layout/Chatbot";

// Pages
import Home from "@/pages/Home";
import ProductDetails from "@/pages/ProductDetails";
import Checkout from "@/pages/Checkout";
import MyOrders from "@/pages/MyOrders";
import Dashboard from "@/pages/Dashboard";
import FAQ from "@/pages/FAQ";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import OrderDetails from "@/pages/OrderDetails";

function Router() {
  return (
    <main className="flex-1 flex flex-col">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/product/:id" component={ProductDetails} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/orders" component={MyOrders} />
        <Route path="/orders/:id" component={OrderDetails} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/faq" component={FAQ} />
        <Route component={NotFound} />
      </Switch>
    </main>
  );
}

function App() {
  // Enforce RTL layout for Arabic
  useEffect(() => {
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <Header />
          <Router />
          <CartDrawer />
          <Chatbot />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
