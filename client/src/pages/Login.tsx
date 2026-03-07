import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@shared/auth-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuthLocal } from "@/hooks/use-auth-local";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, isLoggingIn, loginError } = useAuthLocal();
  const { toast } = useToast();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleSubmit = async (data: LoginInput) => {
    try {
      login(data, {
        onSuccess: () => {
          toast({ title: "تم تسجيل الدخول بنجاح", description: "أهلاً وسهلاً بك" });
          setLocation("/");
        },
        onError: (error: any) => {
          toast({ title: "خطأ", description: error.message, variant: "destructive" });
        },
      });
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black mb-2">تسجيل الدخول</h1>
          <p className="text-muted-foreground">اختر طريقة الدخول إلى حسابك</p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute right-4 top-3.5 w-5 h-5 text-muted-foreground" />
                      <Input 
                        placeholder="your@email.com" 
                        type="email"
                        className="pr-12 h-11 rounded-xl"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute right-4 top-3.5 w-5 h-5 text-muted-foreground" />
                      <Input 
                        placeholder="••••••••" 
                        type="password"
                        className="pr-12 h-11 rounded-xl"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {loginError && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-xl text-sm">{loginError}</div>
            )}

            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-11 rounded-xl text-base font-semibold"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">ليس لديك حساب؟</p>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full h-11 rounded-xl"
            onClick={() => setLocation("/register")}
          >
            إنشاء حساب جديد
          </Button>
        </div>
      </div>
    </div>
  );
}
