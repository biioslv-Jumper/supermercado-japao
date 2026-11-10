import type { Metadata } from "next";
import { ArrowRight, Clock, MapPin, ShieldCheck, Users } from "lucide-react";
import { getSite } from "@/lib/site";
import { getBanners, getServices } from "@/lib/queries";
import { whatsappLink } from "@/lib/format";
import { EmptyState, MediaImage, PageHero, SmartLink } from "@/components/site/ui";
import { Icon } from "@/components/icon";

export const metadata: Metadata = { title: "Serviços" };

export default async function ServicesPage() {
  const { content: t, settings, theme } = await getSite();
  const [banners, services] = await Promise.all([getBanners("services_header", theme.id === "default" ? undefined : theme.id), getServices()]);
  const benefits = [
    { Ico: Clock, title: t["services.benefit1_title"], text: t["services.benefit1_text"] },
    { Ico: Users, title: t["services.benefit2_title"], text: t["services.benefit2_text"] },
    { Ico: ShieldCheck, title: t["services.benefit3_title"], text: t["services.benefit3_text"] },
    { Ico: MapPin, title: t["services.benefit4_title"], text: t["services.benefit4_text"] }
  ];

  return (
    <>
      <PageHero
        banner={banners[0]}
        title1={t["services.hero_title1"]}
        title2={t["services.hero_title2"]}
        subtitle={t["services.hero_subtitle"]}
        script={t["services.hero_script"]}
      />
      <div className="container-site relative -mt-4">
        <section className="card p-4 sm:p-6" aria-labelledby="servicos-titulo">
          <div className="mb-4 flex items-center gap-3">
            <Icon name="grid" className="h-9 w-9 text-brand" />
            <div>
              <h2 id="servicos-titulo" className="section-title leading-tight">{t["services.list_title"]}</h2>
              <p className="text-blue-900/70">{t["services.list_subtitle"]}</p>
            </div>
          </div>
          {services.length === 0 ? (
            <EmptyState>Nenhum serviço cadastrado.</EmptyState>
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((s) => (
                <li id={s.id} key={s.id} className="flex scroll-mt-24 flex-col overflow-hidden rounded-lg bg-white shadow-card ring-1 ring-slate-100">
                  <MediaImage path={s.image_path} alt={s.name} className="aspect-[2.9/1] w-full" sizes="(max-width: 640px) 100vw, 25vw" />
                  <div className="flex flex-1 gap-3 p-3">
                    <Icon name={s.icon} className="h-10 w-10 shrink-0 text-brand" />
                    <div>
                      <h3 className="font-display text-xl font-extrabold leading-tight">{s.name}</h3>
                      <p className="mt-1 text-sm leading-snug text-slate-600">{s.description}</p>
                    </div>
                  </div>
                  <div className="px-3 pb-3">
                    <SmartLink
                      href={s.link_url || whatsappLink(settings.whatsapp, `Olá! Gostaria de informações sobre: ${s.name}`) || "/contato"}
                      className="btn-brand w-full py-1.5"
                    >
                      {t["services.button"]} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </SmartLink>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-6 bg-rose-50" aria-label="Vantagens">
        <ul className="container-site grid grid-cols-1 gap-4 py-5 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-rose-200">
          {benefits.map(({ Ico, title, text }) => (
            <li key={title} className="flex items-center justify-center gap-3">
              <Ico className="h-12 w-12 text-brand" aria-hidden="true" />
              <p className="leading-tight">
                <span className="block font-extrabold">{title}</span>
                {text}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
