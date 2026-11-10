"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BadgePercent,
  CalendarClock,
  Coffee,
  ExternalLink,
  FileText,
  FolderTree,
  History,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Palette,
  Settings,
  Sparkles,
  Star,
  UserCog,
  Wrench,
  X
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", Icon: Package },
  { href: "/admin/categorias", label: "Categorias e Setores", Icon: FolderTree },
  { href: "/admin/ofertas", label: "Ofertas", Icon: BadgePercent },
  { href: "/admin/destaques", label: "Destaque da Semana", Icon: Star },
  { href: "/admin/novidades", label: "Novidades", Icon: Sparkles },
  { href: "/admin/banners", label: "Banners", Icon: ImageIcon },
  { href: "/admin/servicos", label: "Serviços", Icon: Wrench },
  { href: "/admin/cafeteria", label: "Cafeteria", Icon: Coffee },
  { href: "/admin/conteudo", label: "Conteúdo do site", Icon: FileText },
  { href: "/admin/temas", label: "Temas", Icon: Palette },
  { href: "/admin/agendamentos", label: "Agendamentos", Icon: CalendarClock },
  { href: "/admin/configuracoes", label: "Configurações", Icon: Settings },
  { href: "/admin/historico", label: "Histórico", Icon: History },
  { href: "/admin/conta", label: "Minha conta de acesso", Icon: UserCog }
];

export function AdminShell({ username, children }: { username: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`));

  const nav = (
    <nav aria-label="Menu do painel" className="space-y-0.5">
      {NAV.map(({ href, label, Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setOpen(false)}
          aria-current={isActive(href) ? "page" : undefined}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition ${
            isActive(href) ? "bg-red-600 text-white shadow" : "text-slate-200 hover:bg-white/10"
          }`}
        >
          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> {label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="hidden bg-slate-900 p-4 lg:sticky lg:top-0 lg:block lg:h-screen lg:overflow-y-auto">
        <Brand />
        {nav}
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-label="Fechar menu" />
          <aside className="relative h-full w-72 overflow-y-auto bg-slate-900 p-4">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-3 text-white" aria-label="Fechar menu">
              <X className="h-6 w-6" />
            </button>
            <Brand />
            {nav}
          </aside>
        </div>
      )}

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-2.5">
          <button onClick={() => setOpen(true)} className="rounded p-1 lg:hidden" aria-label="Abrir menu">
            <Menu className="h-6 w-6" />
          </button>
          <p className="text-sm text-slate-600">
            Olá, <strong>{username}</strong>
          </p>
          <div className="ml-auto flex items-center gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer" className="btn-outline px-3 py-1.5 text-sm">
              <ExternalLink className="h-4 w-4" aria-hidden="true" /> <span className="hidden sm:inline">Ver site</span>
            </a>
            <form action="/auth/sair?para=admin" method="post">
              <button className="btn px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4" aria-hidden="true" /> <span className="hidden sm:inline">Sair</span>
              </button>
            </form>
          </div>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <Link href="/admin" className="mb-5 flex items-center gap-3 rounded-xl bg-white p-2">
      <Image src="/brand/logo-supermercado-japao.png" alt="Japão Supermercado" width={264} height={112} unoptimized className="h-10 w-auto" />
      <span className="text-xs font-bold uppercase leading-tight text-slate-500">Painel administrativo</span>
    </Link>
  );
}
