// src/hooks/useRegister.ts
import { useMutation } from "@tanstack/react-query";
import { registerApi, User } from "@/api/auth";

type RegisterVars = { name: string; email: string; password: string };

export function useRegister() {
  return useMutation<User, Error, RegisterVars>({
    mutationFn: ({ name, email, password }) =>
      registerApi(name, email, password),
  });
}
