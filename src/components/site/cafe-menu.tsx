"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Images, LayoutGrid, X } from "lucide-react";
import { Icon } from "@/components/icon";

export type CafeMenuItem = {
  id: string;
  categoryId: string | null;
  name: string;
  description: string | null;
  price: string;
  image: string | null;
  imagesUrl: string | null;
};

export function CafeMenu({
  categories,
  items,
  allLabel,
  title,
  button,
  empty
}: {
  categories: { id: string; name: string; icon: string | null }[];
  items: CafeMenuItem[];
  allLabel: string;
  title: string;
  button: string;
  empty: string;
}) {
  const [active, setActive] = useState<string>("all");
  const [zoom, setZoom] = useState<CafeMenuItem | null>(null);
  const list = active === "all" ? items : items.filter((i) => i.categoryId === active);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoom(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [zoom]);

  const tab = (id: string, label: string, icon: React.ReactNode) => (
    <button
      key={id}
      type="button"
      onClick={() => setActive(id)}
      aria-pressed={active === id}
      className={`flex shrink-0 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 font-display text-lg font-bold shadow-sm transition ${
        active === id ? "border-cafe-700 bg-cafe-700 text-white" : "border-cafe-200 bg-cafe-50 text-cafe-800 hover:bg-cafe-100"
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <>
      <div className="flex gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-7 lg:overflow-visible">
        {tab("all", allLabel, <LayoutGrid className="h-6 w-6" aria-hidden="true" />)}
        {categories.map((c) => tab(c.id, c.name, <Icon name={c.icon} className="h-6 w-6" />))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <CoffeeBeans />
        <h2 className="font-display text-3xl font-extrabold text-cafe-800 sm:text-4xl">{title}</h2>
        <svg viewBox="0 0 300 20" className="hidden h-5 flex-1 text-cafe-600 sm:block" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 12 H255" stroke="currentColor" strokeWidth="1.5" />
          <path d="M260 12c8-10 18-10 20 0s12 8 18-2M262 14c4 5 10 5 12 0" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      {list.length === 0 ? (
        <p className="py-10 text-center text-cafe-800/70">{empty}</p>
      ) : (
        <ul className="mt-4 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {list.map((item) => (
            <li key={item.id} className="flex flex-col rounded-2xl bg-cafe-50 p-2.5 shadow-[0_2px_10px_rgba(74,32,16,0.12)]">
              <div className="relative aspect-[1.8/1] w-full overflow-hidden rounded-xl bg-cafe-100">
                {item.image && <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-cover" />}
              </div>
              <div className="flex flex-1 flex-col px-1 pt-2">
                <h3 className="font-display text-xl font-extrabold leading-tight text-cafe-800">{item.name}</h3>
                {item.description && <p className="text-sm leading-snug text-cafe-800/80">{item.description}</p>}
                {item.price && <p className="mt-auto pt-1 font-display text-2xl font-extrabold text-cafe-800">{item.price}</p>}
                {item.imagesUrl ? (
                  <a
                    href={item.imagesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center justify-center gap-2 rounded-full bg-[#A3141C] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#82101A]"
                  >
                    <Images className="h-4 w-4" aria-hidden="true" /> {button}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => setZoom(item)}
                    disabled={!item.image}
                    className="mt-2 flex items-center justify-center gap-2 rounded-full bg-[#A3141C] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#82101A] disabled:opacity-50"
                  >
                    <Images className="h-4 w-4" aria-hidden="true" /> {button}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {zoom?.image && (
        <div role="dialog" aria-modal="true" aria-label={zoom.name} className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" onClick={() => setZoom(null)}>
          <div className="relative w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setZoom(null)} className="absolute -top-10 right-0 text-white" aria-label="Fechar">
              <X className="h-8 w-8" />
            </button>
            <div className="relative aspect-[1.8/1] w-full overflow-hidden rounded-xl bg-black">
              <Image src={zoom.image} alt={zoom.name} fill sizes="90vw" className="object-contain" />
            </div>
            <p className="mt-2 text-center font-display text-xl font-bold text-white">{zoom.name}</p>
          </div>
        </div>
      )}
    </>
  );
}

function CoffeeBeans() {
  return (
    <svg viewBox="0 0 48 32" className="h-8 w-12 text-cafe-700" fill="currentColor" aria-hidden="true">
      <ellipse cx="14" cy="18" rx="10" ry="13" transform="rotate(-30 14 18)" />
      <ellipse cx="34" cy="14" rx="9" ry="12" transform="rotate(25 34 14)" />
      <path d="M8 26c6-4 8-12 12-17" stroke="#FBF4EA" strokeWidth="2" fill="none" />
      <path d="M30 24c3-5 4-11 9-16" stroke="#FBF4EA" strokeWidth="2" fill="none" />
    </svg>
  );
}
