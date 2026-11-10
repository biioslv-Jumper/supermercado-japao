import type { Metadata } from "next";
import { Briefcase, History, Leaf } from "lucide-react";
import { getSite } from "@/lib/site";

export const metadata: Metadata = { title: "Institucional" };

export default async function AboutPage() {
  const { content: t } = await getSite();
  const blocks = [
    { id: "historia", Ico: History, title: t["about.title"], text: t["about.text"] },
    { id: "sustentabilidade", Ico: Leaf, title: t["about.sustainability_title"], text: t["about.sustainability_text"] },
    { id: "trabalhe-conosco", Ico: Briefcase, title: t["about.work_title"], text: t["about.work_text"] }
  ];
  return (
    <div className="container-site mt-6 space-y-5">
      <h1 className="font-display text-4xl font-extrabold">{t["home.about_title"]}</h1>
      {blocks.map(({ id, Ico, title, text }) => (
        <section key={id} id={id} className="card scroll-mt-24 p-6">
          <h2 className="section-title flex items-center gap-3">
            <Ico className="h-7 w-7 text-brand" aria-hidden="true" /> {title}
          </h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-700">{text}</p>
        </section>
      ))}
    </div>
  );
}
