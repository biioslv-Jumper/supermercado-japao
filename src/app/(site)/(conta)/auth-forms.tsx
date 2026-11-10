"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FormMessage, GoogleIcon, PasswordInput, SubmitButton } from "@/components/forms";
import { forgotAction, googleAction, loginAction, newPasswordAction, signupAction } from "./actions";
import type { FormState } from "@/lib/auth-messages";

export function GoogleButton({ label, next }: { label: string; next?: string }) {
  return (
    <form action={googleAction}>
      <input type="hidden" name="next" value={next ?? "/minha-conta"} />
      <SubmitButton className="btn w-full border border-slate-300 bg-white py-2.5 text-ink hover:bg-slate-50" pendingText="Abrindo o Google...">
        <GoogleIcon className="h-5 w-5" /> {label}
      </SubmitButton>
    </form>
  );
}

export function Divider() {
  return (
    <div className="my-4 flex items-center gap-3 text-xs uppercase text-slate-400">
      <span className="h-px flex-1 bg-slate-200" /> ou <span className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState<FormState, FormData>(loginAction, {});
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="next" value={next ?? "/minha-conta"} />
      <FormMessage state={state} />
      <div>
        <label htmlFor="email" className="label">E-mail</label>
        <input id="email" name="email" type="email" autoComplete="email" required defaultValue={state.fields?.email} className="input" />
      </div>
      <PasswordInput name="password" label="Senha" autoComplete="current-password" />
      <div className="text-right">
        <Link href="/recuperar-senha" className="text-sm font-semibold text-brand hover:underline">
          Esqueci minha senha
        </Link>
      </div>
      <SubmitButton pendingText="Entrando...">Entrar</SubmitButton>
      <p className="text-center text-sm text-slate-600">
        Não tem conta?{" "}
        <Link href="/cadastro" className="font-bold text-brand hover:underline">
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}

export function SignupForm() {
  const [state, action] = useActionState<FormState, FormData>(signupAction, {});
  if (state.ok) return <FormMessage state={state} />;
  return (
    <form action={action} className="space-y-3">
      <FormMessage state={state} />
      <div>
        <label htmlFor="full_name" className="label">Nome completo</label>
        <input id="full_name" name="full_name" autoComplete="name" required defaultValue={state.fields?.full_name} className="input" />
      </div>
      <div>
        <label htmlFor="email" className="label">E-mail</label>
        <input id="email" name="email" type="email" autoComplete="email" required defaultValue={state.fields?.email} className="input" />
      </div>
      <div>
        <label htmlFor="phone" className="label">Telefone / WhatsApp</label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="(11) 90000-0000" defaultValue={state.fields?.phone} className="input" />
      </div>
      <PasswordInput name="password" label="Senha (mín. 8 caracteres, letras e números)" autoComplete="new-password" />
      <PasswordInput name="confirm" label="Confirmar senha" autoComplete="new-password" />
      <SubmitButton pendingText="Criando conta...">Criar conta</SubmitButton>
      <p className="text-center text-sm text-slate-600">
        Já tem conta?{" "}
        <Link href="/entrar" className="font-bold text-brand hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}

export function ForgotForm() {
  const [state, action] = useActionState<FormState, FormData>(forgotAction, {});
  return (
    <form action={action} className="space-y-3">
      <FormMessage state={state} />
      {!state.ok && (
        <>
          <div>
            <label htmlFor="email" className="label">E-mail</label>
            <input id="email" name="email" type="email" autoComplete="email" required defaultValue={state.fields?.email} className="input" />
          </div>
          <SubmitButton pendingText="Enviando...">Enviar link</SubmitButton>
        </>
      )}
      <p className="text-center text-sm">
        <Link href="/entrar" className="font-bold text-brand hover:underline">
          Voltar para o login
        </Link>
      </p>
    </form>
  );
}

export function NewPasswordForm() {
  const [state, action] = useActionState<FormState, FormData>(newPasswordAction, {});
  if (state.ok)
    return (
      <div className="space-y-3">
        <FormMessage state={state} />
        <Link href="/minha-conta" className="btn-brand w-full">
          Ir para Minha Conta
        </Link>
      </div>
    );
  return (
    <form action={action} className="space-y-3">
      <FormMessage state={state} />
      <PasswordInput name="password" label="Nova senha" autoComplete="new-password" />
      <PasswordInput name="confirm" label="Confirmar nova senha" autoComplete="new-password" />
      <SubmitButton pendingText="Salvando...">Salvar nova senha</SubmitButton>
    </form>
  );
}
