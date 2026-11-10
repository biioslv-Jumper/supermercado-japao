"use client";

import { useActionState } from "react";
import { FormMessage, PasswordInput, SubmitButton } from "@/components/forms";
import { changeEmailAction, changePasswordAction, updateProfileAction } from "../actions";
import type { FormState } from "@/lib/auth-messages";

export function AccountForms({
  name,
  phone,
  email,
  hasPassword,
  isGoogleOnly
}: {
  name: string;
  phone: string;
  email: string;
  hasPassword: boolean;
  isGoogleOnly: boolean;
}) {
  const [pState, pAction] = useActionState<FormState, FormData>(updateProfileAction, {});
  const [pwState, pwAction] = useActionState<FormState, FormData>(changePasswordAction, {});
  const [eState, eAction] = useActionState<FormState, FormData>(changeEmailAction, {});

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <form action={pAction} className="card space-y-3 p-5">
        <h3 className="text-lg font-extrabold">Dados pessoais</h3>
        <FormMessage state={pState} />
        <div>
          <label htmlFor="full_name" className="label">Nome</label>
          <input id="full_name" name="full_name" defaultValue={name} required className="input" autoComplete="name" />
        </div>
        <div>
          <label htmlFor="phone" className="label">Telefone / WhatsApp</label>
          <input id="phone" name="phone" type="tel" defaultValue={phone} className="input" autoComplete="tel" placeholder="(11) 90000-0000" />
        </div>
        <SubmitButton className="btn-brand" pendingText="Salvando...">Salvar dados</SubmitButton>
      </form>

      {hasPassword ? (
        <form action={pwAction} className="card space-y-3 p-5">
          <h3 className="text-lg font-extrabold">Alterar senha</h3>
          <FormMessage state={pwState} />
          <PasswordInput name="current" label="Senha atual" autoComplete="current-password" />
          <PasswordInput name="password" label="Nova senha" autoComplete="new-password" />
          <PasswordInput name="confirm" label="Confirmar nova senha" autoComplete="new-password" />
          <SubmitButton className="btn-brand" pendingText="Salvando...">Alterar senha</SubmitButton>
        </form>
      ) : (
        <div className="card p-5">
          <h3 className="text-lg font-extrabold">Senha</h3>
          <p className="mt-2 text-sm text-slate-600">
            Você entra com sua <strong>conta Google</strong>, por isso não há senha cadastrada aqui. A segurança do acesso é feita pelo próprio Google.
          </p>
        </div>
      )}

      <form action={eAction} className="card space-y-3 p-5 xl:col-span-2">
        <h3 className="text-lg font-extrabold">E-mail de acesso</h3>
        <FormMessage state={eState} />
        {isGoogleOnly ? (
          <p className="text-sm text-slate-600">
            Seu e-mail <strong>{email}</strong> vem da sua conta Google. Para usar outro e-mail, altere-o no Google ou crie uma nova conta.
          </p>
        ) : (
          <>
            <div>
              <label htmlFor="email" className="label">Novo e-mail (atual: {email})</label>
              <input id="email" name="email" type="email" required className="input" autoComplete="email" />
            </div>
            <SubmitButton className="btn-outline" pendingText="Enviando...">Alterar e-mail</SubmitButton>
          </>
        )}
      </form>
    </div>
  );
}
