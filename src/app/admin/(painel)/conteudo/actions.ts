"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { PREVIEW_CONTENT_COOKIE } from "@/lib/site";

/**
 * Salva os textos do site.
 *  - intent=draft   → guarda como RASCUNHO (só o admin vê na pré-visualização)
 *  - intent=publish → publica direto no site
 */
export async function saveContent(fd: FormData) {
  const { supabase } = await requireAdmin();
  const intent = fd.get("intent") === "publish" ? "publish" : "draft";

  const { data: published } = await supabase.from("site_content").select("key, value");
  const current = new Map((published ?? []).map((r) => [r.key as string, r.value as string]));

  const changed: { key: string; value: string }[] = [];
  const unchanged: string[] = [];
  for (const [key, value] of current) {
    const raw = fd.get(`c:${key}`);
    if (raw === null) continue;
    const v = String(raw).replace(/\r\n/g, "\n").slice(0, 5000);
    if (v !== value) changed.push({ key, value: v });
    else unchanged.push(key);
  }

  if (intent === "publish") {
    for (const c of changed) await supabase.from("site_content").update({ value: c.value }).eq("key", c.key);
    await supabase.from("site_content_drafts").delete().neq("key", "");
    revalidatePath("/", "layout");
    redirect("/admin/conteudo?msg=publicado");
  }

  if (changed.length) await supabase.from("site_content_drafts").upsert(changed, { onConflict: "key" });
  if (unchanged.length) await supabase.from("site_content_drafts").delete().in("key", unchanged);
  redirect("/admin/conteudo?msg=rascunho");
}

/** Publica os rascunhos já salvos. */
export async function publishDrafts() {
  const { supabase } = await requireAdmin();
  const { data: drafts } = await supabase.from("site_content_drafts").select("key, value");
  for (const d of drafts ?? []) await supabase.from("site_content").update({ value: d.value }).eq("key", d.key);
  await supabase.from("site_content_drafts").delete().neq("key", "");
  (await cookies()).delete(PREVIEW_CONTENT_COOKIE);
  revalidatePath("/", "layout");
  redirect("/admin/conteudo?msg=publicado");
}

export async function discardDrafts() {
  const { supabase } = await requireAdmin();
  await supabase.from("site_content_drafts").delete().neq("key", "");
  (await cookies()).delete(PREVIEW_CONTENT_COOKIE);
  redirect("/admin/conteudo?msg=descartado");
}
