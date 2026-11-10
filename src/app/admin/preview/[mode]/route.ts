import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PREVIEW_CONTENT_COOKIE, PREVIEW_THEME_COOKIE } from "@/lib/site";

/**
 * Pré-visualização (somente administrador):
 *  /admin/preview/conteudo      → mostra os textos em rascunho
 *  /admin/preview/tema?slug=... → mostra o site com um tema específico
 *  /admin/preview/sair          → volta ao normal
 * O cookie só tem efeito se o usuário for admin (checado de novo no layout).
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ mode: string }> }) {
  const { mode } = await params;
  const supabase = await createClient();
  const { data: isAdmin } = await supabase.rpc("is_admin");
  const home = new URL("/", request.url);
  const res = NextResponse.redirect(home);
  const opts = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 4 };

  if (mode === "sair" || isAdmin !== true) {
    res.cookies.delete(PREVIEW_CONTENT_COOKIE);
    res.cookies.delete(PREVIEW_THEME_COOKIE);
    return res;
  }
  if (mode === "conteudo") res.cookies.set(PREVIEW_CONTENT_COOKIE, "1", opts);
  if (mode === "tema") {
    const slug = request.nextUrl.searchParams.get("slug") ?? "";
    if (/^[a-z0-9-]{1,60}$/.test(slug)) res.cookies.set(PREVIEW_THEME_COOKIE, slug, opts);
  }
  return res;
}
