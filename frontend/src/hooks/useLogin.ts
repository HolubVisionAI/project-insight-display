// src/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { loginApi, TokenResponse } from "@/api/auth";

export function useLogin() {
  return useMutation<
    TokenResponse, // what the mutation returns
    Error, // error type
    { email: string; password: string } // variables you pass to mutate()
  >({
    // ⚠️ this key is required for the “options” overload
    mutationFn: ({ email, password }) => loginApi(email, password),
  });
}
