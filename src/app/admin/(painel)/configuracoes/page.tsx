import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { PageTitle } from "@/components/admin/ui";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = { title: "Configurações" };

export default async function SettingsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return (
    <>
      <PageTitle
        title="Configurações do site"
        description="Nome, logo, favicon, telefones, endereço, redes sociais e horários. Os textos do rodapé e institucionais ficam em Conteúdo do site."
      />
      <SettingsForm values={(data as Record<string, string | null>) ?? {}} />
    </>
  );
}
