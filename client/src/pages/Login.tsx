import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@shared/auth-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuthLocal } from "@/hooks/use-auth-local";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, isLoggingIn, loginError } = useAuthLocal();
  const { toast } = useToast();
  const { t } = useLanguage();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleSubmit = async (data: LoginInput) => {
    try {
      login(data, {
        onSuccess: () => {
          toast({ title: t.login.successTitle, description: t.login.successDesc });
          setLocation("/");
        },
        onError: (error: any) => {
          toast({ title: t.login.errorTitle, description: error.message, variant: "destructive" });
        },
      });
    } catch (err: any) {
      toast({ title: t.login.errorTitle, description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black mb-2">{t.login.title}</h1>
          <p className="text-muted-foreground">{t.login.subtitle}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.login.email}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute right-4 top-3.5 w-5 h-5 text-muted-foreground" />
                      <Input
                        placeholder="your@email.com"
                        type="email"
                        className="pr-12 h-11 rounded-xl"
                        data-testid="input-email"
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
                  <FormLabel>{t.login.password}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute right-4 top-3.5 w-5 h-5 text-muted-foreground" />
                      <Input
                        placeholder="••••••••"
                        type="password"
                        className="pr-12 h-11 rounded-xl"
                        data-testid="input-password"
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
              data-testid="button-login-submit"
            >
              {isLoggingIn ? t.login.submitting : t.login.submit}
            </Button>
          </form>
        </Form>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">{t.login.noAccount}</p>
          <Button
            variant="outline"
            size="lg"
            className="w-full h-11 rounded-xl"
            onClick={() => setLocation("/register")}
            data-testid="button-go-register"
          >
            {t.login.createAccount}
          </Button>
        </div>
      </div>
    </div>
  );
}
