"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { Icon } from "@/components/icon";

export type SectorCard = { id: string; name: string; description: string | null; icon: string | null; image: string | null; href: string };

export function SectorGrid({ sectors, placeholder, button }: { sectors: SectorCard[]; placeholder: string; button: string }) {
  const [q, setQ] = useState("");
  const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const list = useMemo(() => sectors.filter((s) => norm(`${s.name} ${s.description ?? ""}`).includes(norm(q))), [q, sectors]);

  return (
    <>
      <label className="relative mb-4 block w-full sm:absolute sm:right-5 sm:top-5 sm:mb-0 sm:w-64">
        <span className="sr-only">{placeholder}</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-700" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </label>
      {list.length === 0 ? (
        <p className="py-8 text-center text-slate-500">Nenhum setor encontrado.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((s) => (
            <li key={s.id} className="flex flex-col overflow-hidden rounded-lg bg-white shadow-card ring-1 ring-slate-100">
              <div className="relative aspect-[2.2/1] w-full bg-slate-100">
                {s.image && <Image src={s.image} alt={s.name} fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover" />}
              </div>
              <div className="flex flex-1 flex-col p-3">
                <h3 className="flex items-center gap-2 font-display text-xl font-extrabold">
                  <Icon name={s.icon} className="h-6 w-6 text-brand" /> {s.name}
                </h3>
                {s.description && <p className="mt-1 flex-1 text-sm leading-snug text-slate-600">{s.description}</p>}
                <Link href={s.href} className="btn-brand mt-3 w-full py-1.5 text-sm">
                  {button} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
