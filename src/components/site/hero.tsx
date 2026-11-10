import Image from "next/image";
import { mediaUrl } from "@/lib/format";

/**
 * Banner vermelho do topo das páginas (Início, Ofertas, Setores, Serviços).
 *  - fundo: degradê da marca + ondas japonesas + brilho atrás dos mascotes
 *  - esquerda: textos (editáveis no painel)
 *  - centro: ilustração com fundo transparente, "apoiada" na base do banner
 *  - direita: frase manuscrita
 * A ilustração vem do banner cadastrado no painel; sem banner, usa os mascotes padrão.
 */
export function Hero({
  imagePath,
  imageAlt = "Mascotes do Supermercado Japão",
  left,
  script,
  rounded,
  overlap = false
}: {
  imagePath?: string | null;
  imageAlt?: string;
  left: React.ReactNode;
  script?: string;
  rounded?: boolean;
  /** true quando o conteúdo de baixo sobe por cima do banner (página inicial) */
  overlap?: boolean;
}) {
  const src = mediaUrl(imagePath) ?? "/demo/mascotes.webp";

  return (
    <section className={`hero-red relative isolate overflow-hidden text-white ${rounded ? "rounded-2xl" : ""}`}>
      {/* Decoração de fundo */}
      <div className="bg-waves absolute inset-0 -z-10 opacity-70" aria-hidden="true" />
      <div
        className="absolute bottom-0 left-1/2 -z-10 h-[120%] w-[55%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(255,255,255,0.28),rgba(255,255,255,0.08)_55%,transparent)] md:left-[52%]"
        aria-hidden="true"
      />
      <Torii className="absolute -right-4 bottom-0 -z-10 hidden h-40 w-56 text-black/10 lg:block" />
      <Clouds className="absolute -left-10 -top-6 -z-10 h-28 w-72 text-white/10" />
      <Clouds className="absolute -bottom-8 right-1/3 -z-10 hidden h-24 w-64 text-white/10 md:block" />

      <div className={`container-site relative grid items-end gap-x-4 md:grid-cols-[1.15fr_1fr_0.95fr] ${overlap ? "pt-8 md:pt-6" : "pt-6"}`}>
        <div className={`self-center ${overlap ? "pb-6 md:pb-16" : "pb-6"}`}>{left}</div>

        {/* Mascotes: no celular ficam embaixo do texto, no computador no centro */}
        <div className="relative mx-auto flex h-[170px] w-full max-w-[340px] items-end justify-center sm:h-[200px] md:h-[240px] md:max-w-none lg:h-[260px]">
          <span className="absolute bottom-0 left-1/2 h-4 w-3/4 -translate-x-1/2 rounded-[50%] bg-black/25 blur-md" aria-hidden="true" />
          <Image
            src={src}
            alt={imageAlt}
            width={1000}
            height={497}
            priority
            sizes="(max-width: 768px) 340px, 36vw"
            className="relative h-full w-auto max-w-full object-contain object-bottom drop-shadow-[0_8px_18px_rgba(0,0,0,0.25)]"
          />
        </div>

        {script ? (
          <p className={`hidden self-center text-right font-script text-[1.65rem] leading-snug drop-shadow md:block lg:text-[2rem] ${overlap ? "md:pb-12" : ""}`}>
            <span className="inline-block -rotate-[7deg]">
              <ScriptLines text={script} />
            </span>
          </p>
        ) : (
          <span className="hidden md:block" />
        )}
      </div>
    </section>
  );
}

/** Frase manuscrita: o trecho do meio fica amarelo e há um traço embaixo. */
function ScriptLines({ text }: { text: string }) {
  const words = text.split(/\s+/).filter(Boolean);
  const a = Math.ceil(words.length / 3);
  const b = Math.ceil((words.length * 2) / 3);
  return (
    <>
      {words.slice(0, a).join(" ")} <span className="text-accent">{words.slice(a, b).join(" ")}</span>
      <br className="hidden lg:block" /> {words.slice(b).join(" ")}
      <svg viewBox="0 0 220 14" className="ml-auto mt-1 block h-3.5 w-52 text-accent" aria-hidden="true">
        <path d="M3 11 C70 2 150 1 217 5" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>
    </>
  );
}

function Torii({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 160" fill="currentColor" className={className} aria-hidden="true">
      <path d="M0 18c40 10 180 10 220 0l-6 18H6L0 18zM22 48h176v12H22zM42 36h16v124H42zM162 36h16v124h-16zM102 48h16v12h-16z" />
    </svg>
  );
}

function Clouds({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 110" fill="none" stroke="currentColor" strokeWidth="5" className={className} aria-hidden="true">
      <path d="M10 80c0-18 20-26 34-18 4-22 36-30 50-10 10-18 44-16 48 8 20-6 36 8 32 24" strokeLinecap="round" />
      <path d="M120 100c4-14 22-20 34-12 8-16 34-16 40 2 14-4 28 4 28 18" strokeLinecap="round" />
      <path d="M200 40c6-16 30-20 40-6 10-10 30-6 34 8" strokeLinecap="round" />
    </svg>
  );
}
