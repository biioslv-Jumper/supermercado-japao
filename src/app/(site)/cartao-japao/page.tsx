import type { Metadata } from "next";
import { CreditCard } from "lucide-react";
import { getSite } from "@/lib/site";
import { whatsappLink } from "@/lib/format";
import { WhatsappIcon } from "@/components/site/social-icons";

export const metadata: Metadata = { title: "Cartão Japão" };

export default async function CardPage() {
  const { content: t, settings } = await getSite();
  const wa = whatsappLink(settings.whatsapp, "Olá! Gostaria de informações sobre o Cartão Japão.");
  return (
    <div className="container-site mt-6">
      <section className="card grid items-center gap-6 overflow-hidden md:grid-cols-[1fr_1.5fr]">
        <div className="hero-red flex h-full min-h-[220px] items-center justify-center p-8">
          <div className="flex aspect-[1.6/1] w-full max-w-xs flex-col justify-between rounded-2xl bg-gradient-to-br from-white/25 to-white/5 p-5 text-white shadow-2xl ring-1 ring-white/40">
            <CreditCard className="h-10 w-10" aria-hidden="true" />
            <p className="font-display text-2xl font-extrabold">{t["card.title"]}</p>
          </div>
        </div>
        <div className="p-6">
          <h1 className="font-display text-4xl font-extrabold">{t["card.title"]}</h1>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-700">{t["card.text"]}</p>
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn mt-5 bg-green-600 text-white hover:bg-green-700">
              <WhatsappIcon className="h-5 w-5" /> {t["contact.whatsapp_button"]}
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
