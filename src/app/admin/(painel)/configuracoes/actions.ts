"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { safeHref } from "@/lib/format";
import { MEDIA_BUCKET } from "@/lib/env";
import type { FormState } from "@/lib/auth-messages";

const TEXT_FIELDS = ["store_name", "phone", "whatsapp", "email", "address", "address_city", "opening_hours"] as const;
const URL_FIELDS = ["instagram_url", "facebook_url", "youtube_url", "tiktok_url", "maps_url"] as const;
const IMAGE_FIELDS = { logo_path: "branding/", favicon_path: "branding/", store_photo_path: "institutional/" } as const;

export async function saveSettings(_: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const row: Record<string, string | null> = {};

  for (const k of TEXT_FIELDS) row[k] = String(fd.get(k) ?? "").trim().slice(0, k === "opening_hours" ? 1000 : 200) || null;
  if (!row.store_name) return { error: "Informe o nome do supermercado." };
  if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(row.email)) return { error: "E-mail inválido." };

  for (const k of URL_FIELDS) {
    const v = String(fd.get(k) ?? "").trim();
    if (v && (!safeHref(v) || !/^https?:\/\//i.test(v))) return { error: `Link inválido: ${v}. Use o endereço completo começando com https://` };
    row[k] = v || null;
  }

  for (const [k, folder] of Object.entries(IMAGE_FIELDS)) {
    const v = String(fd.get(k) ?? "").trim();
    if (v && !(v.startsWith(folder) || v.startsWith("/demo/") || v.startsWith("/brand/"))) return { error: "Imagem inválida." };
    row[k] = v || null;
  }

  const { data: old } = await supabase.from("site_settings").select("logo_path, favicon_path, store_photo_path").eq("id", 1).maybeSingle();
  const { error } = await supabase.from("site_settings").update(row).eq("id", 1);
  if (error) return { error: "Não foi possível salvar as configurações." };

  const removed = Object.keys(IMAGE_FIELDS)
    .map((k) => (old as Record<string, string | null> | null)?.[k])
    .filter((p, i): p is string => !!p && !p.startsWith("/") && p !== row[Object.keys(IMAGE_FIELDS)[i]]);
  if (removed.length) await supabase.storage.from(MEDIA_BUCKET).remove(removed);

  revalidatePath("/", "layout");
  return { ok: true, message: "Configurações salvas! O site já foi atualizado." };
}
