"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import type { FormState } from "@/lib/auth-messages";

const GENERIC = "Usuário ou senha incorretos.";

/**
 * Login do administrador com NOME DE USUÁRIO + senha.
 * 1. No servidor, localiza o e-mail interno ligado ao usuário (tabela admins).
 * 2. Autentica pelo Supabase Auth normal (senha criptografada, sessão segura).
 * Não existe sistema de senha paralelo.
 */
export async function adminLogin(_: FormState, fd: FormData): Promise<FormState> {
  const username = String(fd.get("username") ?? "").trim().toLowerCase();
  const password = String(fd.get("password") ?? "");
  if (!username || !password) return { error: "Informe usuário e senha.", fields: { username } };
  if (!/^[a-z0-9._-]{3,40}$/.test(username)) return { error: GENERIC, fields: { username } };

  let email: string | undefined;
  try {
    const service = createServiceClient();
    const { data: admin, error: lookupError } = await service.from("admins").select("user_id").eq("username", username).maybeSingle();
    if (lookupError) {
      console.error("[admin-login] falha ao consultar admins:", lookupError.message);
      return {
        error: "A chave SUPABASE_SERVICE_ROLE_KEY cadastrada na Vercel está inválida. Copie a chave service_role novamente (veja o README) e faça Redeploy.",
        fields: { username }
      };
    }
    if (admin) {
      const { data } = await service.auth.admin.getUserById(admin.user_id);
      email = data.user?.email ?? undefined;
    }
  } catch {
    return { error: "O servidor não está configurado (SUPABASE_SERVICE_ROLE_KEY ausente). Veja o README.", fields: { username } };
  }
  if (!email) {
    // Pequena espera para não revelar se o usuário existe
    await new Promise((r) => setTimeout(r, 400));
    return { error: GENERIC, fields: { username } };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (/rate|too many/i.test(error.message)) return { error: "Muitas tentativas. Aguarde alguns minutos.", fields: { username } };
    return { error: GENERIC, fields: { username } };
  }
  redirect("/admin");
}
