import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { formatDateTime } from "@/lib/format";
import { PageTitle, Panel } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Histórico de alterações" };

const ENTITIES = [
  { value: "", label: "Tudo" },
  { value: "products", label: "Produtos" },
  { value: "categories", label: "Categorias" },
  { value: "offers", label: "Ofertas" },
  { value: "highlights", label: "Destaques" },
  { value: "news", label: "Novidades" },
  { value: "banners", label: "Banners" },
  { value: "services", label: "Serviços" },
  { value: "cafe_items", label: "Cafeteria" },
  { value: "site_content", label: "Textos" },
  { value: "site_settings", label: "Configurações" },
  { value: "themes", label: "Temas" },
  { value: "theme_schedules", label: "Agendamentos" },
  { value: "admins", label: "Acesso admin" }
];
const PER_PAGE = 50;

type Change = Record<string, { de: unknown; para: unknown }>;

export default async function HistoryPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const { supabase } = await requireAdmin();
  const page = Math.max(1, Number(sp.pagina) || 1);
  const entity = ENTITIES.some((e) => e.value === sp.tipo) ? sp.tipo : "";

  let query = supabase
    .from("audit_logs")
    .select("id, user_label, action, entity, entity_label, summary, changes, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PER_PAGE, page * PER_PAGE - 1);
  if (entity) query = query.eq("entity", entity);
  const { data, count } = await query;
  const pages = Math.max(1, Math.ceil((count ?? 0) / PER_PAGE));
  const link = (p: number) => `/admin/historico?${new URLSearchParams({ ...(entity ? { tipo: entity } : {}), pagina: String(p) })}`;

  return (
    <>
      <PageTitle title="Histórico de alterações" description="Tudo o que foi criado, alterado, excluído, ativado ou publicado no painel — com usuário, data e horário." />
      <form className="mb-4 flex gap-2">
        <select name="tipo" defaultValue={entity} className="input max-w-xs">
          {ENTITIES.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
        <button className="btn-outline">Filtrar</button>
      </form>
      <Panel className="p-0 sm:p-0">
        {(data ?? []).length === 0 ? (
          <p className="p-8 text-center text-slate-500">Nenhuma alteração registrada.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {(data ?? []).map((l) => {
              const changes = (l.changes as Change | null) ?? null;
              const keys = changes ? Object.keys(changes) : [];
              return (
                <li key={l.id} className="px-5 py-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold text-slate-900">{l.summary}</p>
                    <p className="text-xs text-slate-500">
                      <strong>{l.user_label}</strong> · {formatDateTime(l.created_at)}
                    </p>
                  </div>
                  {keys.length > 0 && (
                    <details className="mt-1 text-xs text-slate-600">
                      <summary className="cursor-pointer text-slate-500">Ver o que mudou ({keys.length})</summary>
                      <ul className="mt-1 space-y-0.5">
                        {keys.slice(0, 20).map((k) => (
                          <li key={k}>
                            <span className="font-mono">{k}</span>: <span className="text-red-600 line-through">{short(changes![k].de)}</span> →{" "}
                            <span className="text-green-700">{short(changes![k].para)}</span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
      {pages > 1 && (
        <nav className="mt-4 flex items-center justify-center gap-3 text-sm" aria-label="Paginação">
          {page > 1 && <Link href={link(page - 1)} className="btn-outline py-1">Anterior</Link>}
          <span>
            Página {page} de {pages}
          </span>
          {page < pages && <Link href={link(page + 1)} className="btn-outline py-1">Próxima</Link>}
        </nav>
      )}
    </>
  );
}

function short(v: unknown) {
  if (v === null || v === undefined || v === "") return "(vazio)";
  const s = typeof v === "string" ? v : JSON.stringify(v);
  return s.length > 80 ? `${s.slice(0, 80)}…` : s;
}
