import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { isoToLocal, requireAdmin } from "@/lib/admin";
import { getResource } from "@/lib/admin-resources";
import { PageTitle } from "@/components/admin/ui";
import { ResourceForm, type FormValues, type RelationOptions } from "@/components/admin/resource-form";

/** Monta a tela de cadastro/edição de qualquer recurso. */
export async function ResourceFormPage({ resourceKey, id }: { resourceKey: string; id: string | null }) {
  const resource = getResource(resourceKey);
  if (!resource) notFound();
  const { supabase } = await requireAdmin();

  let row: Record<string, unknown> | null = null;
  if (id) {
    if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
    const { data } = await supabase.from(resource.table).select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    row = data as Record<string, unknown>;
  }

  // Opções das listas de seleção (categoria, produto, tema...)
  const relations: RelationOptions = {};
  for (const f of resource.fields.filter((x) => x.type === "relation" && x.relation)) {
    const r = f.relation!;
    const { data } = await supabase.from(r.table).select(`id, ${r.labelColumn}`).order(r.orderBy ?? r.labelColumn).limit(1000);
    relations[f.name] = ((data as unknown as Record<string, string>[]) ?? []).map((d) => ({ value: d.id, label: d[r.labelColumn] }));
  }

  // Valores iniciais
  const values: FormValues = {};
  for (const f of resource.fields) {
    let v: unknown;
    if (f.name.includes(".")) {
      const [p, c] = f.name.split(".");
      v = (row?.[p] as Record<string, unknown> | undefined)?.[c];
    } else if (f.virtual && row) {
      if (f.name === "offer_enabled") v = row.is_offer;
      if (f.name === "offer_price") v = row.promo_price;
    } else v = row?.[f.name];

    if (v === undefined || v === null) v = row ? (f.type === "boolean" ? false : "") : f.default ?? (f.type === "boolean" ? false : "");
    if (f.type === "datetime") v = isoToLocal(v as string);
    if (f.type === "money" && v !== "") v = Number(v).toFixed(2).replace(".", ",");
    if (f.type === "keyvalue")
      v = Object.entries((v as Record<string, string>) || {})
        .map(([k, x]) => `${k} = ${x}`)
        .join("\n");
    values[f.name] = v as string | number | boolean;
  }

  return (
    <>
      <Link href={`/admin/${resource.key}`} className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-red-600">
        <ChevronLeft className="h-4 w-4" /> Voltar para {resource.title}
      </Link>
      <PageTitle title={id ? `Editar ${resource.singular}` : `Novo ${resource.singular}`} description={resource.description} />
      <ResourceForm resourceKey={resource.key} id={id} fields={resource.fields} values={values} relations={relations} />
    </>
  );
}
