import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/auth-messages";

/**
 * Retorno do Supabase Auth: login com Google, confirmação de cadastro,
 * troca de e-mail e recuperação de senha. Troca o "code" por uma sessão.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const next = safeNext(url.searchParams.get("next"));
  const errorDescription = url.searchParams.get("error_description");

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as "signup" | "recovery" | "email_change" | "email" });
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
  }

  const msg = errorDescription ? "Não foi possível entrar. Tente novamente." : "O link expirou ou já foi usado. Tente novamente.";
  return NextResponse.redirect(new URL(`/entrar?erro=${encodeURIComponent(msg)}`, url.origin));
}
