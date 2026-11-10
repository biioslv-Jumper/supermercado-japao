"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export type CarouselSlide = {
  id: string;
  src: string | null;
  title: string | null;
  description: string | null;
  buttonText: string | null;
  href: string | null;
  external: boolean;
};

export function BannerCarousel({ slides, interval = 6000 }: { slides: CarouselSlide[]; interval?: number }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), interval);
    return () => clearInterval(id);
  }, [count, paused, interval]);

  if (!count) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carrossel"
    >
      <div className="relative aspect-[1031/185] min-h-[150px] overflow-hidden rounded-xl bg-brand">
        {slides.map((s, i) => {
          const inner = (
            <>
              {s.src && <Image src={s.src} alt={s.title ?? "Campanha"} fill sizes="(max-width: 1280px) 100vw, 1240px" className="object-cover" priority={i === 0} />}
              {(s.title || s.description || s.buttonText) && (
                <div className="absolute inset-0 flex flex-col justify-center bg-gradient-to-r from-black/45 via-black/10 to-transparent p-6 text-white sm:p-10">
                  {s.title && <p className="max-w-lg font-display text-2xl font-extrabold leading-tight sm:text-4xl">{s.title}</p>}
                  {s.description && <p className="mt-1 max-w-md text-sm sm:text-base">{s.description}</p>}
                  {s.buttonText && (
                    <span className="mt-3 inline-flex w-fit items-center gap-2 rounded-md bg-white px-4 py-1.5 text-sm font-bold text-brand">
                      {s.buttonText} <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </div>
              )}
            </>
          );
          return (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
              aria-hidden={i !== index}
            >
              {s.href ? (
                s.external ? (
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="block h-full w-full" tabIndex={i === index ? 0 : -1}>
                    {inner}
                  </a>
                ) : (
                  <Link href={s.href} className="block h-full w-full" tabIndex={i === index ? 0 : -1}>
                    {inner}
                  </Link>
                )
              ) : (
                inner
              )}
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 text-brand shadow-lg hover:scale-105 sm:-left-4"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 text-brand shadow-lg hover:scale-105 sm:-right-4"
            aria-label="Próximo"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
      <div className="mt-2 flex justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => go(i)}
            aria-label={`Ir para o banner ${i + 1}`}
            aria-current={i === index}
            className={`h-2.5 w-6 rounded-full transition ${i === index ? "bg-brand" : "bg-slate-300"}`}
          />
        ))}
      </div>
    </div>
  );
}
