import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { CONTENT_DEFAULTS } from "@/lib/content-defaults";
import type { SiteSettings, Theme } from "@/lib/types";

export const PREVIEW_CONTENT_COOKIE = "sj_preview_content";
export const PREVIEW_THEME_COOKIE = "sj_preview_theme";

const DEFAULT_THEME: Theme = {
  id: "default",
  slug: "padrao",
  name: "Padrão Supermercado Japão",
  is_default: true,
  colors: { primary: "#E30613", primaryDark: "#B0000E", accent: "#FFD200", accentInk: "#1A1A1A", footer: "#0B1A2C" },
  decorations: {},
  texts: {}
};

const DEFAULT_SETTINGS: SiteSettings = {
  store_name: "Supermercado Japão",
  logo_path: null,
  favicon_path: null,
  phone: null,
  whatsapp: null,
  email: null,
  instagram_url: null,
  facebook_url: null,
  youtube_url: null,
  tiktok_url: null,
  address: null,
  address_city: null,
  maps_url: null,
  store_photo_path: null,
  opening_hours: null
};

/** Usuário logado e se ele é o administrador (consulta o banco, não o navegador). */
export const getViewer = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { user: null, isAdmin: false };
  const { data } = await supabase.rpc("is_admin");
  return { user, isAdmin: data === true };
});

/** Tudo que o layout público precisa: textos, configurações e tema. */
export const getSite = cache(async () => {
  const supabase = await createClient();
  const cookieStore = await cookies();
  const { isAdmin } = await getViewer();

  const previewContent = isAdmin && cookieStore.get(PREVIEW_CONTENT_COOKIE)?.value === "1";
  const previewThemeSlug = isAdmin ? cookieStore.get(PREVIEW_THEME_COOKIE)?.value : undefined;

  const [contentRes, settingsRes, themeRes, draftsRes, previewThemeRes] = await Promise.all([
    supabase.from("site_content").select("key, value"),
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.rpc("current_theme"),
    previewContent ? supabase.from("site_content_drafts").select("key, value") : Promise.resolve({ data: null }),
    previewThemeSlug
      ? supabase.from("themes").select("*").eq("slug", previewThemeSlug).maybeSingle()
      : Promise.resolve({ data: null })
  ]);

  const content: Record<string, string> = { ...CONTENT_DEFAULTS };
  for (const row of contentRes.data ?? []) content[row.key] = row.value;

  const themeRows = (themeRes.data as Theme[] | null) ?? [];
  const theme: Theme = (previewThemeRes.data as Theme | null) ?? themeRows[0] ?? DEFAULT_THEME;
  // Textos especiais do tema sobrescrevem os textos normais enquanto ele estiver ativo
  for (const [k, v] of Object.entries(theme.texts ?? {})) if (v) content[k] = v;

  for (const row of (draftsRes.data as { key: string; value: string }[] | null) ?? []) content[row.key] = row.value;

  return {
    content,
    settings: { ...DEFAULT_SETTINGS, ...((settingsRes.data as Partial<SiteSettings>) ?? {}) } as SiteSettings,
    theme,
    preview: { content: previewContent, theme: previewThemeRes.data ? theme.name : null }
  };
});

/** Atalho para buscar um texto: t("home.offers_title") */
export async function getT() {
  const { content } = await getSite();
  return (key: string) => content[key] ?? CONTENT_DEFAULTS[key] ?? "";
}

function hexToRgb(hex: string | undefined, fallback: string) {
  const h = (hex ?? fallback).replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return hexToRgb(fallback, "#000000");
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/** Variáveis CSS do tema atual (aplicadas no <body>). */
export function themeCssVars(theme: Theme): string {
  const c = theme.colors ?? {};
  return [
    `--brand: ${hexToRgb(c.primary, "#E30613")}`,
    `--brand-dark: ${hexToRgb(c.primaryDark, "#B0000E")}`,
    `--accent: ${hexToRgb(c.accent, "#FFD200")}`,
    `--accent-ink: ${hexToRgb(c.accentInk, "#1A1A1A")}`,
    `--footer: ${hexToRgb(c.footer, "#0B1A2C")}`
  ].join("; ");
}
