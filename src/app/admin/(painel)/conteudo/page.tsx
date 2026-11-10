import type { Metadata } from "next";
import { Eye, Send, Save, Undo2 } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { PageTitle, SuccessBanner } from "@/components/admin/ui";
import { SubmitButton } from "@/components/forms";
import { discardDrafts, publishDrafts, saveContent } from "./actions";

export const metadata: Metadata = { title: "Conteúdo do site" };

type Row = { key: string; value: string; group_name: string; label: string; multiline: boolean; sort_order: number };

export default async function ContentPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const { supabase } = await requireAdmin();
  const [{ data }, { data: draftRows }] = await Promise.all([
    supabase.from("site_content").select("key, value, group_name, label, multiline, sort_order").order("sort_order"),
    supabase.from("site_content_drafts").select("key, value")
  ]);
  const rows = (data as Row[]) ?? [];
  const drafts = new Map((draftRows ?? []).map((d) => [d.key as string, d.value as string]));
  const groups = rows.reduce<Record<string, Row[]>>((acc, r) => ((acc[r.group_name] ??= []).push(r), acc), {});
  const q = (sp.q ?? "").toLowerCase();

  return (
    <>
      <PageTitle
        title="Conteúdo do site"
        description="Todos os textos que aparecem para o cliente. Altere, salve como rascunho, visualize e depois publique — ou publique direto."
      />
      <SuccessBanner msg={sp.msg} />

      {drafts.size > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl bg-amber-50 p-4 ring-1 ring-amber-200">
          <p className="flex-1 text-sm font-semibold text-amber-900">
            Existem {drafts.size} texto(s) em rascunho, ainda não publicados.
          </p>
          <a href="/admin/preview/conteudo" target="_blank" className="btn-outline py-1.5">
            <Eye className="h-4 w-4" /> Visualizar no site
          </a>
          <form action={publishDrafts}>
            <SubmitButton className="btn bg-green-600 py-1.5 text-white hover:bg-green-700" pendingText="Publicando...">
              <Send className="h-4 w-4" /> Publicar rascunhos
            </SubmitButton>
          </form>
          <form action={discardDrafts}>
            <SubmitButton className="btn py-1.5 text-red-600 hover:bg-red-50" pendingText="Descartando...">
              <Undo2 className="h-4 w-4" /> Descartar
            </SubmitButton>
          </form>
        </div>
      )}

      <form className="mb-4" role="search">
        <input name="q" defaultValue={sp.q} placeholder="Buscar texto (ex.: rodapé, ofertas, WhatsApp)..." className="input max-w-md" />
      </form>

      <form action={saveContent} className="space-y-3">
        {Object.entries(groups).map(([group, items]) => {
          const visible = items.filter((r) => !q || `${r.label} ${r.value} ${group}`.toLowerCase().includes(q));
          if (!visible.length) return null;
          const hasDraft = items.some((i) => drafts.has(i.key));
          return (
            <details key={group} open={!!q || hasDraft} className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
              <summary className="flex cursor-pointer items-center gap-2 px-5 py-3 text-lg font-extrabold">
                {group}
                <span className="text-xs font-semibold text-slate-400">({items.length})</span>
                {hasDraft && <span className="rounded-full bg-amber-100 px-2 text-xs font-bold text-amber-800">rascunho</span>}
              </summary>
              <div className="grid gap-4 border-t border-slate-100 p-5 md:grid-cols-2">
                {items.map((r) => {
                  const hidden = !visible.includes(r);
                  const val = drafts.get(r.key) ?? r.value;
                  return (
                    <div key={r.key} className={`${r.multiline ? "md:col-span-2" : ""} ${hidden ? "hidden" : ""}`}>
                      <label htmlFor={r.key} className="label flex items-center gap-2">
                        {r.label}
                        {drafts.has(r.key) && <span className="rounded bg-amber-100 px-1.5 text-[10px] font-bold uppercase text-amber-800">rascunho</span>}
                      </label>
                      {r.multiline ? (
                        <textarea id={r.key} name={`c:${r.key}`} defaultValue={val} rows={3} className="input" />
                      ) : (
                        <input id={r.key} name={`c:${r.key}`} defaultValue={val} className="input" />
                      )}
                      <p className="mt-0.5 font-mono text-[10px] text-slate-400">{r.key}</p>
                    </div>
                  );
                })}
              </div>
            </details>
          );
        })}

        <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
          <button name="intent" value="draft" className="btn-outline">
            <Save className="h-4 w-4" /> Salvar rascunho
          </button>
          <button name="intent" value="publish" className="btn bg-red-600 text-white hover:bg-red-700">
            <Send className="h-4 w-4" /> Salvar e publicar
          </button>
          <p className="self-center text-xs text-slate-500">Dica: salve como rascunho e use &quot;Visualizar no site&quot; para conferir antes de publicar.</p>
        </div>
      </form>
    </>
  );
}
