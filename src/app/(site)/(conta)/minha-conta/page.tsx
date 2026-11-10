import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { LogOut, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getSite } from "@/lib/site";
import { GoogleIcon } from "@/components/forms";
import { AccountForms } from "./account-forms";

export const metadata: Metadata = { title: "Minha Conta" };

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar?next=/minha-conta");
  const { content: t } = await getSite();
  const { data: profile } = await supabase.from("profiles").select("full_name, phone, avatar_url").eq("id", user.id).maybeSingle();

  const providers: string[] = (user.app_metadata?.providers as string[] | undefined) ?? [user.app_metadata?.provider ?? "email"];
  const hasPassword = providers.includes("email");
  const hasGoogle = providers.includes("google");
  const name = profile?.full_name ?? (user.user_metadata?.full_name as string | undefined) ?? "";
  const avatar = profile?.avatar_url ?? (user.user_metadata?.avatar_url as string | undefined);

  return (
    <div className="container-site mt-6 grid gap-5 lg:grid-cols-[320px_1fr]">
      <aside className="card h-fit p-6 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-brand/10 text-brand">
          {avatar && /^https:\/\//.test(avatar) ? (
            <Image src={avatar} alt="Foto de perfil" width={96} height={96} className="h-full w-full object-cover" unoptimized />
          ) : (
            <User className="h-12 w-12" aria-hidden="true" />
          )}
        </div>
        <h1 className="mt-3 font-display text-2xl font-extrabold">{name || t["account.title"]}</h1>
        <ul className="mt-3 space-y-1 text-sm text-slate-600">
          <li className="flex items-center justify-center gap-2 break-all">
            <Mail className="h-4 w-4 shrink-0" aria-hidden="true" /> {user.email}
          </li>
          {profile?.phone && (
            <li className="flex items-center justify-center gap-2">
              <Phone className="h-4 w-4" aria-hidden="true" /> {profile.phone}
            </li>
          )}
        </ul>
        <div className="mt-4 rounded-lg bg-slate-50 p-3 text-left text-sm">
          <p className="mb-1 font-bold text-slate-700">Forma de acesso</p>
          {hasGoogle && (
            <p className="flex items-center gap-2">
              <GoogleIcon className="h-4 w-4" /> Conta Google
            </p>
          )}
          {hasPassword && (
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-600" aria-hidden="true" /> E-mail e senha
            </p>
          )}
        </div>
        <form action="/auth/sair" method="post" className="mt-4">
          <button className="btn-outline w-full text-brand">
            <LogOut className="h-4 w-4" aria-hidden="true" /> Sair da conta
          </button>
        </form>
      </aside>

      <section>
        <h2 className="font-display text-3xl font-extrabold">{t["account.title"]}</h2>
        <p className="mb-4 text-slate-600">{t["account.subtitle"]}</p>
        <AccountForms name={name} phone={profile?.phone ?? ""} email={user.email ?? ""} hasPassword={hasPassword} isGoogleOnly={hasGoogle && !hasPassword} />
      </section>
    </div>
  );
}
