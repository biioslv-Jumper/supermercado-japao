"use server";

import { requireAdmin } from "@/lib/admin";
import { env } from "@/lib/env";
import { authErrorMessage, isEmail, validatePassword, type FormState } from "@/lib/auth-messages";

export async function changeUsername(_: FormState, fd: FormData): Promise<FormState> {
  const { supabase, user } = await requireAdmin();
  const username = String(fd.get("username") ?? "").trim().toLowerCase();
  if (!/^[a-z0-9._-]{3,40}$/.test(username)) return { error: "Use de 3 a 40 caracteres: letras minúsculas, números, ponto, hífen ou sublinhado." };
  const { error } = await supabase.from("admins").update({ username }).eq("user_id", user.id);
  if (error) return { error: error.code === "23505" ? "Este usuário já está em uso." : "Não foi possível alterar o usuário." };
  return { ok: true, message: `Usuário alterado para "${username}". Use-o no próximo login.` };
}

export async function changeAdminPassword(_: FormState, fd: FormData): Promise<FormState> {
  const { supabase, user } = await requireAdmin();
  const current = String(fd.get("current") ?? "");
  const password = String(fd.get("password") ?? "");
  const confirm = String(fd.get("confirm") ?? "");
  const pwErr = validatePassword(password);
  if (pwErr) return { error: pwErr };
  if (password !== confirm) return { error: "As senhas não conferem." };
  if (!user.email) return { error: "Conta sem e-mail." };
  const check = await supabase.auth.signInWithPassword({ email: user.email, password: current });
  if (check.error) return { error: "Senha atual incorreta." };
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: authErrorMessage(error.message, error.code) };
  return { ok: true, message: "Senha alterada com sucesso!" };
}

export async function changeAdminEmail(_: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  if (!isEmail(email)) return { error: "Informe um e-mail válido." };
  const { error } = await supabase.auth.updateUser({ email }, { emailRedirectTo: `${env.siteUrl}/auth/callback?next=/admin/conta` });
  if (error) return { error: authErrorMessage(error.message, error.code) };
  return { ok: true, message: "Enviamos um link de confirmação para o novo e-mail. A troca acontece após a confirmação." };
}
