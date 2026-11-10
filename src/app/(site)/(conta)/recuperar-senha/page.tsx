import type { Metadata } from "next";
import { getSite } from "@/lib/site";
import { AuthCard } from "../auth-card";
import { ForgotForm } from "../auth-forms";

export const metadata: Metadata = { title: "Recuperar senha" };

export default async function ForgotPage() {
  const { content: t } = await getSite();
  return (
    <AuthCard title={t["auth.forgot_title"]} subtitle={t["auth.forgot_subtitle"]}>
      <ForgotForm />
    </AuthCard>
  );
}
