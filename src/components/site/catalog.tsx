import Link from "next/link";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { Icon } from "@/components/icon";
import { EmptyState } from "./ui";
import { SortSelect } from "./sort-select";
import type { Category } from "@/lib/types";

export const PAGE_SIZE = 24;

/** Estrutura das páginas Ofertas/Produtos: categorias à esquerda e grade à direita. */
export function CatalogLayout({
  basePath,
  categories,
  current,
  title,
  subtitle,
  t,
  sort,
  q,
  page,
  total,
  children
}: {
  basePath: string;
  categories: Category[];
  current?: string;
  title: string;
  subtitle: string;
  t: Record<string, string>;
  sort?: string;
  q?: string;
  page: number;
  total: number;
  children: React.ReactNode;
}) {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const href = (params: Record<string, string | number | undefined>) => {
    const sp = new URLSearchParams();
    const merged = { categoria: current, ordem: sort, q, ...params };
    for (const [k, v] of Object.entries(merged)) if (v !== undefined && v !== "" && !(k === "pagina" && String(v) === "1")) sp.set(k, String(v));
    const s = sp.toString();
    return s ? `${basePath}?${s}` : basePath;
  };
  const productCategories = categories.filter((c) => !c.link_url);

  return (
    <div className="container-site mt-6 grid gap-6 lg:grid-cols-[230px_1fr]">
      <aside aria-label={t["offers.categories_title"]}>
        <div className="card p-3 lg:sticky lg:top-4">
          <h2 className="mb-2 flex items-center gap-2 px-2 font-display text-xl font-extrabold text-brand">
            <LayoutGrid className="h-6 w-6" aria-hidden="true" /> {t["offers.categories_title"]}
          </h2>
          <ul className="flex gap-1 overflow-x-auto pb-1 lg:block lg:space-y-0.5 lg:overflow-visible">
            <li className="shrink-0">
              <Link
                href={href({ categoria: undefined, pagina: undefined })}
                className={`flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-[15px] ${
                  !current ? "bg-accent/40 font-bold" : "hover:bg-slate-50"
                }`}
              >
                <LayoutGrid className="h-5 w-5 text-brand" aria-hidden="true" /> {t["offers.all_products"]}
              </Link>
            </li>
            {productCategories.map((c) => (
              <li key={c.id} className="shrink-0">
                <Link
                  href={href({ categoria: c.slug, pagina: undefined })}
                  aria-current={current === c.slug ? "page" : undefined}
                  className={`flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-[15px] text-slate-700 ${
                    current === c.slug ? "bg-accent/40 font-bold text-ink" : "hover:bg-slate-50"
                  }`}
                >
                  <Icon name={c.icon} className="h-5 w-5 text-slate-600" /> {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <section aria-labelledby="lista-titulo">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 id="lista-titulo" className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">{title}</h1>
            <p className="text-blue-900/70">{q ? `Resultados para "${q}"` : subtitle}</p>
          </div>
          <SortSelect label={t["offers.sort_label"]} value={sort ?? ""} />
        </div>
        {total === 0 ? <EmptyState>{t["offers.empty"]}</EmptyState> : children}

        {pages > 1 && (
          <nav className="mt-6 flex items-center justify-center gap-1" aria-label="Paginação">
            <PageLink href={href({ pagina: page - 1 })} disabled={page <= 1} label="Página anterior">
              <ChevronLeft className="h-4 w-4" />
            </PageLink>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={href({ pagina: p })}
                aria-current={p === page ? "page" : undefined}
                className={`flex h-8 min-w-8 items-center justify-center rounded px-2 text-sm font-bold ${
                  p === page ? "bg-brand text-white" : "bg-white text-ink ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {p}
              </Link>
            ))}
            <PageLink href={href({ pagina: page + 1 })} disabled={page >= pages} label="Próxima página">
              <ChevronRight className="h-4 w-4" />
            </PageLink>
          </nav>
        )}
        {t["offers.price_note"] && <p className="mt-6 text-center text-xs text-slate-500">{t["offers.price_note"]}</p>}
      </section>
    </div>
  );
}

function PageLink({ href, disabled, label, children }: { href: string; disabled: boolean; label: string; children: React.ReactNode }) {
  if (disabled)
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded bg-white text-slate-300 ring-1 ring-slate-200" aria-hidden="true">
        {children}
      </span>
    );
  return (
    <Link href={href} aria-label={label} className="flex h-8 w-8 items-center justify-center rounded bg-white ring-1 ring-slate-200 hover:bg-slate-50">
      {children}
    </Link>
  );
}

export function parsePage(v: string | string[] | undefined) {
  const n = Number(Array.isArray(v) ? v[0] : v);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

export function str(v: string | string[] | undefined) {
  return (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
}
