"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CreditCard, Home, LayoutGrid, Menu, Phone, Search, Settings, Smartphone, Tag, X } from "lucide-react";

export type NavItem = { href: string; label: string; icon: string };

const ICONS = { home: Home, tag: Tag, grid: LayoutGrid, settings: Settings, card: CreditCard, phone: Phone, smartphone: Smartphone };

export function NavBar({ items, searchPlaceholder }: { items: NavItem[]; searchPlaceholder: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href) || (href === "/setores" && pathname.startsWith("/cafeteria"));

  return (
    <nav className="bg-brand-dark text-white shadow" aria-label="Menu principal">
      <div className="container-site">
        {/* Desktop */}
        <ul className="hidden items-stretch justify-between lg:flex">
          {items.map((item) => {
            const Ico = ICONS[item.icon as keyof typeof ICONS] ?? Home;
            const active = isActive(item.href);
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`my-1 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-[15px] font-semibold transition ${
                    active ? "bg-accent text-accent-ink shadow" : "hover:bg-white/10"
                  }`}
                >
                  <Ico className="h-5 w-5" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile */}
        <div className="flex items-center gap-2 py-2 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="rounded-md p-2 hover:bg-white/10"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Abrir menu</span>
          </button>
          <form action="/produtos" className="flex-1" role="search">
            <label className="relative block">
              <span className="sr-only">{searchPlaceholder}</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-700" />
              <input
                name="q"
                type="search"
                placeholder={searchPlaceholder}
                className="w-full rounded-full bg-white py-2 pl-9 pr-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </label>
          </form>
        </div>
        {open && (
          <ul id="menu-mobile" className="grid gap-1 pb-3 lg:hidden">
            {items.map((item) => {
              const Ico = ICONS[item.icon as keyof typeof ICONS] ?? Home;
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-md px-3 py-2.5 font-semibold ${
                      active ? "bg-accent text-accent-ink" : "hover:bg-white/10"
                    }`}
                  >
                    <Ico className="h-5 w-5" aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </nav>
  );
}
