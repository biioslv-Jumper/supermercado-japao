import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getProduct } from "@/lib/queries";
import { getSite } from "@/lib/site";
import { discountPercent, money } from "@/lib/format";
import { MediaImage } from "@/components/site/ui";

type P = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: P }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  return { title: p?.name ?? "Produto" };
}

export default async function ProductPage({ params }: { params: P }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const { content: t } = await getSite();
  const promo = product.promo_price && product.promo_price < product.price ? product.promo_price : null;
  const pct = discountPercent(product.price, promo);

  return (
    <div className="container-site mt-6">
      <Link href={product.categories ? `/produtos?categoria=${product.categories.slug}` : "/produtos"} className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
        <ChevronLeft className="h-4 w-4" /> {product.categories?.name ?? t["products.list_title"]}
      </Link>
      <article className="card grid gap-6 p-5 md:grid-cols-2 md:p-8">
        <div className="relative">
          {promo && <span className="absolute left-2 top-2 z-10 rounded-full bg-brand px-3 py-1 text-sm font-bold text-white">{t["offers.badge_default"]}</span>}
          <MediaImage path={product.image_path} alt={product.name} fit="contain" className="aspect-square w-full rounded-xl bg-white" sizes="(max-width: 768px) 100vw, 50vw" priority />
        </div>
        <div className="flex flex-col gap-3">
          {product.is_new && <span className="w-fit rounded-full bg-accent px-3 py-0.5 text-xs font-extrabold uppercase text-accent-ink">Novidade</span>}
          <h1 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">{product.name}</h1>
          {product.unit_label && <p className="text-slate-600">{product.unit_label}</p>}
          <div className="mt-2">
            {promo && <p className="text-slate-400 line-through">{money(product.price)}</p>}
            <div className="flex items-center gap-3">
              <p className="font-display text-4xl font-extrabold text-brand">{money(promo ?? product.price)}</p>
              {pct && <span className="rounded bg-accent px-2 py-1 font-extrabold text-accent-ink">-{pct}%</span>}
            </div>
          </div>
          {product.description && <p className="whitespace-pre-line text-slate-700">{product.description}</p>}
          <p className="mt-auto text-xs text-slate-500">{t["offers.price_note"]}</p>
        </div>
      </article>
    </div>
  );
}
