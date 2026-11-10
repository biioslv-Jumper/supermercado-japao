"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { localToIso, requireAdmin } from "@/lib/admin";
import { getResource, type Resource } from "@/lib/admin-resources";
import { safeHref, slugify } from "@/lib/format";
import { ICON_OPTIONS } from "@/components/icon";
import { MEDIA_BUCKET } from "@/lib/env";
import type { FormState } from "@/lib/auth-messages";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Row = Record<string, unknown>;

function parseMoney(v: string): number | null | "invalid" {
  if (!v) return null;
  const n = Number(v.replace(/\s|R\$/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", "."));
  return Number.isFinite(n) && n >= 0 && n < 1_000_000 ? Math.round(n * 100) / 100 : "invalid";
}

function isStoragePath(p: unknown): p is string {
  return typeof p === "string" && p.length > 0 && !p.startsWith("/") && !p.startsWith("http");
}

function dbError(error: { code?: string; message?: string }) {
  if (error.code === "23505") return "Já existe um registro com esse nome/endereço. Altere e tente novamente.";
  if (error.code === "23503") return "Este item está sendo usado em outro cadastro.";
  if (error.code === "23514") return "Algum valor não é permitido (ex.: data final antes da inicial ou preço negativo).";
  if (error.code === "42501") return "Sem permissão para esta ação.";
  return "Não foi possível salvar. Verifique os campos e tente novamente.";
}

/** Lê e valida os campos do formulário conforme a configuração do recurso. */
function parseForm(resource: Resource, fd: FormData): { row: Row; virtual: Row; error?: string } {
  const row: Row = {};
  const virtual: Row = {};
  const nested: Record<string, Row> = {};

  for (const f of resource.fields) {
    const raw = String(fd.get(f.name) ?? "").trim();
    let value: unknown;

    switch (f.type) {
      case "boolean":
        value = fd.get(f.name) === "on";
        break;
      case "money": {
        const m = parseMoney(raw);
        if (m === "invalid") return { row, virtual, error: `Valor inválido em "${f.label}".` };
        value = m;
        break;
      }
      case "number": {
        const n = raw === "" ? (typeof f.default === "number" ? f.default : 0) : Number(raw);
        if (!Number.isInteger(n) || Math.abs(n) > 1_000_000) return { row, virtual, error: `Número inválido em "${f.label}".` };
        value = n;
        break;
      }
      case "relation":
        if (raw && !UUID.test(raw)) return { row, virtual, error: `Seleção inválida em "${f.label}".` };
        value = raw || null;
        break;
      case "select":
        if (raw && f.options && !f.options.some((o) => o.value === raw)) return { row, virtual, error: `Opção inválida em "${f.label}".` };
        value = raw || null;
        break;
      case "icon":
        value = raw && ICON_OPTIONS.includes(raw) ? raw : null;
        break;
      case "url":
        if (raw && !safeHref(raw)) return { row, virtual, error: `Link inválido em "${f.label}". Use /pagina ou https://...` };
        value = raw || null;
        break;
      case "image":
        if (raw && !(raw.startsWith(`${f.folder}/`) || raw.startsWith("/demo/") || raw.startsWith("/brand/")))
          return { row, virtual, error: `Imagem inválida em "${f.label}".` };
        value = raw || null;
        break;
      case "datetime":
        value = localToIso(raw);
        if (raw && !value) return { row, virtual, error: `Data inválida em "${f.label}".` };
        break;
      case "color":
        if (raw && !/^#[0-9a-f]{6}$/i.test(raw)) return { row, virtual, error: `Cor inválida em "${f.label}".` };
        value = raw || null;
        break;
      case "slug":
        value = slugify(raw || String(fd.get(f.slugFrom ?? "name") ?? ""));
        if (!value) return { row, virtual, error: `Preencha "${f.label}".` };
        break;
      case "keyvalue": {
        const obj: Record<string, string> = {};
        for (const line of raw.split("\n")) {
          const idx = line.indexOf("=");
          if (idx < 1) continue;
          const k = line.slice(0, idx).trim();
          const v = line.slice(idx + 1).trim();
          if (/^[a-z0-9_.]+$/.test(k) && v) obj[k] = v.slice(0, 2000);
        }
        value = obj;
        break;
      }
      default:
        value = raw ? raw.slice(0, f.type === "textarea" ? 5000 : 300) : null;
    }

    if (f.required && (value === null || value === "")) return { row, virtual, error: `Preencha o campo "${f.label}".` };

    if (f.virtual) virtual[f.name] = value;
    else if (f.name.includes(".")) {
      const [parent, child] = f.name.split(".");
      nested[parent] = { ...(nested[parent] ?? {}), ...(value ? { [child]: value } : {}) };
    } else row[f.name] = value;
  }
  for (const [k, v] of Object.entries(nested)) row[k] = v;

  if (row.starts_at && row.ends_at && String(row.ends_at) <= String(row.starts_at)) {
    return { row, virtual, error: "A data final precisa ser depois da data inicial." };
  }
  return { row, virtual };
}

export async function saveResource(key: string, id: string | null, _: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const resource = getResource(key);
  if (!resource || (id && !UUID.test(id))) return { error: "Cadastro inválido." };

  const { row, virtual, error } = parseForm(resource, fd);
  if (error) return { error };

  // Regras específicas
  if (resource.table === "products" && virtual.offer_enabled) {
    const op = virtual.offer_price as number | null;
    if (!op) return { error: "Informe o preço promocional ou desmarque \"Em oferta\"." };
    if (op >= (row.price as number)) return { error: "O preço promocional precisa ser menor que o preço normal." };
  }
  if (resource.table === "offers" && row.product_id) {
    const { data: p } = await supabase.from("products").select("price").eq("id", row.product_id as string).maybeSingle();
    if (p && (row.promo_price as number) >= Number(p.price)) return { error: "O preço da oferta precisa ser menor que o preço normal do produto." };
  }

  let old: Row | null = null;
  if (id) {
    const { data } = await supabase.from(resource.table).select("*").eq("id", id).maybeSingle();
    if (!data) return { error: "Registro não encontrado." };
    old = data as Row;
    if (resource.table === "themes" && old.is_default && row.is_active === false) {
      return { error: "O tema padrão não pode ser desativado." };
    }
  }

  let savedId = id;
  const attempt = async (data: Row) =>
    id
      ? supabase.from(resource.table).update(data).eq("id", id).select("id").single()
      : supabase.from(resource.table).insert(data).select("id").single();

  let res = await attempt(row);
  // Endereço (slug) repetido: tenta novamente com um sufixo
  if (res.error?.code === "23505" && typeof row.slug === "string") {
    row.slug = `${row.slug}-${Math.random().toString(36).slice(2, 6)}`;
    res = await attempt(row);
  }
  if (res.error) return { error: dbError(res.error) };
  savedId = (res.data as { id: string }).id;

  // Produto: sincroniza a "oferta simples" (sem datas) a partir do formulário
  if (resource.table === "products" && savedId) {
    const { data: simple } = await supabase
      .from("offers")
      .select("id")
      .eq("product_id", savedId)
      .is("starts_at", null)
      .is("ends_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (virtual.offer_enabled) {
      const payload = { promo_price: virtual.offer_price as number, is_active: true };
      if (simple) await supabase.from("offers").update(payload).eq("id", simple.id);
      else await supabase.from("offers").insert({ ...payload, product_id: savedId, badge_label: "Oferta especial" });
    } else if (simple) {
      await supabase.from("offers").update({ is_active: false }).eq("product_id", savedId).is("starts_at", null).is("ends_at", null);
    }
  }

  // Remove do Storage imagens substituídas
  if (old) {
    const removed = resource.fields
      .filter((f) => f.type === "image" && old![f.name] !== row[f.name] && isStoragePath(old![f.name]))
      .map((f) => old![f.name] as string);
    if (removed.length) await supabase.storage.from(MEDIA_BUCKET).remove(removed);
  }

  revalidatePath("/", "layout");
  redirect(`/admin/${resource.key}?msg=${id ? "alterado" : "criado"}`);
}

export async function deleteResource(key: string, id: string) {
  const { supabase } = await requireAdmin();
  const resource = getResource(key);
  if (!resource || !UUID.test(id)) return { error: "Cadastro inválido." };
  const { data: old } = await supabase.from(resource.table).select("*").eq("id", id).maybeSingle();
  if (!old) return { error: "Registro não encontrado." };
  if (resource.table === "themes" && (old as Row).is_default) return { error: "O tema padrão não pode ser excluído." };

  const { error } = await supabase.from(resource.table).delete().eq("id", id);
  if (error) return { error: dbError(error) };

  const images = resource.fields.filter((f) => f.type === "image").map((f) => (old as Row)[f.name]).filter(isStoragePath);
  if (images.length) await supabase.storage.from(MEDIA_BUCKET).remove(images);

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function toggleActive(key: string, id: string) {
  const { supabase } = await requireAdmin();
  const resource = getResource(key);
  if (!resource?.hasActive || !UUID.test(id)) return;
  const { data } = await supabase.from(resource.table).select("is_active, is_default").eq("id", id).maybeSingle();
  if (!data) return;
  if ((data as Row).is_default && data.is_active) return; // tema padrão sempre ativo
  await supabase.from(resource.table).update({ is_active: !data.is_active }).eq("id", id);
  revalidatePath("/", "layout");
}

/** Move um item para cima/baixo trocando a ordem com o vizinho. */
export async function moveResource(key: string, id: string, direction: "up" | "down") {
  const { supabase } = await requireAdmin();
  const resource = getResource(key);
  if (!resource?.sortable || !UUID.test(id)) return;
  const { data: rows } = await supabase.from(resource.table).select("id, sort_order").order("sort_order").order("id");
  if (!rows) return;
  // Normaliza a ordem (0,10,20...) para permitir trocas mesmo com valores repetidos
  const list = rows.map((r, i) => ({ id: r.id as string, sort_order: i * 10 }));
  const idx = list.findIndex((r) => r.id === id);
  const swap = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swap < 0 || swap >= list.length) return;
  [list[idx].sort_order, list[swap].sort_order] = [list[swap].sort_order, list[idx].sort_order];
  const changed = list.filter((r, i) => r.sort_order !== Number(rows[i].sort_order));
  await Promise.all(changed.map((r) => supabase.from(resource.table).update({ sort_order: r.sort_order }).eq("id", r.id)));
  revalidatePath("/", "layout");
}

export async function setDefaultTheme(id: string) {
  const { supabase } = await requireAdmin();
  if (!UUID.test(id)) return;
  // Remove o padrão atual e define o novo (índice único garante só um padrão)
  await supabase.from("themes").update({ is_default: false }).eq("is_default", true);
  await supabase.from("themes").update({ is_default: true, is_active: true }).eq("id", id);
  revalidatePath("/", "layout");
}

/** Registra no banco a imagem enviada pelo painel (tabela media). */
export async function registerMedia(path: string, folder: string, mime: string, size: number) {
  const { supabase, user } = await requireAdmin();
  if (!isStoragePath(path) || !path.startsWith(`${folder}/`)) return;
  await supabase.from("media").upsert({ bucket: MEDIA_BUCKET, path, folder, mime_type: mime, size_bytes: size, uploaded_by: user.id }, { onConflict: "bucket,path" });
}

