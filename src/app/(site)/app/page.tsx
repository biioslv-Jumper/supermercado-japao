import type { Metadata } from "next";
import { getSite } from "@/lib/site";
import { AppPromo } from "@/components/site/app-promo";

export const metadata: Metadata = { title: "APP" };

export default async function AppPage() {
  const { content: t, settings } = await getSite();
  return (
    <div className="mt-6">
      <h1 className="sr-only">{t["app.page_title"]}</h1>
      <AppPromo t={t} whatsapp={settings.whatsapp} />
    </div>
  );
}
