"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import { authErrorMessage, isEmail, safeNext, validatePassword, type FormState } from "@/lib/auth-messages";

const field = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

export async function loginAction(_: FormState, fd: FormData): Promise<FormState> {
  const email = field(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");
  if (!isEmail(email) || !password) return { error: "Informe e-mail e senha.", fields: { email } };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: authErrorMessage(error.message, error.code), fields: { email } };
  redirect(safeNext(fd.get("next")));
}

export async function googleAction(fd: FormData) {
  const next = safeNext(fd.get("next"));
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${env.siteUrl}/auth/callback?next=${encodeURIComponent(next)}`,
      queryParams: { prompt: "select_account" }
    }
  });
  if (error || !data.url) redirect(`/entrar?erro=${encodeURIComponent(authErrorMessage(error?.message, error?.code))}`);
  redirect(data.url);
}

export async function signupAction(_: FormState, fd: FormData): Promise<FormState> {
  const full_name = field(fd, "full_name").slice(0, 120);
  const email = field(fd, "email").toLowerCase();
  const phone = field(fd, "phone").slice(0, 30);
  const password = String(fd.get("password") ?? "");
  const confirm = String(fd.get("confirm") ?? "");
  const fields = { full_name, email, phone };

  if (full_name.length < 2) return { error: "Informe seu nome.", fields };
  if (!isEmail(email)) return { error: "Informe um e-mail válido.", fields };
  if (phone && phone.replace(/\D/g, "").length < 10) return { error: "Informe o telefone com DDD.", fields };
  const pwErr = validatePassword(password);
  if (pwErr) return { error: pwErr, fields };
  if (password !== confirm) return { error: "As senhas não conferem.", fields };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name, phone },
      emailRedirectTo: `${env.siteUrl}/auth/callback?next=/minha-conta`
    }
  });
  if (error) return { error: authErrorMessage(error.message, error.code), fields };

  // Se a confirmação por e-mail estiver desligada, a sessão já vem pronta
  if (data.session) redirect("/minha-conta");
  return {
    ok: true,
    message: "Cadastro realizado! Enviamos um link de confirmação para o seu e-mail. Clique nele para ativar sua conta."
  };
}

export async function forgotAction(_: FormState, fd: FormData): Promise<FormState> {
  const email = field(fd, "email").toLowerCase();
  if (!isEmail(email)) return { error: "Informe um e-mail válido.", fields: { email } };
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${env.siteUrl}/auth/callback?next=/nova-senha`
  });
  if (error && /rate|too many/i.test(error.message)) return { error: authErrorMessage(error.message, error.code), fields: { email } };
  // Mesma resposta exista ou não a conta (não revela quais e-mails estão cadastrados)
  return { ok: true, message: "Se este e-mail estiver cadastrado, você receberá um link para criar uma nova senha." };
}

export async function newPasswordAction(_: FormState, fd: FormData): Promise<FormState> {
  const password = String(fd.get("password") ?? "");
  const confirm = String(fd.get("confirm") ?? "");
  const pwErr = validatePassword(password);
  if (pwErr) return { error: pwErr };
  if (password !== confirm) return { error: "As senhas não conferem." };
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { error: "O link expirou. Solicite a recuperação de senha novamente." };
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: authErrorMessage(error.message, error.code) };
  return { ok: true, message: "Senha alterada com sucesso!" };
}

export async function updateProfileAction(_: FormState, fd: FormData): Promise<FormState> {
  const full_name = field(fd, "full_name").slice(0, 120);
  const phone = field(fd, "phone").slice(0, 30);
  if (full_name.length < 2) return { error: "Informe seu nome." };
  if (phone && phone.replace(/\D/g, "").length < 10) return { error: "Informe o telefone com DDD." };

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar");

  const { error } = await supabase.from("profiles").upsert({ id: user.id, full_name, phone: phone || null });
  if (error) return { error: "Não foi possível salvar seus dados." };
  await supabase.auth.updateUser({ data: { full_name, phone } });
  revalidatePath("/minha-conta");
  return { ok: true, message: "Dados atualizados!" };
}

export async function changePasswordAction(_: FormState, fd: FormData): Promise<FormState> {
  const current = String(fd.get("current") ?? "");
  const password = String(fd.get("password") ?? "");
  const confirm = String(fd.get("confirm") ?? "");
  const pwErr = validatePassword(password);
  if (pwErr) return { error: pwErr };
  if (password !== confirm) return { error: "As senhas não conferem." };

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user?.email) redirect("/entrar");
  // Confirma a senha atual antes de trocar
  const check = await supabase.auth.signInWithPassword({ email: user.email, password: current });
  if (check.error) return { error: "Senha atual incorreta." };
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: authErrorMessage(error.message, error.code) };
  return { ok: true, message: "Senha alterada com sucesso!" };
}

export async function changeEmailAction(_: FormState, fd: FormData): Promise<FormState> {
  const email = field(fd, "email").toLowerCase();
  if (!isEmail(email)) return { error: "Informe um e-mail válido." };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ email }, { emailRedirectTo: `${env.siteUrl}/auth/callback?next=/minha-conta` });
  if (error) return { error: authErrorMessage(error.message, error.code) };
  return { ok: true, message: "Enviamos um link de confirmação para o novo e-mail (e um aviso para o atual). A troca acontece após a confirmação." };
}
