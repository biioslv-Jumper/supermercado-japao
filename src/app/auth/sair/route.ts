import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PREVIEW_CONTENT_COOKIE, PREVIEW_THEME_COOKIE } from "@/lib/site";

/** Logout (clientes e administrador). Só aceita POST para evitar logout por link. */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const to = request.nextUrl.searchParams.get("para") === "admin" ? "/admin/login" : "/";
  const res = NextResponse.redirect(new URL(to, request.url), { status: 303 });
  res.cookies.delete(PREVIEW_CONTENT_COOKIE);
  res.cookies.delete(PREVIEW_THEME_COOKIE);
  return res;
}
