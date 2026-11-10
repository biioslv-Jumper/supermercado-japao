"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { FormMessage, PasswordInput, SubmitButton } from "@/components/forms";
import type { FormState } from "@/lib/auth-messages";
import { adminLogin } from "./actions";

export function AdminLoginForm() {
  const [state, action] = useActionState<FormState, FormData>(adminLogin, {});
  return (
    <form action={action} className="space-y-3">
      <FormMessage state={state} />
      <div>
        <label htmlFor="username" className="label">Usuário</label>
        <input id="username" name="username" autoComplete="username" autoCapitalize="none" required defaultValue={state.fields?.username} className="input" />
      </div>
      <PasswordInput name="password" label="Senha" autoComplete="current-password" />
      <SubmitButton className="btn w-full bg-red-600 py-2.5 text-white hover:bg-red-700" pendingText="Entrando...">
        <LogIn className="h-4 w-4" /> Entrar
      </SubmitButton>
    </form>
  );
}
