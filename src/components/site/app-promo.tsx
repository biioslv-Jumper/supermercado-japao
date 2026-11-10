import { ArrowRight, CheckSquare } from "lucide-react";
import { MediaImage, SmartLink } from "./ui";
import { whatsappLink } from "@/lib/format";

/** Seção "Super Japão no seu celular! — EM BREVE". */
export function AppPromo({ t, whatsapp }: { t: Record<string, string>; whatsapp: string | null }) {
  const features = (t["app.features"] ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
  const href = whatsappLink(whatsapp, "Olá! Quero ser avisado quando o APP do Super Japão for lançado.") ?? "/contato";
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-rose-50 via-white to-rose-50" aria-labelledby="app-titulo">
      <div className="container-site grid items-center gap-6 py-6 md:grid-cols-[0.9fr_1.2fr_1fr]">
        <MediaImage path="/demo/app-promo.webp" alt="Aplicativo Super Japão" fit="contain" className="mx-auto aspect-[327/196] w-full max-w-sm" sizes="(max-width: 768px) 100vw, 30vw" />
        <div>
          <span className="inline-block rounded-md bg-brand px-3 py-1 text-sm font-extrabold text-white">{t["app.badge"]}</span>
          <h2 id="app-titulo" className="mt-2 font-display text-4xl font-extrabold leading-none text-ink">
            {t["app.title1"]}
            <br />
            <span className="text-brand">{t["app.title2"]}</span>
          </h2>
          <p className="mt-3 max-w-md text-slate-700">{t["app.text"]}</p>
        </div>
        <div className="card p-5">
          <ul className="space-y-1.5">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-[15px]">
                <CheckSquare className="h-5 w-5 shrink-0 fill-brand text-white" aria-hidden="true" /> {f}
              </li>
            ))}
          </ul>
          <SmartLink href={href} className="btn-brand mt-4 w-full">
            {t["app.button"]} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </SmartLink>
        </div>
      </div>
    </section>
  );
}
