// Detalhes visuais dos temas: partículas caindo e varal/luzes abaixo do menu.
// Tudo é decorativo (aria-hidden), não bloqueia cliques e some para quem
// ativou "reduzir movimento" no aparelho.

export const EFFECTS = [
  { value: "snow", label: "Neve caindo" },
  { value: "confetti", label: "Confete colorido" },
  { value: "confetti-gold", label: "Confete dourado" },
  { value: "confetti-brasil", label: "Confete verde e amarelo" },
  { value: "emoji", label: "Enfeites do tema caindo (usa os emojis do campo Enfeites do banner)" }
];

export const GARLANDS = [
  { value: "lights", label: "Pisca-pisca de Natal" },
  { value: "bunting-junina", label: "Bandeirinhas de Festa Junina" },
  { value: "bunting-brasil", label: "Bandeirinhas verde e amarelas" },
  { value: "bunting-festa", label: "Bandeirinhas de festa (cores da marca)" },
  { value: "bunting-rosa", label: "Bandeirinhas rosa" },
  { value: "bunting-azul", label: "Bandeirinhas azuis" }
];

const PALETTES: Record<string, string[]> = {
  confetti: ["#E30613", "#FFD200", "#2A9D8F", "#3A86FF", "#FF006E", "#8338EC"],
  "confetti-gold": ["#E9C46A", "#F4D58D", "#FFFFFF", "#C9A227"],
  "confetti-brasil": ["#009C3B", "#FFDF00", "#002776", "#FFFFFF"],
  "bunting-junina": ["#E63946", "#F4A261", "#2A9D8F", "#E9C46A", "#3A86FF", "#8338EC"],
  "bunting-brasil": ["#009C3B", "#FFDF00", "#002776"],
  "bunting-festa": ["#E30613", "#FFD200", "#FFFFFF"],
  "bunting-rosa": ["#D63384", "#FFC2DC", "#FFFFFF"],
  "bunting-azul": ["#1565C0", "#90CAF9", "#FFFFFF"]
};

/** Separa emojis corretamente (inclusive bandeiras como 🇧🇷). */
function splitEmojis(text?: string | null): string[] {
  if (!text) return [];
  const seg = new Intl.Segmenter("pt-BR", { granularity: "grapheme" });
  return Array.from(seg.segment(text), (x) => x.segment).filter((c) => c.trim());
}

// Números "aleatórios" fixos (iguais no servidor e no navegador)
const rnd = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export function FallingEffect({ effect, emojis }: { effect?: string | null; emojis?: string | null }) {
  if (!effect) return null;
  const emojiList = splitEmojis(emojis);
  if (effect === "emoji" && !emojiList.length) return null;
  const palette = PALETTES[effect] ?? PALETTES.confetti;
  const count = effect === "snow" ? 26 : 18;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden motion-reduce:hidden" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const left = rnd(i, 1) * 100;
        const duration = 9 + rnd(i, 2) * 10;
        const delay = -rnd(i, 3) * duration;
        const drift = (rnd(i, 4) - 0.5) * 120;
        const size = effect === "snow" ? 4 + rnd(i, 5) * 6 : effect === "emoji" ? 16 + rnd(i, 5) * 12 : 6 + rnd(i, 5) * 6;
        const style = {
          left: `${left}%`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          ["--drift" as string]: `${drift}px`,
          opacity: effect === "emoji" ? 0.75 : 0.85
        } as React.CSSProperties;

        if (effect === "snow")
          return <span key={i} className="sj-particle rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" style={{ ...style, width: size, height: size }} />;
        if (effect === "emoji")
          return (
            <span key={i} className="sj-particle select-none" style={{ ...style, fontSize: size }}>
              {emojiList[i % emojiList.length]}
            </span>
          );
        return (
          <span
            key={i}
            className="sj-particle rounded-[2px]"
            style={{ ...style, width: size, height: size * 0.45, background: palette[i % palette.length] }}
          />
        );
      })}
    </div>
  );
}

export function Garland({ kind }: { kind?: string | null }) {
  if (!kind) return null;
  if (kind === "lights") {
    const colors = ["#FF3B30", "#FFD60A", "#34C759", "#0A84FF", "#FF9F0A"];
    return (
      <div className="relative h-7 overflow-hidden bg-brand-dark" aria-hidden="true">
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 1200 28">
          <path d={wire(1200, 40)} stroke="#1f2937" strokeWidth="2" fill="none" />
        </svg>
        <div className="absolute inset-x-0 top-0 flex justify-around">
          {Array.from({ length: 30 }, (_, i) => (
            <span
              key={i}
              className="sj-twinkle mt-2 block h-3.5 w-2.5 rounded-b-full"
              style={{ background: colors[i % colors.length], boxShadow: `0 0 8px ${colors[i % colors.length]}`, animationDelay: `${(i % 5) * 0.4}s`, marginTop: i % 2 ? 10 : 6 }}
            />
          ))}
        </div>
      </div>
    );
  }
  const palette = PALETTES[kind] ?? PALETTES["bunting-festa"];
  return (
    <div className="relative h-8 overflow-hidden bg-brand-dark" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 32" preserveAspectRatio="none">
        <path d="M0 2 Q 300 10 600 2 T 1200 2" stroke="#fff" strokeOpacity="0.6" strokeWidth="1.5" fill="none" />
        {Array.from({ length: 48 }, (_, i) => {
          const x = i * 25;
          const y = 2 + Math.abs(Math.sin((x / 600) * Math.PI)) * 6;
          return <path key={i} d={`M${x + 2} ${y} L${x + 23} ${y} L${x + 12.5} ${y + 20} Z`} fill={palette[i % palette.length]} />;
        })}
      </svg>
    </div>
  );
}

function wire(w: number, step: number) {
  let d = "M0 4";
  for (let x = 0; x < w; x += step) d += ` Q${x + step / 2} 14 ${x + step} 4`;
  return d;
}

/** Enfeites espalhados no banner vermelho do topo. */
export function HeroOrnaments({ emojis }: { emojis?: string | null }) {
  const list = splitEmojis(emojis);
  if (!list.length) return null;
  // Posições nas faixas de cima e de baixo, longe dos textos
  const spots = [
    { left: "2%", top: "6%", size: 30, rot: -12 },
    { left: "27%", top: "8%", size: 24, rot: 10 },
    { left: "74%", top: "7%", size: 30, rot: -6 },
    { left: "95%", top: "9%", size: 34, rot: 14 },
    { left: "30%", top: "84%", size: 24, rot: 8 },
    { left: "74%", top: "85%", size: 26, rot: -10 },
    { left: "95%", top: "80%", size: 22, rot: 4 }
  ];

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 hidden md:block" aria-hidden="true">
      {spots.map((s, i) => (
        <span
          key={i}
          className="sj-float absolute select-none opacity-80 drop-shadow"
          style={{ left: s.left, top: s.top, fontSize: s.size, transform: `rotate(${s.rot}deg)`, animationDelay: `${i * 0.6}s` }}
        >
          {list[i % list.length]}
        </span>
      ))}
    </div>
  );
}
