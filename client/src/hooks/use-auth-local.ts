import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { auth } from "@shared/routes";
import type { LoginInput, RegisterInput } from "@shared/auth-schema";
import { z } from "zod";

type AuthUser = z.infer<typeof auth.me.responses[200]>;

async function fetchCurrentUser(): Promise<AuthUser> {
  const res = await fetch(auth.me.path, { credentials: "include" });
  if (!res.ok) throw new Error("Not authenticated");
  const data = await res.json();
  return data;
}

async function loginUser(data: LoginInput) {
  const res = await fetch(auth.login.path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "خطأ في تسجيل الدخول");
  }
  return res.json();
}

async function registerUser(data: Omit<RegisterInput, "confirmPassword">) {
  const res = await fetch(auth.register.path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "خطأ في التسجيل");
  }
  return res.json();
}

export function useAuthLocal() {
  const queryClient = useQueryClient();
  
  const { data: user, isLoading } = useQuery<AuthUser>({
    queryKey: ["auth/me"],
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth/me"], data);
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth/me"], data);
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error?.message,
    registerError: registerMutation.error?.message,
  };
}
