import type { Metadata } from "next";
import { CalendarClock, Clock } from "lucide-react";
import { getSite } from "@/lib/site";
import { getBanners, getCafe } from "@/lib/queries";
import { mediaUrl, money } from "@/lib/format";
import { MediaImage } from "@/components/site/ui";
import { CafeMenu } from "@/components/site/cafe-menu";

export const metadata: Metadata = { title: "Cafeteria Japão" };

export default async function CafePage() {
  const { content: t, theme } = await getSite();
  const [banners, cafe] = await Promise.all([getBanners("cafe_header", theme.id === "default" ? undefined : theme.id), getCafe()]);
  const header = banners[0];

  return (
    <div className="bg-cafe-50/60 pb-4">
      <div className="container-site space-y-5 pt-4">
        {/* Banner da cafeteria (moldura ornamental) */}
        <section className="rounded-2xl border-[3px] border-double border-cafe-600/60 bg-cafe-100 p-1 shadow-sm">
          {header?.image_path ? (
            <MediaImage path={header.image_path} alt={header.title ?? "Cafeteria Japão — Cafés, Lanches e Delícias Especiais"} className="aspect-[1172/228] w-full rounded-xl" sizes="100vw" priority />
          ) : (
            <h1 className="p-10 text-center font-display text-4xl font-extrabold text-cafe-800">Cafeteria Japão</h1>
          )}
          {header?.image_path && <h1 className="sr-only">{header.title ?? "Cafeteria Japão"}</h1>}
        </section>

        {/* Horário de atendimento */}
        <section
          aria-label={t["cafe.hours_title"]}
          className="mx-auto grid max-w-5xl items-center gap-3 rounded-xl border-2 border-cafe-600/50 bg-cafe-50 px-6 py-3 text-cafe-800 shadow-sm sm:grid-cols-3 sm:divide-x sm:divide-cafe-600/40"
        >
          <p className="flex items-center justify-center gap-3 font-display text-2xl font-extrabold">
            <Clock className="h-8 w-8" aria-hidden="true" /> {t["cafe.hours_title"]}
          </p>
          <p className="flex items-center justify-center gap-3 font-semibold">
            <CalendarClock className="h-8 w-8" aria-hidden="true" />
            <span>
              {t["cafe.hours_weekdays_label"]}
              <br />
              {t["cafe.hours_weekdays"]}
            </span>
          </p>
          <p className="flex items-center justify-center gap-3 font-semibold">
            <CalendarClock className="h-8 w-8" aria-hidden="true" />
            <span>
              {t["cafe.hours_sunday_label"]}
              <br />
              {t["cafe.hours_sunday"]}
            </span>
          </p>
        </section>

        <CafeMenu
          categories={cafe.categories.map((c) => ({ id: c.id, name: c.name, icon: c.icon }))}
          items={cafe.items.map((i) => ({
            id: i.id,
            categoryId: i.cafe_category_id,
            name: i.name,
            description: i.description,
            price: i.price !== null ? money(i.price) : "",
            image: mediaUrl(i.image_path),
            imagesUrl: /^https?:\/\//i.test(i.images_url ?? "") ? i.images_url : null
          }))}
          allLabel={t["cafe.all"]}
          title={t["cafe.menu_title"]}
          button={t["cafe.button"]}
          empty={t["cafe.empty"]}
        />
      </div>
    </div>
  );
}
