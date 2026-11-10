"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, User, UserPlus } from "lucide-react";

export function UserMenu({
  loggedIn,
  name,
  loginLabel,
  accountLabel
}: {
  loggedIn: boolean;
  name?: string;
  loginLabel: string;
  accountLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-md px-2 py-2 text-white hover:bg-white/10"
      >
        <User className="h-7 w-7" strokeWidth={1.6} aria-hidden="true" />
        <span className="text-[15px] font-semibold">{loggedIn ? name || accountLabel : loginLabel}</span>
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl bg-white py-1 text-ink shadow-xl ring-1 ring-black/5">
          {loggedIn ? (
            <>
              <Link role="menuitem" href="/minha-conta" className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50">
                <User className="h-4 w-4" /> {accountLabel}
              </Link>
              <form action="/auth/sair" method="post">
                <button role="menuitem" className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-brand hover:bg-slate-50">
                  <LogOut className="h-4 w-4" /> Sair
                </button>
              </form>
            </>
          ) : (
            <>
              <Link role="menuitem" href="/entrar" className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50">
                <User className="h-4 w-4" /> {loginLabel}
              </Link>
              <Link role="menuitem" href="/cadastro" className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50">
                <UserPlus className="h-4 w-4" /> Criar conta
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
