import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getSite } from "@/lib/site";
import { telLink, whatsappLink } from "@/lib/format";
import { MediaImage } from "@/components/site/ui";
import { FacebookIcon, InstagramIcon, TiktokIcon, WhatsappIcon, YoutubeIcon } from "@/components/site/social-icons";

export const metadata: Metadata = { title: "Contato" };

export default async function ContactPage() {
  const { content: t, settings: s } = await getSite();
  const wa = whatsappLink(s.whatsapp, "Olá, Supermercado Japão!");
  const tel = telLink(s.phone);
  const address = [s.address, s.address_city].filter(Boolean).join(" - ");
  const socials = [
    { url: s.instagram_url, label: "Instagram", Icon: InstagramIcon },
    { url: s.facebook_url, label: "Facebook", Icon: FacebookIcon },
    { url: s.youtube_url, label: "YouTube", Icon: YoutubeIcon },
    { url: s.tiktok_url, label: "TikTok", Icon: TiktokIcon }
  ].filter((x) => x.url);

  return (
    <div className="container-site mt-6">
      <h1 className="font-display text-4xl font-extrabold">{t["contact.title"]}</h1>
      <p className="text-slate-600">{t["contact.subtitle"]}</p>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <ul className="card divide-y divide-slate-100 p-2">
          {s.phone && (
            <ContactRow icon={<Phone className="h-6 w-6" />} label={t["contact.phone_label"]}>
              {tel ? <a href={tel} className="hover:text-brand">{s.phone}</a> : s.phone}
            </ContactRow>
          )}
          {s.whatsapp && (
            <ContactRow icon={<WhatsappIcon className="h-6 w-6" />} label={t["contact.whatsapp_label"]}>
              {s.whatsapp}
              {wa && (
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn mt-2 w-fit bg-green-600 text-white hover:bg-green-700">
                  <WhatsappIcon className="h-4 w-4" /> {t["contact.whatsapp_button"]}
                </a>
              )}
            </ContactRow>
          )}
          {s.email && (
            <ContactRow icon={<Mail className="h-6 w-6" />} label={t["contact.email_label"]}>
              <a href={`mailto:${s.email}`} className="break-all hover:text-brand">{s.email}</a>
            </ContactRow>
          )}
          {address && (
            <ContactRow icon={<MapPin className="h-6 w-6" />} label={t["contact.address_label"]}>
              {s.maps_url ? (
                <a href={s.maps_url} target="_blank" rel="noopener noreferrer" className="hover:text-brand">{address}</a>
              ) : (
                address
              )}
            </ContactRow>
          )}
          {s.opening_hours && (
            <ContactRow icon={<Clock className="h-6 w-6" />} label={t["contact.hours_label"]}>
              <span className="whitespace-pre-line">{s.opening_hours}</span>
            </ContactRow>
          )}
          {socials.length > 0 && (
            <li className="flex gap-4 p-4">
              {socials.map(({ url, label, Icon }) => (
                <a key={label} href={url!} target="_blank" rel="noopener noreferrer" aria-label={label} className="text-brand hover:text-brand-dark">
                  <Icon className="h-8 w-8" />
                </a>
              ))}
            </li>
          )}
        </ul>
        <MediaImage path={s.store_photo_path} alt={s.store_name} className="card aspect-[2.8/1] w-full lg:aspect-auto lg:min-h-[320px]" sizes="(max-width: 1024px) 100vw, 50vw" />
      </div>
    </div>
  );
}

function ContactRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-4 p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">{icon}</span>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-slate-500">{label}</span>
        <span className="text-lg font-semibold">{children}</span>
      </div>
    </li>
  );
}
