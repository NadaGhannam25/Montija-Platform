import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type AuthUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  userType: string;
};

async function fetchCurrentUser(): Promise<AuthUser | null> {
  const res = await fetch('/api/auth/me', { credentials: "include" });
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

async function loginUser(data: { email: string; password: string }) {
  const res = await fetch('/api/auth/login', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "خطأ في تسجيل الدخول");
  }
  return res.json() as Promise<AuthUser>;
}

async function registerUser(data: { email: string; password: string; firstName: string; lastName: string; userType: string }) {
  const res = await fetch('/api/auth/register', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "خطأ في التسجيل");
  }
  return res.json() as Promise<AuthUser>;
}

async function logoutUser() {
  await fetch('/api/auth/logout', { method: "POST", credentials: "include" });
}

export function useAuthLocal() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<AuthUser | null>({
    queryKey: ["auth/me"],
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth/me"], data);
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth/me"], data);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(["auth/me"], null);
      queryClient.clear();
    },
  });

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error?.message,
    registerError: registerMutation.error?.message,
  };
}
