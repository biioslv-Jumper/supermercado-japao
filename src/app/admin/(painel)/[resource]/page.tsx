import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageOff, Plus, Search } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { BANNER_PLACEMENTS, getResource, type Column } from "@/lib/admin-resources";
import { formatDateTime, mediaUrl, money } from "@/lib/format";
import { PageTitle, Panel, SuccessBanner } from "@/components/admin/ui";
import { RowActions } from "@/components/admin/row-actions";

type Params = Promise<{ resource: string }>;
type SP = Promise<Record<string, string | undefined>>;
type Row = Record<string, unknown> & { id: string };

export default async function ResourceListPage({ params, searchParams }: { params: Params; searchParams: SP }) {
  const { resource: key } = await params;
  const sp = await searchParams;
  const resource = getResource(key);
  if (!resource) notFound();
  const { supabase } = await requireAdmin();

  const q = (sp.q ?? "").trim().slice(0, 80);
  let query = supabase.from(resource.table).select(resource.select);
  for (const o of resource.orderBy) query = query.order(o.column, { ascending: o.ascending });
  if (q && resource.searchColumn !== "id") query = query.ilike(resource.searchColumn, `%${q.replace(/[%_,()]/g, " ")}%`);
  if (resource.key === "banners" && sp.placement) query = query.eq("placement", sp.placement);
  if (resource.key === "produtos") {
    if (sp.flag === "ativos") query = query.eq("is_active", true);
    if (sp.flag === "inativos") query = query.eq("is_active", false);
    if (sp.flag === "oferta") query = query.eq("is_offer", true);
    if (sp.flag === "novidade") query = query.eq("is_new", true);
  }
  const { data, error } = await query.limit(500);
  const rows = (data as unknown as Row[]) ?? [];
  const now = new Date().toISOString();

  return (
    <>
      <PageTitle
        title={resource.title}
        description={resource.description}
        actions={
          <Link href={`/admin/${resource.key}/novo`} className="btn bg-red-600 text-white hover:bg-red-700">
            <Plus className="h-4 w-4" aria-hidden="true" /> Novo {resource.singular}
          </Link>
        }
      />
      <SuccessBanner msg={sp.msg} />

      <Panel className="p-0 sm:p-0">
        <form className="flex flex-wrap items-end gap-3 border-b border-slate-100 p-4" role="search">
          {resource.searchColumn !== "id" && (
            <label className="relative min-w-[220px] flex-1">
              <span className="sr-only">Buscar</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input name="q" defaultValue={q} placeholder={`Buscar ${resource.singular}...`} className="input pl-9" />
            </label>
          )}
          {resource.filters?.map((f) => (
            <label key={f.name} className="text-sm">
              <span className="label">{f.label}</span>
              <select name={f.name} defaultValue={sp[f.name] ?? ""} className="input">
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <button className="btn-outline">Filtrar</button>
          {(q || resource.filters?.some((f) => sp[f.name])) && (
            <Link href={`/admin/${resource.key}`} className="text-sm font-semibold text-red-600 hover:underline">
              Limpar
            </Link>
          )}
        </form>

        {error ? (
          <p className="p-6 text-red-600">Não foi possível carregar os dados.</p>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            <p>{q ? "Nada encontrado para esta busca." : `Nenhum ${resource.singular} cadastrado ainda.`}</p>
            <Link href={`/admin/${resource.key}/novo`} className="btn mt-3 bg-red-600 text-white hover:bg-red-700">
              <Plus className="h-4 w-4" /> Cadastrar {resource.singular}
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  {resource.columns.map((c, i) => (
                    <th key={i} className="px-4 py-2.5 font-bold">{c.label}</th>
                  ))}
                  {resource.hasActive && <th className="px-4 py-2.5 font-bold">Status</th>}
                  <th className="px-4 py-2.5 text-right font-bold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row) => {
                  const label = String(row.name ?? row.title ?? (row.products as Row | null)?.name ?? (row.themes as Row | null)?.name ?? resource.singular);
                  const expired = typeof row.ends_at === "string" && row.ends_at < now;
                  const scheduled = typeof row.starts_at === "string" && row.starts_at > now;
                  return (
                    <tr key={row.id} className="hover:bg-slate-50/60">
                      {resource.columns.map((c, i) => (
                        <td key={i} className="px-4 py-2.5 align-middle">
                          <Cell column={c} row={row} />
                        </td>
                      ))}
                      {resource.hasActive && (
                        <td className="px-4 py-2.5">
                          {row.is_default ? (
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">Padrão</span>
                          ) : !row.is_active ? (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">Inativo</span>
                          ) : expired ? (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">Encerrado</span>
                          ) : scheduled ? (
                            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-bold text-violet-700">Agendado</span>
                          ) : (
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">No ar</span>
                          )}
                        </td>
                      )}
                      <td className="px-2 py-2.5">
                        <RowActions
                          resourceKey={resource.key}
                          id={row.id}
                          label={label}
                          isActive={!!row.is_active}
                          hasActive={resource.hasActive}
                          sortable={resource.sortable}
                          isDefaultTheme={!!row.is_default}
                          canSetDefault={resource.table === "themes"}
                          previewSlug={resource.table === "themes" ? String(row.slug) : undefined}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
      <p className="mt-3 text-xs text-slate-500">{rows.length} registro(s).</p>
    </>
  );
}

function Cell({ column, row }: { column: Column; row: Row }) {
  const raw = row[column.name];
  const rel = raw && typeof raw === "object" ? (raw as Row) : null;
  switch (column.type) {
    case "image": {
      const path = (column.relationKey ? rel?.[column.relationKey] : raw) as string | null;
      const src = mediaUrl(path);
      return src ? (
        <Image src={src} alt="" width={48} height={48} className="h-12 w-12 rounded-md bg-white object-contain ring-1 ring-slate-200" />
      ) : (
        <span className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-slate-300">
          <ImageOff className="h-5 w-5" />
        </span>
      );
    }
    case "money":
      return <span className="font-semibold">{raw === null || raw === undefined ? "—" : money(raw as number)}</span>;
    case "boolean":
      return raw ? <span className="font-bold text-green-600">Sim</span> : <span className="text-slate-400">Não</span>;
    case "relation":
      return <span>{(rel?.[column.relationKey ?? "name"] as string) ?? "—"}</span>;
    case "datetime":
      return <span className="whitespace-nowrap text-slate-600">{raw ? formatDateTime(raw as string) : "—"}</span>;
    case "badge": {
      const b: string[] = [];
      if (row.is_offer) b.push("Oferta");
      if (row.is_new) b.push("Novidade");
      if (row.is_featured) b.push("Destaque");
      return (
        <div className="flex flex-wrap gap-1">
          {b.length ? b.map((x) => <span key={x} className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-bold text-amber-800">{x}</span>) : <span className="text-slate-400">—</span>}
        </div>
      );
    }
    default: {
      if (column.name === "placement") return <span>{BANNER_PLACEMENTS.find((p) => p.value === raw)?.label ?? String(raw)}</span>;
      return <span className={column.name === "name" || column.name === "title" ? "font-semibold text-slate-900" : ""}>{(raw as string) || "—"}</span>;
    }
  }
}
