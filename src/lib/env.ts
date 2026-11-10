// Variáveis de ambiente centralizadas. As NEXT_PUBLIC_* podem ir para o
// navegador; SUPABASE_SERVICE_ROLE_KEY só existe no servidor.
export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "")
};

export const MEDIA_BUCKET = "site-media";
