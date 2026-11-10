import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { PageTitle } from "@/components/admin/ui";
import { AdminAccountForms } from "./forms";

export const metadata: Metadata = { title: "Minha conta de acesso" };

export default async function AdminAccountPage() {
  const { user, username } = await requireAdmin();
  return (
    <>
      <PageTitle
        title="Minha conta de acesso"
        description="Altere o usuário e a senha usados para entrar no painel. A senha é guardada de forma criptografada pelo Supabase Auth."
      />
      <AdminAccountForms username={username} email={user.email ?? ""} />
    </>
  );
}
