import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSite, getViewer } from "@/lib/site";
import { AuthCard } from "../auth-card";
import { Divider, GoogleButton, SignupForm } from "../auth-forms";

export const metadata: Metadata = { title: "Criar conta" };

export default async function SignupPage() {
  const { user } = await getViewer();
  if (user) redirect("/minha-conta");
  const { content: t } = await getSite();
  return (
    <AuthCard title={t["auth.signup_title"]} subtitle={t["auth.signup_subtitle"]}>
      <GoogleButton label={t["auth.google_button"]} />
      <Divider />
      <SignupForm />
    </AuthCard>
  );
}
