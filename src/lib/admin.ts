import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Garante que quem está acessando é o ADMINISTRADOR.
 * A verificação é feita no servidor consultando a tabela "admins"
 * (nunca confiamos no navegador). Use no início de toda página e
 * de toda ação do painel.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: admin } = await supabase.from("admins").select("username").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/admin/login?erro=sem-permissao");
  return { supabase, user, username: admin.username as string };
}

/** Converte "2026-12-01T08:00" (horário de Brasília) em ISO com fuso. */
export function localToIso(v: string | null | undefined): string | null {
  if (!v) return null;
  const s = v.trim();
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s)) return null;
  return `${s.slice(0, 16)}:00-03:00`;
}

/** Converte ISO do banco para o formato do <input type="datetime-local"> em Brasília. */
export function isoToLocal(v: string | null | undefined): string {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  const br = new Date(d.getTime() - 3 * 60 * 60 * 1000);
  return br.toISOString().slice(0, 16);
}
