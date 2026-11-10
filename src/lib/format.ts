import { env, MEDIA_BUCKET } from "@/lib/env";

/** Converte um caminho salvo no banco em URL de imagem.
 *  - "/demo/x.webp"      → arquivo da pasta public/ do site
 *  - "products/x.webp"   → arquivo no Supabase Storage (bucket site-media)
 *  - "https://..."       → URL completa */
export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("/") || path.startsWith("http")) return path;
  return `${env.supabaseUrl}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`;
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export function money(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "";
  return brl.format(Number(value)).replace(/ /g, " ");
}

export function discountPercent(price: number, promo: number | null): number | null {
  if (!promo || !price || promo >= price) return null;
  return Math.round(((price - promo) / price) * 100);
}

export function onlyDigits(v: string | null | undefined) {
  return (v ?? "").replace(/\D/g, "");
}

export function whatsappLink(phone: string | null | undefined, text?: string) {
  const digits = onlyDigits(phone);
  if (!digits) return null;
  const full = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${full}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function telLink(phone: string | null | undefined) {
  const d = onlyDigits(phone);
  return d ? `tel:+55${d}` : null;
}

export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Só aceita links internos ("/ofertas") ou http(s) — evita "javascript:". */
export function safeHref(url: string | null | undefined): string | null {
  if (!url) return null;
  const u = url.trim();
  if (u.startsWith("/") && !u.startsWith("//")) return u;
  if (/^https?:\/\//i.test(u)) return u;
  if (/^(mailto|tel):/i.test(u)) return u;
  return null;
}

export function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "";
  return new Date(value).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
