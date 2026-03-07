import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@shared/auth-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuthLocal } from "@/hooks/use-auth-local";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Lock, Users, UserCheck, Phone } from "lucide-react";

export default function Register() {
  const [, setLocation] = useLocation();
  const { register, isRegistering, registerError } = useAuthLocal();
  const { toast } = useToast();
  const { t } = useLanguage();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phone: "",
      userType: "customer",
    },
  });

  const handleSubmit = async (data: RegisterInput) => {
    try {
      const { confirmPassword, ...submitData } = data;
      register(submitData as any, {
        onSuccess: () => {
          toast({ title: t.register.successTitle, description: t.register.successDesc });
          setLocation("/");
        },
        onError: (error: any) => {
          toast({ title: t.register.errorTitle, description: error.message, variant: "destructive" });
        },
      });
    } catch (err: any) {
      toast({ title: t.register.errorTitle, description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black mb-2">{t.register.title}</h1>
          <p className="text-muted-foreground">{t.register.subtitle}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Account Type */}
            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t.register.accountType}</FormLabel>
                  <FormControl>
                    <RadioGroup value={field.value} onValueChange={field.onChange} className="grid md:grid-cols-2 gap-4">
                      {[
                        { id: "customer", label: t.register.customerLabel, icon: UserCheck, desc: t.register.customerDesc },
                        { id: "family",   label: t.register.familyLabel,   icon: Users,     desc: t.register.familyDesc   },
                      ].map(opt => (
                        <div key={opt.id} className="relative">
                          <RadioGroupItem value={opt.id} id={opt.id} className="peer sr-only" />
                          <Label
                            htmlFor={opt.id}
                            className="flex flex-col gap-3 p-6 rounded-2xl border-2 border-border/50 bg-background cursor-pointer hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <opt.icon className="w-6 h-6 text-primary" />
                              <span className="font-bold text-lg">{opt.label}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{opt.desc}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.register.firstName}</FormLabel>
                    <FormControl>
                      <Input placeholder="محمد" className="h-11 rounded-xl" data-testid="input-firstName" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.register.lastName}</FormLabel>
                    <FormControl>
                      <Input placeholder="العلي" className="h-11 rounded-xl" data-testid="input-lastName" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.register.email}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute right-4 top-3.5 w-5 h-5 text-muted-foreground" />
                      <Input
                        placeholder="your@email.com"
                        type="email"
                        className="pr-12 h-11 rounded-xl"
                        data-testid="input-register-email"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.register.phone}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute right-4 top-3.5 w-5 h-5 text-muted-foreground" />
                      <Input
                        placeholder="05XXXXXXXX"
                        type="tel"
                        dir="ltr"
                        className="pr-12 h-11 rounded-xl"
                        data-testid="input-phone"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.register.password}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute right-4 top-3.5 w-5 h-5 text-muted-foreground" />
                        <Input
                          placeholder="••••••••"
                          type="password"
                          className="pr-12 h-11 rounded-xl"
                          data-testid="input-register-password"
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
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.register.confirmPassword}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute right-4 top-3.5 w-5 h-5 text-muted-foreground" />
                        <Input
                          placeholder="••••••••"
                          type="password"
                          className="pr-12 h-11 rounded-xl"
                          data-testid="input-confirm-password"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {registerError && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-xl text-sm">{registerError}</div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full h-11 rounded-xl text-base font-semibold"
              disabled={isRegistering}
              data-testid="button-register-submit"
            >
              {isRegistering ? t.register.submitting : t.register.submit}
            </Button>
          </form>
        </Form>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">{t.register.hasAccount}</p>
          <Button
            variant="outline"
            size="lg"
            className="w-full h-11 rounded-xl"
            onClick={() => setLocation("/login")}
            data-testid="button-go-login"
          >
            {t.register.signIn}
          </Button>
        </div>
      </div>
    </div>
  );
}
