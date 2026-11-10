"use client";

import { useActionState } from "react";
import { FormMessage, PasswordInput, SubmitButton } from "@/components/forms";
import type { FormState } from "@/lib/auth-messages";
import { changeAdminEmail, changeAdminPassword, changeUsername } from "./actions";

export function AdminAccountForms({ username, email }: { username: string; email: string }) {
  const [uState, uAction] = useActionState<FormState, FormData>(changeUsername, {});
  const [pState, pAction] = useActionState<FormState, FormData>(changeAdminPassword, {});
  const [eState, eAction] = useActionState<FormState, FormData>(changeAdminEmail, {});
  const card = "space-y-3 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200";
  const btn = "btn bg-red-600 text-white hover:bg-red-700";

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <form action={uAction} className={card}>
        <h2 className="text-lg font-extrabold">Usuário de login</h2>
        <FormMessage state={uState} />
        <div>
          <label htmlFor="username" className="label">Usuário</label>
          <input id="username" name="username" defaultValue={username} required className="input" autoComplete="username" />
        </div>
        <SubmitButton className={btn} pendingText="Salvando...">Alterar usuário</SubmitButton>
      </form>

      <form action={pAction} className={card}>
        <h2 className="text-lg font-extrabold">Senha</h2>
        <FormMessage state={pState} />
        <PasswordInput name="current" label="Senha atual" autoComplete="current-password" />
        <PasswordInput name="password" label="Nova senha (mín. 8, letras e números)" autoComplete="new-password" />
        <PasswordInput name="confirm" label="Confirmar nova senha" autoComplete="new-password" />
        <SubmitButton className={btn} pendingText="Salvando...">Alterar senha</SubmitButton>
      </form>

      <form action={eAction} className={`${card} xl:col-span-2`}>
        <h2 className="text-lg font-extrabold">E-mail de recuperação</h2>
        <p className="text-sm text-slate-600">
          E-mail atual: <strong>{email}</strong>. Use um e-mail real para conseguir recuperar a senha caso a esqueça.
        </p>
        <FormMessage state={eState} />
        <div>
          <label htmlFor="email" className="label">Novo e-mail</label>
          <input id="email" name="email" type="email" required className="input max-w-md" autoComplete="email" />
        </div>
        <SubmitButton className="btn-outline" pendingText="Enviando...">Alterar e-mail</SubmitButton>
      </form>
    </div>
  );
}
