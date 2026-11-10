"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const OPTIONS = [
  { value: "", label: "Mais recentes" },
  { value: "menor-preco", label: "Menor preço" },
  { value: "maior-preco", label: "Maior preço" },
  { value: "maior-desconto", label: "Maior desconto" },
  { value: "nome", label: "Nome (A–Z)" }
];

export function SortSelect({ label, value }: { label: string; value: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  return (
    <label className="flex items-center gap-2 text-sm font-semibold">
      {label}
      <select
        value={value}
        onChange={(e) => {
          const sp = new URLSearchParams(params.toString());
          if (e.target.value) sp.set("ordem", e.target.value);
          else sp.delete("ordem");
          sp.delete("pagina");
          router.push(sp.toString() ? `${pathname}?${sp}` : pathname);
        }}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-normal shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
