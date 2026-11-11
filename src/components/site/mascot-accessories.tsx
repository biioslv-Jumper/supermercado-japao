// Acessórios desenhados por cima dos mascotes padrão (/demo/mascotes.webp),
// conforme o tema ativo. As coordenadas seguem a imagem (1000 × 497):
// menino com a cabeça centralizada em x≈285, menina em x≈665.

export const ACCESSORIES = [
  { value: "santa", label: "Gorro de Papai Noel (Natal)" },
  { value: "witch", label: "Chapéu de bruxa (Halloween)" },
  { value: "bunny", label: "Orelhas de coelho (Páscoa)" },
  { value: "football", label: "Pintura verde e amarela + bola e bandeira (Copa)" },
  { value: "party", label: "Chapéu de festa colorido (Aniversário)" },
  { value: "party-gold", label: "Chapéu de festa dourado (Ano Novo)" },
  { value: "sunglasses", label: "Óculos escuros (Black Friday)" },
  { value: "ribbon-blue", label: "Laço azul no peito (Novembro Azul)" },
  { value: "ribbon-pink", label: "Laço rosa no peito (Outubro Rosa)" },
  { value: "straw", label: "Chapéu de palha e sardas (Festa Junina)" }
];

export function MascotAccessory({ kind }: { kind?: string | null }) {
  if (!kind) return null;
  const content = DRAW[kind];
  if (!content) return null;
  return (
    <svg
      viewBox="0 0 1000 497"
      preserveAspectRatio="xMidYMax meet"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      aria-hidden="true"
    >
      {content}
    </svg>
  );
}

const SantaHat = ({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) => (
  <g transform={`translate(${x} ${y}) ${flip ? "scale(-1 1)" : ""}`}>
    <path d="M-138 6 C-128 -120 20 -190 150 -170 C215 -160 240 -110 236 -40 C205 -95 175 -110 150 -100 C150 -60 145 -25 138 -2 Z" fill="#D7141A" />
    <path d="M-70 -90 C-10 -150 80 -170 150 -160" stroke="#A50E13" strokeWidth="12" fill="none" opacity="0.45" strokeLinecap="round" />
    <circle cx="236" cy="-34" r="30" fill="#fff" />
    <path d="M-150 10 C-150 -28 150 -40 150 -6 C150 24 -150 40 -150 10 Z" fill="#fff" />
    <path d="M-140 18 C-60 30 60 22 140 6" stroke="#E2E8F0" strokeWidth="8" fill="none" strokeLinecap="round" />
  </g>
);

const WitchHat = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx="0" cy="10" rx="172" ry="32" fill="#2A1840" />
    <path d="M-115 8 C-90 -80 -40 -160 40 -200 C70 -215 95 -190 70 -175 C30 -150 60 -60 115 5 Z" fill="#3A2159" />
    <path d="M-112 -6 C-40 -22 60 -22 112 -8 L115 5 C50 -8 -50 -8 -115 8 Z" fill="#8E44AD" />
    <rect x="-22" y="-26" width="40" height="30" rx="4" fill="#F5C542" />
    <rect x="-12" y="-18" width="20" height="14" rx="2" fill="#8E44AD" />
  </g>
);

const BunnyEars = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <g transform="rotate(-14)">
      <ellipse cx="-60" cy="-95" rx="36" ry="105" fill="#fff" stroke="#E8DCE6" strokeWidth="4" />
      <ellipse cx="-60" cy="-90" rx="18" ry="78" fill="#F7B6CF" />
    </g>
    <g transform="rotate(12)">
      <ellipse cx="62" cy="-100" rx="36" ry="105" fill="#fff" stroke="#E8DCE6" strokeWidth="4" />
      <ellipse cx="62" cy="-95" rx="18" ry="78" fill="#F7B6CF" />
    </g>
    <path d="M-150 20 C-80 -30 80 -30 150 20" stroke="#F7B6CF" strokeWidth="16" fill="none" strokeLinecap="round" />
  </g>
);

const PartyHat = ({ x, y, gold = false, rotate = 0 }: { x: number; y: number; gold?: boolean; rotate?: number }) => {
  const c1 = gold ? "#E9C46A" : "#FFD200";
  const c2 = gold ? "#1F3A93" : "#E30613";
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <path d="M-70 0 L0 -170 L70 0 Z" fill={c1} />
      <path d="M-49 -50 L-35 -85 L35 -85 L49 -50 Z" fill={c2} />
      <path d="M-20 -120 L-12 -140 L12 -140 L20 -120 Z" fill={c2} />
      <path d="M-70 0 L-63 -16 L63 -16 L70 0 Z" fill={c2} />
      <circle cx="0" cy="-172" r="18" fill={gold ? "#fff" : "#2A9D8F"} />
      {gold && <path d="M-40 -30 l6 6 m-6 0 l6 -6 M30 -110 l6 6 m-6 0 l6 -6" stroke="#fff" strokeWidth="3" />}
    </g>
  );
};

const Shades = ({ l, r, w = 120, h = 74 }: { l: [number, number]; r: [number, number]; w?: number; h?: number }) => (
  <g>
    <path d={`M${l[0] + w / 2} ${l[1] - 6} Q${(l[0] + r[0]) / 2} ${l[1] - 22} ${r[0] - w / 2} ${r[1] - 6}`} stroke="#111" strokeWidth="9" fill="none" />
    {[l, r].map(([cx, cy], i) => (
      <g key={i}>
        <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx="26" fill="#111" />
        <path d={`M${cx - w / 2 + 16} ${cy - h / 2 + 18} l28 -8`} stroke="#fff" strokeWidth="7" strokeLinecap="round" opacity="0.7" />
      </g>
    ))}
  </g>
);

const Stripes = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y}) rotate(-12)`} opacity="0.9">
    <rect x="-28" y="-14" width="56" height="10" rx="5" fill="#009C3B" />
    <rect x="-28" y="2" width="56" height="10" rx="5" fill="#FFDF00" />
  </g>
);

const Ribbon = ({ x, y, color }: { x: number; y: number; color: string }) => (
  <g transform={`translate(${x} ${y}) scale(1.1)`}>
    <path d="M0 -42 C-30 -42 -30 -2 0 18 L-26 52 L-12 56 L0 30 L12 56 L26 52 L0 18 C30 -2 30 -42 0 -42 Z" fill={color} stroke="#fff" strokeWidth="5" strokeLinejoin="round" />
    <path d="M0 -28 C-14 -28 -14 -6 0 6 C14 -6 14 -28 0 -28 Z" fill="#fff" opacity="0.55" />
  </g>
);

const StrawHat = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx="0" cy="8" rx="172" ry="32" fill="#E2B866" stroke="#B88A3A" strokeWidth="5" />
    <path d="M-110 6 C-105 -95 105 -95 110 6 Z" fill="#EBC77F" stroke="#B88A3A" strokeWidth="5" />
    <path d="M-108 -14 C-40 -30 40 -30 108 -14" stroke="#C0392B" strokeWidth="14" fill="none" />
    <rect x="40" y="-62" width="34" height="30" fill="#2A9D8F" transform="rotate(12 57 -47)" />
    <rect x="-80" y="-50" width="28" height="26" fill="#E63946" transform="rotate(-10 -66 -37)" />
    <path d="M-150 18 l-14 16 M-100 32 l-8 18 M140 20 l14 14 M95 34 l6 18" stroke="#B88A3A" strokeWidth="5" strokeLinecap="round" />
  </g>
);

const Freckles = ({ x, y }: { x: number; y: number }) => (
  <g fill="#8B4A2B" opacity="0.75">
    <circle cx={x} cy={y} r="5" />
    <circle cx={x + 14} cy={y + 8} r="4" />
    <circle cx={x - 12} cy={y + 10} r="4" />
    <circle cx={x + 2} cy={y + 18} r="4" />
  </g>
);

const DRAW: Record<string, React.ReactNode> = {
  santa: (
    <>
      <SantaHat x={285} y={112} />
      <SantaHat x={665} y={128} />
    </>
  ),
  witch: (
    <>
      <WitchHat x={285} y={100} />
      <WitchHat x={665} y={112} />
    </>
  ),
  bunny: (
    <>
      <BunnyEars x={285} y={70} />
      <BunnyEars x={668} y={60} />
    </>
  ),
  party: (
    <>
      <PartyHat x={310} y={40} rotate={10} />
      <PartyHat x={672} y={14} rotate={-8} />
    </>
  ),
  "party-gold": (
    <>
      <PartyHat x={310} y={40} rotate={10} gold />
      <PartyHat x={672} y={14} rotate={-8} gold />
    </>
  ),
  sunglasses: (
    <>
      <Shades l={[240, 258]} r={[380, 258]} />
      <Shades l={[592, 288]} r={[738, 288]} w={124} h={76} />
    </>
  ),
  football: (
    <>
      <Stripes x={205} y={312} />
      <Stripes x={418} y={308} />
      <Stripes x={560} y={338} />
      <Stripes x={778} y={332} />
      <g transform="translate(935 240)">
        <rect x="-4" y="-10" width="8" height="120" fill="#7a5230" />
        <rect x="4" y="-10" width="96" height="66" fill="#009C3B" />
        <path d="M52 -2 L94 23 L52 48 L10 23 Z" fill="#FFDF00" />
        <circle cx="52" cy="23" r="14" fill="#002776" />
      </g>
      <g transform="translate(470 452)">
        <circle r="42" fill="#fff" stroke="#111" strokeWidth="4" />
        <path d="M0 -14 L13 -4 L8 12 L-8 12 L-13 -4 Z" fill="#111" />
        <path d="M0 -14 L0 -40 M13 -4 L38 -12 M8 12 L22 34 M-8 12 L-22 34 M-13 -4 L-38 -12" stroke="#111" strokeWidth="4" />
      </g>
    </>
  ),
  "ribbon-blue": (
    <>
      <Ribbon x={300} y={420} color="#1565C0" />
      <Ribbon x={665} y={432} color="#1565C0" />
    </>
  ),
  "ribbon-pink": (
    <>
      <Ribbon x={300} y={420} color="#D63384" />
      <Ribbon x={665} y={432} color="#D63384" />
    </>
  ),
  straw: (
    <>
      <StrawHat x={285} y={100} />
      <StrawHat x={665} y={112} />
      <Freckles x={215} y={300} />
      <Freckles x={402} y={296} />
      <Freckles x={566} y={326} />
      <Freckles x={764} y={320} />
    </>
  )
};
