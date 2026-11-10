import Link from "next/link";
import { Search } from "lucide-react";
import { getSite, getViewer } from "@/lib/site";
import { Logo } from "./logo";
import { NavBar, type NavItem } from "./nav-bar";
import { UserMenu } from "./user-menu";

export async function Header() {
  const { content: t, settings } = await getSite();
  const { user } = await getViewer();

  const items: NavItem[] = [
    { href: "/", label: t["nav.home"], icon: "home" },
    { href: "/ofertas", label: t["nav.offers"], icon: "tag" },
    { href: "/setores", label: t["nav.sectors"], icon: "grid" },
    { href: "/servicos", label: t["nav.services"], icon: "settings" },
    { href: "/cartao-japao", label: t["nav.card"], icon: "card" },
    { href: "/contato", label: t["nav.contact"], icon: "phone" },
    { href: "/app", label: t["nav.app"], icon: "smartphone" }
  ];

  const name =
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    (user?.user_metadata?.name as string | undefined)?.split(" ")[0];

  return (
    <header className="relative z-30">
      <div className="hero-red relative overflow-hidden">
        <Torii className="pointer-events-none absolute -right-2 top-1 hidden h-16 w-28 text-white/15 lg:block" />
        <div className="container-site relative flex items-center gap-3 py-2 sm:gap-6">
          {/* Logo em "aba" branca, como no layout original */}
          <Link
            href="/"
            aria-label="Página inicial"
            className="relative -my-2 -ml-4 flex shrink-0 items-center rounded-br-[48px] bg-white px-4 py-2 shadow-md sm:-ml-6 sm:rounded-br-[64px] sm:px-6"
          >
            <Logo path={settings.logo_path} priority className="h-12 w-auto sm:h-[68px]" />
          </Link>

          <form action="/produtos" className="hidden flex-1 md:block" role="search">
            <label className="relative block">
              <span className="sr-only">{t["header.search_placeholder"]}</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-700" />
              <input
                name="q"
                type="search"
                placeholder={t["header.search_placeholder"]}
                className="w-full rounded-full border-0 bg-white py-2.5 pl-12 pr-4 text-sm text-ink shadow-inner placeholder:text-blue-900/70 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </label>
          </form>

          <div className="ml-auto">
            <UserMenu loggedIn={!!user} name={name} loginLabel={t["header.login"]} accountLabel={t["header.my_account"]} />
          </div>
        </div>
      </div>

      <NavBar items={items} searchPlaceholder={t["header.search_placeholder"]} />
    </header>
  );
}

function Torii({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 70" fill="currentColor" className={className} aria-hidden="true">
      <path d="M4 8c20 6 92 6 112 0l-2 9H6L4 8zM14 22h92v6H14zM24 17h8v53h-8zM88 17h8v53h-8zM56 22h8v6h-8z" />
    </svg>
  );
}
