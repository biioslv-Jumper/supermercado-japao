import type { Metadata } from "next";
import { Suspense } from "react";
import { BadgePercent } from "lucide-react";
import { getSite } from "@/lib/site";
import { getBanners, getCategories, getOffers } from "@/lib/queries";
import { PageHero, ProductCard } from "@/components/site/ui";
import { CatalogLayout, PAGE_SIZE, parsePage, str } from "@/components/site/catalog";

export const metadata: Metadata = { title: "Ofertas" };

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function OffersPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const categoria = str(sp.categoria);
  const ordem = str(sp.ordem);
  const page = parsePage(sp.pagina);
  const { content: t, theme } = await getSite();
  const [banners, categories, offers] = await Promise.all([
    getBanners("offers_header", theme.id === "default" ? undefined : theme.id),
    getCategories(),
    getOffers({ categorySlug: categoria, sort: ordem })
  ]);
  const pageItems = offers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div className="container-site pt-4">
        <PageHero
          rounded
          banner={banners[0]}
          title2={t["offers.hero_title"]}
          subtitle={t["offers.hero_subtitle"]}
          script={t["offers.hero_script"]}
          leadingIcon={
            <span className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white sm:flex">
              <BadgePercent className="h-14 w-14" aria-hidden="true" />
            </span>
          }
        />
      </div>
      <Suspense>
        <CatalogLayout
          basePath="/ofertas"
          categories={categories}
          current={categoria}
          title={t["offers.list_title"]}
          subtitle={t["offers.list_subtitle"]}
          t={t}
          sort={ordem}
          page={page}
          total={offers.length}
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {pageItems.map(
              (o) =>
                o.products && (
                  <ProductCard key={o.id} product={o.products} promoPrice={o.promo_price} badge={o.badge_label || t["offers.badge_default"]} />
                )
            )}
          </div>
        </CatalogLayout>
      </Suspense>
    </>
  );
}
