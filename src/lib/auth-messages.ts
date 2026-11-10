// Traduz mensagens do Supabase Auth para português claro.
export function authErrorMessage(message?: string | null, code?: string | null): string {
  const m = `${code ?? ""} ${message ?? ""}`.toLowerCase();
  if (m.includes("invalid login credentials") || m.includes("invalid_credentials")) return "E-mail ou senha incorretos.";
  if (m.includes("email not confirmed")) return "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada (e o spam).";
  if (m.includes("user already registered") || m.includes("already been registered")) return "Este e-mail já está cadastrado. Tente entrar ou recuperar a senha.";
  if (m.includes("password should be at least") || m.includes("weak_password")) return "A senha precisa ter pelo menos 8 caracteres, com letras e números.";
  if (m.includes("same_password") || m.includes("different from the old")) return "A nova senha precisa ser diferente da atual.";
  if (m.includes("rate limit") || m.includes("over_email_send_rate_limit") || m.includes("too many")) return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
  if (m.includes("unable to validate email") || m.includes("invalid format")) return "Informe um e-mail válido.";
  if (m.includes("provider is not enabled") || m.includes("unsupported provider")) return "O login com Google ainda não foi ativado no Supabase.";
  if (m.includes("expired") || m.includes("otp")) return "O link expirou ou já foi usado. Solicite um novo.";
  return "Não foi possível concluir agora. Tente novamente em instantes.";
}

export type FormState = { ok?: boolean; error?: string; message?: string; fields?: Record<string, string> };

export function validatePassword(pw: string): string | null {
  if (pw.length < 8) return "A senha precisa ter pelo menos 8 caracteres.";
  if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return "Use letras e números na senha.";
  return null;
}

export function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

/** Aceita apenas caminhos internos para redirecionar depois do login. */
export function safeNext(v: unknown, fallback = "/minha-conta") {
  const s = typeof v === "string" ? v : "";
  return s.startsWith("/") && !s.startsWith("//") && !s.startsWith("/\\") ? s : fallback;
}
