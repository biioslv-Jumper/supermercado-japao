import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShoppingBasket, UtensilsCrossed } from "lucide-react";
import { getSite } from "@/lib/site";
import { getBanners, getCategories, getServices } from "@/lib/queries";
import { mediaUrl } from "@/lib/format";
import { MediaImage, PageHero, SmartLink } from "@/components/site/ui";
import { SectorGrid } from "@/components/site/sector-grid";
import { AppPromo } from "@/components/site/app-promo";
import { Icon } from "@/components/icon";

export const metadata: Metadata = { title: "Setores" };

export default async function SectorsPage() {
  const { content: t, settings, theme } = await getSite();
  const [banners, categories, services] = await Promise.all([
    getBanners("sectors_header", theme.id === "default" ? undefined : theme.id),
    getCategories(),
    getServices()
  ]);
  const sectors = categories
    .filter((c) => c.show_in_sectors)
    .map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      icon: c.icon,
      image: mediaUrl(c.image_path),
      href: c.link_url || `/produtos?categoria=${c.slug}`
    }));

  return (
    <>
      <PageHero
        banner={banners[0]}
        title1={t["sectors.hero_title1"]}
        title2={t["sectors.hero_title2"]}
        subtitle={t["sectors.hero_subtitle"]}
        script={t["sectors.hero_script"]}
      />

      <div className="container-site relative -mt-4 space-y-6">
        <section className="card relative p-4 sm:p-5" aria-labelledby="setores-titulo">
          <div className="mb-4 flex items-center gap-3 sm:pr-72">
            <ShoppingBasket className="h-9 w-9 text-brand" aria-hidden="true" />
            <div>
              <h2 id="setores-titulo" className="section-title leading-tight">{t["sectors.list_title"]}</h2>
              <p className="text-sm text-blue-900/70">{t["sectors.list_subtitle"]}</p>
            </div>
          </div>
          <SectorGrid sectors={sectors} placeholder={t["sectors.search_placeholder"]} button={t["sectors.card_button"]} />
        </section>

        {/* Restaurante Grill */}
        <section className="relative overflow-hidden rounded-xl shadow-card" aria-labelledby="grill">
          <MediaImage path="/demo/grill-banner.webp" alt={t["sectors.grill_title"]} className="aspect-[957/102] min-h-[120px] w-full" sizes="100vw" />
          <div className="relative flex flex-wrap items-center gap-4 bg-white/95 p-4 sm:absolute sm:bottom-3 sm:left-3 sm:w-[60%] sm:rounded-lg">
            <UtensilsCrossed className="h-10 w-10 text-amber-500" aria-hidden="true" />
            <div className="flex-1">
              <h2 id="grill" className="font-display text-2xl font-extrabold leading-tight">{t["sectors.grill_title"]}</h2>
              <p className="text-sm text-slate-600">{t["sectors.grill_text"]}</p>
            </div>
            <SmartLink href={t["sectors.grill_url"] || "/contato"} className="btn-brand px-6">
              {t["sectors.grill_button"]} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </SmartLink>
          </div>
        </section>

        {/* Serviços */}
        {services.length > 0 && (
          <section className="rounded-xl bg-slate-100/70 p-4" aria-labelledby="servicos-setores">
            <div className="mb-3 flex items-center gap-3">
              <Icon name="grid" className="h-8 w-8 text-brand" />
              <div>
                <h2 id="servicos-setores" className="section-title leading-tight">{t["sectors.services_title"]}</h2>
                <p className="text-sm text-slate-600">{t["sectors.services_subtitle"]}</p>
              </div>
            </div>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {services.slice(0, 6).map((s) => (
                <li key={s.id} className="flex flex-col rounded-lg bg-white p-3 shadow-card">
                  <div className="flex items-start gap-2">
                    <Icon name={s.icon} className="h-9 w-9 shrink-0 text-brand" />
                    <MediaImage path={s.image_path} alt="" className="h-12 flex-1 rounded" sizes="120px" />
                  </div>
                  <h3 className="mt-2 text-sm font-extrabold">{s.name}</h3>
                  <p className="line-clamp-2 flex-1 text-xs text-slate-500">{s.description}</p>
                  <Link href={`/servicos#${s.id}`} className="btn-brand mt-2 py-1 text-xs">
                    {t["services.button"]} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div className="mt-6">
        <AppPromo t={t} whatsapp={settings.whatsapp} />
      </div>
    </>
  );
}
