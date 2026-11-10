import type { Metadata } from "next";
import { Suspense } from "react";
import { getSite } from "@/lib/site";
import { getCategories, getProducts } from "@/lib/queries";
import { ProductCard } from "@/components/site/ui";
import { CatalogLayout, PAGE_SIZE, parsePage, str } from "@/components/site/catalog";

export const metadata: Metadata = { title: "Produtos" };

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function ProductsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const categoria = str(sp.categoria);
  const ordem = str(sp.ordem);
  const q = str(sp.q)?.slice(0, 80);
  const page = parsePage(sp.pagina);
  const { content: t } = await getSite();
  const [categories, products] = await Promise.all([getCategories(), getProducts({ categorySlug: categoria, q, sort: ordem })]);
  const current = categories.find((c) => c.slug === categoria);
  const pageItems = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Suspense>
      <CatalogLayout
        basePath="/produtos"
        categories={categories}
        current={categoria}
        title={current?.name ?? t["products.list_title"]}
        subtitle={current?.description ?? t["products.list_subtitle"]}
        t={t}
        sort={ordem}
        q={q}
        page={page}
        total={products.length}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {pageItems.map((p) => (
            <ProductCard key={p.id} product={p} badge={p.is_offer ? t["offers.badge_default"] : p.is_new ? "Novidade" : null} />
          ))}
        </div>
      </CatalogLayout>
    </Suspense>
  );
}
