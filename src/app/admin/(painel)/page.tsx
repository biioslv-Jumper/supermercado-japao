import Link from "next/link";
import { BadgePercent, CheckCircle2, Image as ImageIcon, Package, Palette, Sparkles, Star } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { formatDateTime } from "@/lib/format";
import { PageTitle, Panel, StatCard } from "@/components/admin/ui";

export default async function DashboardPage() {
  const { supabase } = await requireAdmin();
  const nowIso = new Date().toISOString();
  const count = async (table: string, filter?: (q: any) => any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q: any = supabase.from(table).select("id", { count: "exact", head: true });
    if (filter) q = filter(q);
    const { count: c } = await q;
    return c ?? 0;
  };

  const [products, activeProducts, offerProducts, highlights, news, banners, themeRes, logs] = await Promise.all([
    count("products"),
    count("products", (q) => q.eq("is_active", true)),
    count("products", (q) => q.eq("is_offer", true).eq("is_active", true)),
    count("highlights", (q) => q.eq("is_active", true).or(`ends_at.is.null,ends_at.gt.${nowIso}`)),
    count("news", (q) => q.eq("is_active", true)),
    count("banners", (q) => q.eq("is_active", true)),
    supabase.rpc("current_theme"),
    supabase.from("audit_logs").select("id, summary, user_label, created_at").order("created_at", { ascending: false }).limit(10)
  ]);
  const theme = (themeRes.data as { name: string }[] | null)?.[0];

  return (
    <>
      <PageTitle title="Dashboard" description="Resumo do site do Supermercado Japão." />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Produtos cadastrados" value={products} href="/admin/produtos" Icon={Package} tone="slate" />
        <StatCard label="Produtos ativos" value={activeProducts} href="/admin/produtos?flag=ativos" Icon={CheckCircle2} tone="green" />
        <StatCard label="Produtos em oferta" value={offerProducts} href="/admin/ofertas" Icon={BadgePercent} tone="red" />
        <StatCard label="Destaques ativos" value={highlights} href="/admin/destaques" Icon={Star} tone="amber" />
        <StatCard label="Novidades ativas" value={news} href="/admin/novidades" Icon={Sparkles} tone="violet" />
        <StatCard label="Banners ativos" value={banners} href="/admin/banners" Icon={ImageIcon} tone="blue" />
        <StatCard label="Tema atual" value={theme?.name ?? "Padrão"} href="/admin/temas" Icon={Palette} tone="red" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Panel>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-extrabold">Últimas alterações</h2>
            <Link href="/admin/historico" className="text-sm font-semibold text-red-600 hover:underline">
              Ver histórico completo
            </Link>
          </div>
          {(logs.data ?? []).length === 0 ? (
            <p className="text-sm text-slate-500">Nenhuma alteração registrada ainda.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {(logs.data ?? []).map((l) => (
                <li key={l.id} className="flex flex-wrap items-baseline justify-between gap-2 py-2 text-sm">
                  <span className="font-semibold text-slate-800">{l.summary}</span>
                  <span className="text-xs text-slate-500">
                    {l.user_label} · {formatDateTime(l.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel>
          <h2 className="mb-3 text-lg font-extrabold">Atalhos</h2>
          <div className="grid gap-2">
            <Link href="/admin/produtos/novo" className="btn-outline justify-start">+ Novo produto</Link>
            <Link href="/admin/ofertas/novo" className="btn-outline justify-start">+ Nova oferta</Link>
            <Link href="/admin/banners/novo" className="btn-outline justify-start">+ Novo banner</Link>
            <Link href="/admin/conteudo" className="btn-outline justify-start">Editar textos do site</Link>
            <Link href="/admin/configuracoes" className="btn-outline justify-start">Telefone, endereço e redes sociais</Link>
          </div>
        </Panel>
      </div>
    </>
  );
}
