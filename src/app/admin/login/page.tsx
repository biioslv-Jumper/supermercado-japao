import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getViewer } from "@/lib/site";
import { AdminLoginForm } from "./form";

export const metadata: Metadata = { title: "Acesso administrativo", robots: { index: false, follow: false } };

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const { isAdmin } = await getViewer();
  if (isAdmin) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-red-900 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-7 shadow-2xl">
        <div className="mb-5 flex justify-center">
          <Image src="/brand/logo-supermercado-japao.png" alt="Japão Supermercado" width={264} height={112} unoptimized priority className="h-16 w-auto" />
        </div>
        <h1 className="text-center text-xl font-extrabold text-slate-900">Acesso administrativo</h1>
        <p className="mb-5 text-center text-sm text-slate-500">Entre com seu usuário e senha.</p>
        {sp.erro === "sem-permissao" && (
          <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">Esta conta não tem acesso ao painel.</p>
        )}
        <AdminLoginForm />
        <p className="mt-5 text-center text-xs">
          <Link href="/" className="text-slate-500 hover:text-red-600">
            ← Voltar para o site
          </Link>
        </p>
      </div>
    </div>
  );
}
