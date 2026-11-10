import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ImageOff } from "lucide-react";
import { discountPercent, isExternal, mediaUrl, money, safeHref } from "@/lib/format";
import type { Banner, Product } from "@/lib/types";

/** Imagem vinda do banco (pasta public/ ou Supabase Storage) com reserva. */
export function MediaImage({
  path,
  alt,
  className,
  sizes = "(max-width: 768px) 50vw, 25vw",
  priority,
  fit = "cover",
  imgClassName = ""
}: {
  path: string | null | undefined;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fit?: "cover" | "contain";
  imgClassName?: string;
}) {
  const src = mediaUrl(path);
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 text-slate-300 ${className ?? ""}`} role="img" aria-label={alt}>
        <ImageOff className="h-8 w-8" aria-hidden="true" />
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`${fit === "cover" ? "object-cover" : "object-contain"} ${imgClassName}`} />
    </div>
  );
}

/** Link que abre em nova aba quando é externo. */
export function SmartLink({ href, className, children }: { href: string | null | undefined; className?: string; children: React.ReactNode }) {
  const safe = safeHref(href);
  if (!safe) return <span className={className}>{children}</span>;
  if (isExternal(safe))
    return (
      <a href={safe} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  return (
    <Link href={safe} className={className}>
      {children}
    </Link>
  );
}

export function SectionHeader({
  icon,
  title,
  subtitle,
  linkHref,
  linkLabel
}: {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  linkHref?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div className="flex items-center gap-3">
        {icon && <span className="text-brand">{icon}</span>}
        <div>
          <h2 className="section-title leading-tight">{title}</h2>
          {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
        </div>
      </div>
      {linkHref && linkLabel && (
        <Link href={linkHref} className="flex items-center gap-1 text-sm font-bold text-brand hover:underline">
          {linkLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

/** Card de produto (sem carrinho / sem "Adicionar"). */
export function ProductCard({
  product,
  promoPrice,
  badge,
  badgeStyle = "label"
}: {
  product: Product;
  promoPrice?: number | null;
  badge?: string | null;
  badgeStyle?: "label" | "percent";
}) {
  const promo = promoPrice ?? product.promo_price;
  const pct = discountPercent(product.price, promo);
  const hasPromo = !!promo && promo < product.price;

  return (
    <Link
      href={`/produtos/${product.slug}`}
      className="group relative flex h-full flex-col rounded-lg border border-slate-200 bg-white p-2.5 transition hover:-translate-y-0.5 hover:shadow-card"
    >
      {hasPromo && (badgeStyle === "percent" ? pct : badge) && (
        <span className="absolute left-2 top-2 z-10 rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-white">
          {badgeStyle === "percent" ? `-${pct}%` : badge}
        </span>
      )}
      <MediaImage path={product.image_path} alt={product.name} fit="contain" className="aspect-[4/3] w-full rounded-md bg-white" />
      <div className="mt-2 flex flex-1 flex-col">
        <h3 className="text-[13px] font-semibold leading-tight text-ink group-hover:text-brand">{product.name}</h3>
        {product.unit_label && <p className="text-[12px] text-slate-500">{product.unit_label}</p>}
        <div className="mt-auto pt-1">
          {hasPromo && <p className="text-[12px] text-slate-400 line-through">{money(product.price)}</p>}
          <div className="flex items-center justify-between gap-1">
            <p className="text-lg font-extrabold leading-none text-brand">{money(hasPromo ? promo : product.price)}</p>
            {pct ? <span className="rounded bg-accent px-1.5 py-0.5 text-[11px] font-extrabold text-accent-ink">-{pct}%</span> : null}
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Banner de topo das páginas (Ofertas, Setores, Serviços): fundo vermelho,
 * textos editáveis à esquerda, ilustração (banner do admin) no centro e
 * frase manuscrita à direita — fiel às imagens de referência.
 */
export function PageHero({
  banner,
  title1,
  title2,
  subtitle,
  script,
  leadingIcon,
  rounded
}: {
  banner?: Banner | null;
  title1?: string;
  title2: string;
  subtitle?: string;
  script?: string;
  leadingIcon?: React.ReactNode;
  rounded?: boolean;
}) {
  return (
    <section className={`hero-red relative overflow-hidden text-white ${rounded ? "rounded-2xl" : ""}`}>
      <div className="bg-waves absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="container-site relative grid min-h-[190px] items-center gap-4 py-6 md:grid-cols-[1.1fr_1fr_1fr]">
        <div className="flex items-center gap-4">
          {leadingIcon}
          <div>
            {title1 && <p className="font-display text-4xl font-extrabold leading-none sm:text-5xl">{title1}</p>}
            <h1 className={`font-display font-extrabold leading-none ${title1 ? "text-accent text-5xl sm:text-6xl" : "text-5xl sm:text-6xl"}`}>{title2}</h1>
            {subtitle && <p className="mt-2 max-w-md whitespace-pre-line text-lg leading-snug text-white/95">{subtitle}</p>}
          </div>
        </div>
        <div className="-mb-6 hidden self-end md:block">
          {banner?.image_path && (
            <MediaImage path={banner.image_path} alt={banner.title ?? ""} fit="contain" imgClassName="object-bottom" className="h-[190px] w-full" sizes="33vw" priority />
          )}
        </div>
        {script && (
          <p className="hidden -rotate-6 whitespace-pre-line text-right font-script text-2xl leading-snug md:block lg:text-3xl">
            <ScriptText text={script} />
          </p>
        )}
      </div>
    </section>
  );
}

/** Frase manuscrita com a segunda parte em amarelo e sublinhado. */
export function ScriptText({ text }: { text: string }) {
  const words = text.split(" ");
  const mid = Math.ceil(words.length / 3);
  return (
    <>
      {words.slice(0, mid).join(" ")}{" "}
      <span className="text-accent">{words.slice(mid, mid * 2).join(" ")}</span> {words.slice(mid * 2).join(" ")}
      <svg viewBox="0 0 200 12" className="ml-auto mt-1 block h-3 w-48 text-accent" aria-hidden="true">
        <path d="M2 10 Q100 0 198 4" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    </>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">{children}</div>;
}
