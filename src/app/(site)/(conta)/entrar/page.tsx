import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSite, getViewer } from "@/lib/site";
import { safeNext } from "@/lib/auth-messages";
import { FormMessage } from "@/components/forms";
import { AuthCard } from "../auth-card";
import { Divider, GoogleButton, LoginForm } from "../auth-forms";

export const metadata: Metadata = { title: "Entrar" };

type SP = Promise<Record<string, string | undefined>>;

export default async function LoginPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  const { user } = await getViewer();
  if (user) redirect(next);
  const { content: t } = await getSite();
  return (
    <AuthCard title={t["auth.login_title"]} subtitle={t["auth.login_subtitle"]}>
      {sp.erro && <div className="mb-3"><FormMessage state={{ error: sp.erro.slice(0, 200) }} /></div>}
      <GoogleButton label={t["auth.google_button"]} next={next} />
      <Divider />
      <LoginForm next={next} />
    </AuthCard>
  );
}
