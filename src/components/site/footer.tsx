import Link from "next/link";
import { Heart, Mail, MapPin, Phone } from "lucide-react";
import { getSite } from "@/lib/site";
import { telLink, whatsappLink } from "@/lib/format";
import { Logo } from "./logo";
import { FacebookIcon, InstagramIcon, TiktokIcon, WhatsappIcon, YoutubeIcon } from "./social-icons";

export async function Footer() {
  const { content: t, settings: s } = await getSite();

  const useful = [
    { href: "/", label: t["nav.home"] },
    { href: "/ofertas", label: t["nav.offers"] },
    { href: "/setores", label: t["nav.sectors"] },
    { href: "/servicos", label: t["nav.services"] },
    { href: "/cartao-japao", label: t["nav.card"] },
    { href: "/contato", label: t["nav.contact"] },
    { href: "/app", label: t["nav.app"] }
  ];
  const about = [
    { href: "/institucional#historia", label: t["footer.link_history"] },
    { href: "/institucional#sustentabilidade", label: t["footer.link_sustainability"] },
    { href: "/institucional#trabalhe-conosco", label: t["footer.link_work"] },
    { href: "/contato", label: t["footer.link_contact"] }
  ];
  const socials = [
    { url: s.instagram_url, label: "Instagram", Icon: InstagramIcon },
    { url: s.facebook_url, label: "Facebook", Icon: FacebookIcon },
    { url: s.youtube_url, label: "YouTube", Icon: YoutubeIcon },
    { url: s.tiktok_url, label: "TikTok", Icon: TiktokIcon }
  ];
  const wa = whatsappLink(s.whatsapp);
  const tel = telLink(s.phone);
  const fullAddress = [s.address, s.address_city].filter(Boolean).join(", ");

  return (
    <footer className="mt-10 text-white">
      <div className="bg-footer">
        <div className="container-site grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.2fr] lg:divide-x lg:divide-white/15">
          <div className="lg:pr-6">
            <Link href="/" className="inline-block rounded-2xl bg-white p-2" aria-label="Página inicial">
              <Logo path={s.logo_path} className="h-14 w-auto" />
            </Link>
            <p className="mt-3 max-w-[16rem] whitespace-pre-line text-[15px] leading-snug text-white/90">{t["footer.tagline"]}</p>
          </div>

          <FooterCol title={t["footer.about_title"]}>
            {about.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-sky-300 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </FooterCol>

          <FooterCol title={t["footer.useful_title"]}>
            {useful.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sky-300 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </FooterCol>

          <div className="lg:px-6">
            <h2 className="mb-3 font-bold">{t["footer.social_title"]}</h2>
            <ul className="flex gap-4">
              {socials.map(({ url, label, Icon }) => (
                <li key={label}>
                  {url ? (
                    <a href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className="block hover:text-accent">
                      <Icon className="h-7 w-7" />
                    </a>
                  ) : (
                    <span aria-label={`${label} (em breve)`} title={`${label} — configure o link no painel`} className="block opacity-80">
                      <Icon className="h-7 w-7" />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:pl-6">
            <h2 className="mb-3 font-bold">{t["footer.contact_title"]}</h2>
            <ul className="space-y-2 text-[15px]">
              {s.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {tel ? <a href={tel} className="hover:text-accent">{s.phone}</a> : s.phone}
                </li>
              )}
              {s.whatsapp && (
                <li className="flex items-center gap-2">
                  <WhatsappIcon className="h-4 w-4 shrink-0" />
                  {wa ? (
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                      {s.whatsapp}
                    </a>
                  ) : (
                    s.whatsapp
                  )}
                </li>
              )}
              {s.email && (
                <li className="flex items-center gap-2 break-all">
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <a href={`mailto:${s.email}`} className="hover:text-accent">
                    {s.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-brand-dark">
        <div className="container-site flex flex-col items-center gap-2 py-3 text-center text-sm md:flex-row md:justify-between md:text-left">
          {fullAddress && (
            <p className="flex items-center gap-2">
              <MapPin className="h-5 w-5 shrink-0" aria-hidden="true" />
              {fullAddress}
            </p>
          )}
          <p>
            {/* Acesso administrativo discreto: este link SEMPRE leva ao /admin/login,
                qualquer que seja o texto configurado no painel. */}
            <Link href="/admin/login" className="hover:underline" prefetch={false}>
              {t["footer.copyright"] || "©"}
            </Link>
            {t["footer.rights"] ? <> {t["footer.rights"]}</> : null}
          </p>
          <p className="flex items-center gap-2">
            <Heart className="h-5 w-5 fill-current text-red-400" aria-hidden="true" />
            {t["footer.made_for"]}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="lg:px-6">
      <h2 className="mb-3 font-bold">{title}</h2>
      <ul className="space-y-1 text-[15px]">{children}</ul>
    </div>
  );
}
