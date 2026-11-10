import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export function PageTitle({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
        {description && <p className="mt-0.5 max-w-3xl text-sm text-slate-600">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

const MESSAGES: Record<string, string> = {
  criado: "Cadastro criado com sucesso!",
  alterado: "Alterações salvas com sucesso!",
  excluido: "Item excluído.",
  publicado: "Textos publicados no site!",
  rascunho: "Rascunho salvo. Use \"Visualizar\" para conferir antes de publicar.",
  descartado: "Rascunhos descartados."
};

export function SuccessBanner({ msg }: { msg?: string }) {
  if (!msg || !MESSAGES[msg]) return null;
  return (
    <p role="status" className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-800 ring-1 ring-green-200">
      <CheckCircle2 className="h-5 w-5" aria-hidden="true" /> {MESSAGES[msg]}
    </p>
  );
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5 ${className}`}>{children}</div>;
}

export function StatCard({ label, value, href, Icon, tone = "red" }: { label: string; value: string | number; href?: string; Icon: React.ElementType; tone?: "red" | "amber" | "green" | "blue" | "violet" | "slate" }) {
  const tones = {
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    slate: "bg-slate-100 text-slate-600"
  };
  const inner = (
    <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:ring-red-300">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="truncate text-2xl font-extrabold text-slate-900">{value}</p>
      </div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}
