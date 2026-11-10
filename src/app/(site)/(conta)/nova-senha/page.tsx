import type { Metadata } from "next";
import Link from "next/link";
import { getViewer } from "@/lib/site";
import { AuthCard } from "../auth-card";
import { NewPasswordForm } from "../auth-forms";

export const metadata: Metadata = { title: "Nova senha" };

export default async function NewPasswordPage() {
  const { user } = await getViewer();
  return (
    <AuthCard title="Criar nova senha" subtitle={user ? "Digite sua nova senha abaixo." : undefined}>
      {user ? (
        <NewPasswordForm />
      ) : (
        <p className="text-slate-600">
          O link de recuperação expirou ou já foi usado.{" "}
          <Link href="/recuperar-senha" className="font-bold text-brand hover:underline">
            Solicitar um novo link
          </Link>
          .
        </p>
      )}
    </AuthCard>
  );
}
