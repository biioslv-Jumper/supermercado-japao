import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

/**
 * Cliente com a chave service_role. IGNORA o RLS — por isso:
 *  - só pode ser importado em código de servidor ("server-only");
 *  - é usado apenas para tarefas pontuais (ex.: descobrir o e-mail do
 *    administrador a partir do nome de usuário no login do admin).
 */
export function createServiceClient() {
  if (!env.serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada no servidor.");
  }
  return createClient(env.supabaseUrl, env.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}
