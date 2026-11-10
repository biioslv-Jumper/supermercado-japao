import Link from "next/link";
import { ArrowRight, Clock, Coffee, CreditCard, Mail, MapPin, Megaphone, Percent, Phone, Sparkles, Star, Store, Tag } from "lucide-react";
import { getSite } from "@/lib/site";
import { getBanners, getCategories, getHighlight, getNews, getOffers, getServices } from "@/lib/queries";
import { discountPercent, isExternal, mediaUrl, money, safeHref, telLink, whatsappLink } from "@/lib/format";
import { BannerCarousel } from "@/components/site/banner-carousel";
import { MediaImage, ProductCard, SectionHeader, SmartLink } from "@/components/site/ui";
import { Hero } from "@/components/site/hero";
import { Icon } from "@/components/icon";
import { WhatsappIcon } from "@/components/site/social-icons";

export default async function HomePage() {
  const { content: t, settings: s, theme } = await getSite();
  const themeId = theme.id === "default" ? undefined : theme.id;
  const [heroBanners, carousel, strips, offers, highlight, news, services, categories] = await Promise.all([
    getBanners("home_hero", themeId),
    getBanners("home_carousel", themeId),
    getBanners("strip", themeId),
    getOffers({ limit: 14 }),
    getHighlight(),
    getNews(8),
    getServices(),
    getCategories()
  ]);
  const hero = heroBanners[0];
  const fullAddress = [s.address, s.address_city].filter(Boolean).join(" - ");
  const wa = whatsappLink(s.whatsapp);
  const tel = telLink(s.phone);
  const hp = highlight?.products;

  return (
    <>
      {/* ===== BANNER PRINCIPAL ===== */}
      <Hero
        overlap
        imagePath={hero?.image_path}
        imageAlt={hero?.title ?? undefined}
        script={t["home.hero_script"]}
        left={
          <>
            <h1 className="font-display text-[2rem] font-bold leading-[1.1] drop-shadow sm:text-4xl lg:text-[2.6rem]">
              {t["home.hero_line1"]}
              <br />
              <span className="font-extrabold text-accent">{t["home.hero_highlight"]}</span>
              <br />
              {t["home.hero_line3"]}
            </h1>
            {t["home.hero_button"] && (
              <SmartLink href={t["home.hero_button_url"] || "/ofertas"} className="btn-accent mt-5 px-6 py-2.5 text-base shadow-lg">
                {t["home.hero_button"]} <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </SmartLink>
            )}
          </>
        }
      />

      <div className="container-site relative z-10 -mt-8 space-y-8">
        {/* ===== ACONTECE NO JAPÃO ===== */}
        {carousel.length > 0 && (
          <section className="card p-4 sm:p-5" aria-labelledby="acontece">
            <div className="mb-3 flex items-center gap-3">
              <Megaphone className="h-9 w-9 -rotate-12 text-brand" aria-hidden="true" />
              <div>
                <h2 id="acontece" className="section-title leading-tight">{t["home.events_title"]}</h2>
                <p className="text-sm text-slate-600">{t["home.events_subtitle"]}</p>
              </div>
            </div>
            <BannerCarousel
              slides={carousel.map((b) => {
                const href = safeHref(b.link_url);
                return {
                  id: b.id,
                  src: mediaUrl(b.image_path),
                  title: b.title,
                  description: b.description,
                  buttonText: b.button_text,
                  href,
                  external: href ? isExternal(href) : false
                };
              })}
            />
          </section>
        )}

        {/* ===== ATALHOS ===== */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Atalhos">
          <QuickCard icon={<Percent className="h-9 w-9" />} title={t["home.quick_offers_title"]} button={t["home.quick_offers_button"]} href="/ofertas" />
          <QuickCard icon={<CreditCard className="h-9 w-9" />} title={t["home.quick_card_title"]} button={t["home.quick_card_button"]} href="/cartao-japao" />
          <QuickCard icon={<Coffee className="h-9 w-9" />} title={t["home.quick_cafe_title"]} button={t["home.quick_cafe_button"]} href="/cafeteria" />
          <a
            href={s.maps_url ?? "/contato"}
            target={s.maps_url ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl bg-green-50 p-3 shadow-card ring-1 ring-green-100 transition hover:bg-green-100"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
              <Store className="h-7 w-7" aria-hidden="true" />
            </span>
            <span className="flex-1">
              <span className="block font-bold text-ink">{t["home.quick_store_title"]}</span>
              <span className="block text-sm text-green-800">{t["home.quick_store_text"]}</span>
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white">
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </a>
        </section>

        {/* ===== OFERTAS DA SEMANA ===== */}
        {offers.length > 0 && (
          <section aria-labelledby="ofertas-semana">
            <SectionHeader
              icon={<Tag className="h-8 w-8" />}
              title={t["home.offers_title"]}
              subtitle={t["home.offers_subtitle"]}
              linkHref="/ofertas"
              linkLabel={t["home.offers_link"]}
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
              {offers.slice(0, 7).map((o) => o.products && <ProductCard key={o.id} product={o.products} promoPrice={o.promo_price} badgeStyle="percent" />)}
            </div>
          </section>
        )}

        {/* ===== DESTAQUE DA SEMANA ===== */}
        {highlight && (
          <section aria-labelledby="destaque" className="card overflow-hidden">
            <div className="grid md:grid-cols-[1fr_1.4fr]">
              <MediaImage
                path={highlight.image_path ?? hp?.image_path}
                alt={hp?.name ?? highlight.title}
                fit="contain"
                className="aspect-[4/3] w-full bg-white md:aspect-auto md:min-h-[260px]"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="flex flex-col justify-center gap-3 bg-gradient-to-br from-brand to-brand-dark p-6 text-white sm:p-8">
                <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-accent">
                  <Star className="h-4 w-4 fill-current" aria-hidden="true" /> {highlight.title}
                </p>
                <h2 id="destaque" className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">{hp?.name ?? highlight.title}</h2>
                <p className="text-white/90">{highlight.description || t["home.highlight_subtitle"]}</p>
                {hp && (
                  <div className="flex flex-wrap items-end gap-3">
                    {hp.promo_price && hp.promo_price < hp.price && <span className="text-white/70 line-through">{money(hp.price)}</span>}
                    <span className="font-display text-4xl font-extrabold text-accent">{money(hp.promo_price && hp.promo_price < hp.price ? hp.promo_price : hp.price)}</span>
                    {hp.unit_label && <span className="pb-1 text-white/80">/ {hp.unit_label}</span>}
                    {discountPercent(hp.price, hp.promo_price) && (
                      <span className="mb-1 rounded bg-accent px-2 py-0.5 text-sm font-extrabold text-accent-ink">-{discountPercent(hp.price, hp.promo_price)}%</span>
                    )}
                  </div>
                )}
                {hp && (
                  <Link href={`/produtos/${hp.slug}`} className="btn mt-1 w-fit bg-white text-brand hover:bg-white/90">
                    {t["home.highlight_button"]} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ===== FAIXA (banner 728x110) ===== */}
        {strips.map((b) => (
          <SmartLink key={b.id} href={b.link_url} className="mx-auto block w-full max-w-[728px]">
            <MediaImage path={b.image_path} alt={b.title ?? "Banner"} className="aspect-[728/110] w-full rounded-lg" sizes="728px" />
          </SmartLink>
        ))}

        {/* ===== NOVIDADES ===== */}
        {news.length > 0 && (
          <section aria-labelledby="novidades">
            <SectionHeader icon={<Sparkles className="h-8 w-8" />} title={t["home.news_title"]} subtitle={t["home.news_subtitle"]} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {news.map((n) => {
                const href = n.link_url || (n.products ? `/produtos/${n.products.slug}` : null);
                return (
                  <SmartLink key={n.id} href={href} className="card group flex gap-3 p-3 transition hover:-translate-y-0.5">
                    <MediaImage path={n.image_path ?? n.products?.image_path} alt={n.title} fit="contain" className="h-24 w-24 shrink-0 rounded-lg bg-white" sizes="96px" />
                    <div className="min-w-0">
                      <span className="mb-1 inline-block rounded-full bg-accent px-2 py-0.5 text-[11px] font-extrabold uppercase text-accent-ink">Novo</span>
                      <h3 className="font-bold leading-tight text-ink group-hover:text-brand">{n.title}</h3>
                      {n.description && <p className="mt-0.5 line-clamp-2 text-sm text-slate-600">{n.description}</p>}
                      {n.products && <p className="mt-1 font-extrabold text-brand">{money(n.products.promo_price ?? n.products.price)}</p>}
                    </div>
                  </SmartLink>
                );
              })}
            </div>
          </section>
        )}

        {/* ===== NOSSA LOJA (somente uma loja) ===== */}
        <section aria-labelledby="nossa-loja">
          <SectionHeader icon={<Store className="h-8 w-8" />} title={t["home.store_title"]} subtitle={t["home.store_subtitle"]} />
          <div className="card grid overflow-hidden md:grid-cols-[1.2fr_1fr]">
            <MediaImage path={s.store_photo_path} alt={t["home.store_name"]} className="aspect-[2.8/1] w-full md:aspect-auto md:min-h-[180px]" sizes="(max-width: 768px) 100vw, 55vw" />
            <div className="flex flex-col justify-center gap-2 p-5">
              <h3 className="flex items-center gap-2 font-display text-xl font-extrabold">
                <MapPin className="h-6 w-6 text-brand" aria-hidden="true" /> {t["home.store_name"]}
              </h3>
              {fullAddress && <p className="text-slate-700">{fullAddress}</p>}
              {s.opening_hours && (
                <p className="flex items-start gap-2 whitespace-pre-line text-sm text-slate-600">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {s.opening_hours}
                </p>
              )}
              {s.maps_url && (
                <a href={s.maps_url} target="_blank" rel="noopener noreferrer" className="btn-brand mt-1 w-fit">
                  {t["home.store_button"]} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </section>

        {/* ===== NOSSOS SERVIÇOS ===== */}
        {services.length > 0 && (
          <section aria-labelledby="servicos">
            <SectionHeader
              icon={<ServiceGear />}
              title={t["home.services_title"]}
              subtitle={t["home.services_subtitle"]}
              linkHref="/servicos"
              linkLabel={t["home.services_link"]}
            />
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
              {services.map((sv) => (
                <li key={sv.id}>
                  <Link href={`/servicos#${sv.id}`} className="card flex h-full items-center gap-2 px-3 py-3 text-sm font-bold transition hover:-translate-y-0.5">
                    <Icon name={sv.icon} className="h-6 w-6 shrink-0 text-brand" />
                    <span className="flex-1 leading-tight">{sv.name}</span>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ===== CATEGORIAS ===== */}
        {categories.length > 0 && (
          <section aria-labelledby="categorias">
            <SectionHeader
              title={t["home.categories_title"]}
              subtitle={t["home.categories_subtitle"]}
              linkHref="/setores"
              linkLabel={t["home.categories_link"]}
            />
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={c.link_url || `/produtos?categoria=${c.slug}`}
                    className="card flex h-full flex-col items-center gap-2 p-3 text-center text-sm font-bold transition hover:-translate-y-0.5 hover:text-brand"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
                      <Icon name={c.icon} className="h-6 w-6" />
                    </span>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ===== INSTITUCIONAL + CONTATO ===== */}
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="card p-6">
            <h2 className="section-title">{t["home.about_title"]}</h2>
            <p className="mt-2 whitespace-pre-line text-slate-700">{t["home.about_text"]}</p>
            <Link href="/institucional" className="btn-brand mt-4">
              {t["home.about_button"]} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="card p-6">
            <h2 className="section-title">{t["home.contact_title"]}</h2>
            <p className="text-slate-600">{t["home.contact_subtitle"]}</p>
            <ul className="mt-3 space-y-2">
              {s.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-brand" aria-hidden="true" />
                  {tel ? <a href={tel} className="font-semibold hover:text-brand">{s.phone}</a> : s.phone}
                </li>
              )}
              {s.whatsapp && wa && (
                <li className="flex items-center gap-2">
                  <WhatsappIcon className="h-5 w-5 text-green-600" />
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-brand">
                    {s.whatsapp}
                  </a>
                </li>
              )}
              {s.email && (
                <li className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-brand" aria-hidden="true" />
                  <a href={`mailto:${s.email}`} className="font-semibold hover:text-brand">{s.email}</a>
                </li>
              )}
              {fullAddress && (
                <li className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-brand" aria-hidden="true" /> {fullAddress}
                </li>
              )}
              {s.opening_hours && (
                <li className="flex items-start gap-2 whitespace-pre-line">
                  <Clock className="mt-0.5 h-5 w-5 text-brand" aria-hidden="true" /> {s.opening_hours}
                </li>
              )}
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}

function QuickCard({ icon, title, button, href }: { icon: React.ReactNode; title: string; button: string; href: string }) {
  return (
    <div className="card flex items-center gap-3 p-3">
      <span className="text-brand">{icon}</span>
      <div className="flex-1">
        <p className="font-bold leading-tight text-ink">{title}</p>
        <Link href={href} className="btn-brand mt-1.5 w-full py-1.5 text-sm">
          {button} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

function ServiceGear() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor" aria-hidden="true">
      <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm9.4 5.5-.1-3 2-1.6-2-3.4-2.5.8a8 8 0 0 0-2.6-1.5L15.7 2h-4l-.5 2.6a8 8 0 0 0-2.6 1.5l-2.5-.8-2 3.4 2 1.6a8 8 0 0 0 0 3l-2 1.6 2 3.4 2.5-.8a8 8 0 0 0 2.6 1.5l.5 2.6h4l.5-2.6a8 8 0 0 0 2.6-1.5l2.5.8 2-3.4-2-1.6z" />
    </svg>
  );
}
