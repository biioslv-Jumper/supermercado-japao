// Acessórios desenhados por cima dos mascotes padrão (/demo/mascotes.webp),
// conforme o tema ativo. As coordenadas seguem a imagem (1000 × 497):
// menino com a cabeça centralizada em x≈285, menina em x≈665.
//
// Os desenhos usam gradientes e sombras suaves para acompanhar o acabamento
// 3D/glossy dos mascotes, em vez de formas chapadas tipo adesivo.

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

const DEFS = (
  <defs>
    <linearGradient id="sj-santaRed" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stopColor="#F23B3B" />
      <stop offset="0.55" stopColor="#D7141A" />
      <stop offset="1" stopColor="#9E0E12" />
    </linearGradient>
    <linearGradient id="sj-fur" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#ffffff" />
      <stop offset="1" stopColor="#E7E9EC" />
    </linearGradient>
    <radialGradient id="sj-pompom" cx="0.35" cy="0.3" r="0.8">
      <stop offset="0" stopColor="#ffffff" />
      <stop offset="1" stopColor="#DCE0E5" />
    </radialGradient>
    <linearGradient id="sj-witchPurple" x1="0" y1="0" x2="0.5" y2="1">
      <stop offset="0" stopColor="#5A3480" />
      <stop offset="0.6" stopColor="#3A2159" />
      <stop offset="1" stopColor="#211034" />
    </linearGradient>
    <linearGradient id="sj-witchBrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#4a2c6e" />
      <stop offset="1" stopColor="#1c0e2e" />
    </linearGradient>
    <linearGradient id="sj-gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FDE68A" />
      <stop offset="0.5" stopColor="#F0B429" />
      <stop offset="1" stopColor="#B9790A" />
    </linearGradient>
    <radialGradient id="sj-bunnyOuter" cx="0.4" cy="0.25" r="0.9">
      <stop offset="0" stopColor="#ffffff" />
      <stop offset="1" stopColor="#EAD9E3" />
    </radialGradient>
    <linearGradient id="sj-bunnyInner" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FBC9DC" />
      <stop offset="1" stopColor="#F093B8" />
    </linearGradient>
    <linearGradient id="sj-partyYellow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FFE985" />
      <stop offset="1" stopColor="#FFC400" />
    </linearGradient>
    <linearGradient id="sj-partyRed" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FF5C5C" />
      <stop offset="1" stopColor="#D5102A" />
    </linearGradient>
    <linearGradient id="sj-partyGoldCone" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#F6DE9A" />
      <stop offset="1" stopColor="#C79A3C" />
    </linearGradient>
    <linearGradient id="sj-partyNavy" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#2F4C9E" />
      <stop offset="1" stopColor="#16244E" />
    </linearGradient>
    <linearGradient id="sj-lens" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0" stopColor="#3a3f47" />
      <stop offset="0.5" stopColor="#15171b" />
      <stop offset="1" stopColor="#000000" />
    </linearGradient>
    <linearGradient id="sj-straw" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#F3D694" />
      <stop offset="1" stopColor="#D9AD5C" />
    </linearGradient>
    <linearGradient id="sj-strawBrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#EFCB83" />
      <stop offset="1" stopColor="#C79646" />
    </linearGradient>
    <linearGradient id="sj-green" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#29C36B" />
      <stop offset="1" stopColor="#008A3A" />
    </linearGradient>
    <linearGradient id="sj-yellowStripe" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FFEB6B" />
      <stop offset="1" stopColor="#FFC400" />
    </linearGradient>
    <linearGradient id="sj-ribbonSheen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
      <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
    </linearGradient>
    <radialGradient id="sj-ballShine" cx="0.32" cy="0.28" r="0.8">
      <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
      <stop offset="0.4" stopColor="#ffffff" stopOpacity="0" />
    </radialGradient>
    <filter id="sj-softShadow" x="-60%" y="-60%" width="220%" height="220%">
      <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#000" floodOpacity="0.28" />
    </filter>
    <filter id="sj-tinyShadow" x="-60%" y="-60%" width="220%" height="220%">
      <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.25" />
    </filter>
  </defs>
);

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
      {DEFS}
      {content}
    </svg>
  );
}

const SantaHat = ({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) => (
  <g transform={`translate(${x} ${y}) ${flip ? "scale(-1 1)" : ""}`} filter="url(#sj-softShadow)">
    <path
      d="M-132 14 C-140 -70 -90 -150 0 -182 C100 -216 210 -192 238 -118 C250 -84 246 -52 230 -30
         C214 -58 190 -78 158 -86 C168 -48 162 -14 146 6 Z"
      fill="url(#sj-santaRed)"
    />
    <path d="M-20 -150 C40 -175 110 -175 160 -150" stroke="#ffffff" strokeWidth="5" fill="none" opacity="0.35" strokeLinecap="round" />
    <path d="M90 -130 C140 -120 175 -95 192 -60" stroke="#6b0d10" strokeWidth="10" fill="none" opacity="0.4" strokeLinecap="round" />
    <circle cx="234" cy="-112" r="34" fill="url(#sj-pompom)" />
    <circle cx="224" cy="-122" r="10" fill="#ffffff" opacity="0.7" />
    <path d="M-150 18 C-150 -22 150 -34 150 2 C150 34 -150 52 -150 18 Z" fill="url(#sj-fur)" />
    <path d="M-150 18 C-150 34 150 50 150 18" stroke="#C9CDD2" strokeWidth="3" fill="none" opacity="0.6" />
    <path d="M-138 26 C-60 38 60 32 138 14" stroke="#ffffff" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.9" />
  </g>
);

const WitchHat = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx="0" cy="14" rx="178" ry="26" fill="url(#sj-witchBrim)" filter="url(#sj-tinyShadow)" />
    <ellipse cx="0" cy="10" rx="178" ry="26" fill="url(#sj-witchBrim)" />
    <path
      d="M-108 6 C-96 -90 -46 -175 24 -214 C54 -231 84 -210 66 -186 C26 -138 46 -56 104 -2 Z"
      fill="url(#sj-witchPurple)"
      filter="url(#sj-tinyShadow)"
    />
    <path d="M-30 -170 C-6 -186 24 -188 46 -176" stroke="#8a5fc2" strokeWidth="5" fill="none" opacity="0.5" strokeLinecap="round" />
    <path d="M-104 -4 C-40 -20 50 -20 100 -4 L104 4 C44 -10 -46 -10 -108 6 Z" fill="#6c3f9e" opacity="0.65" />
    <g transform="translate(0 -8)">
      <rect x="-26" y="-22" width="52" height="30" rx="4" fill="url(#sj-gold)" stroke="#8a5a0a" strokeWidth="2" />
      <rect x="-13" y="-15" width="26" height="16" rx="2" fill="#2a1840" />
    </g>
  </g>
);

const BunnyEars = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`} filter="url(#sj-tinyShadow)">
    <g transform="rotate(-13)">
      <ellipse cx="-58" cy="-98" rx="34" ry="108" fill="url(#sj-bunnyOuter)" stroke="#E8DCE6" strokeWidth="3" />
      <ellipse cx="-58" cy="-92" rx="16" ry="78" fill="url(#sj-bunnyInner)" />
      <ellipse cx="-68" cy="-150" rx="10" ry="22" fill="#ffffff" opacity="0.55" />
    </g>
    <g transform="rotate(12)">
      <ellipse cx="60" cy="-103" rx="34" ry="108" fill="url(#sj-bunnyOuter)" stroke="#E8DCE6" strokeWidth="3" />
      <ellipse cx="60" cy="-97" rx="16" ry="78" fill="url(#sj-bunnyInner)" />
      <ellipse cx="50" cy="-156" rx="10" ry="22" fill="#ffffff" opacity="0.55" />
    </g>
    <path d="M-150 22 C-80 -26 80 -26 150 22" stroke="url(#sj-bunnyInner)" strokeWidth="18" fill="none" strokeLinecap="round" />
    <path
      d="M-150 22 C-80 -26 80 -26 150 22"
      stroke="#ffffff"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
      opacity="0.5"
      transform="translate(0,-4)"
    />
  </g>
);

const PartyHat = ({ x, y, gold = false, rotate = 0 }: { x: number; y: number; gold?: boolean; rotate?: number }) => {
  const cone = gold ? "url(#sj-partyGoldCone)" : "url(#sj-partyYellow)";
  const band = gold ? "url(#sj-partyNavy)" : "url(#sj-partyRed)";
  const tip = gold ? "#ffffff" : "#2A9D8F";
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} filter="url(#sj-tinyShadow)">
      <path d="M-68 2 L0 -172 L68 2 Z" fill={cone} />
      <path d="M-20 -130 L0 -172 L20 -130 Z" fill="#ffffff" opacity="0.25" />
      <path d="M-48 -48 L-34 -84 L34 -84 L48 -48 Z" fill={band} />
      <path d="M-20 -118 L-12 -138 L12 -138 L20 -118 Z" fill={band} />
      <path d="M-68 2 L-61 -16 L61 -16 L68 2 Z" fill={band} />
      <circle cx="0" cy="-174" r="17" fill={tip} />
      <circle cx="-5" cy="-179" r="6" fill="#ffffff" opacity="0.6" />
      {gold && (
        <path
          d="M-40 -30 l6 6 m-6 0 l6 -6 M30 -108 l6 6 m-6 0 l6 -6 M-50 -60 l5 5 m-5 0 l5 -5"
          stroke="#fff"
          strokeWidth="3"
        />
      )}
    </g>
  );
};

const Shades = ({ l, r, w = 126, h = 78 }: { l: [number, number]; r: [number, number]; w?: number; h?: number }) => (
  <g filter="url(#sj-tinyShadow)">
    <path
      d={`M${l[0] + w / 2} ${l[1] - 8} Q${(l[0] + r[0]) / 2} ${l[1] - 26} ${r[0] - w / 2} ${r[1] - 8}`}
      stroke="#1c1e22"
      strokeWidth="10"
      fill="none"
      strokeLinecap="round"
    />
    {[l, r].map(([cx, cy], i) => (
      <g key={i}>
        <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={h * 0.36} fill="url(#sj-lens)" />
        <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={h * 0.36} fill="none" stroke="#000" strokeWidth="3" opacity="0.4" />
        <path
          d={`M${cx - w / 2 + 18} ${cy - h / 2 + 20} q${w * 0.3} -14 ${w * 0.46} -4`}
          stroke="#fff"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.55"
          fill="none"
        />
      </g>
    ))}
  </g>
);

const Stripes = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y}) rotate(-12)`}>
    <rect x="-30" y="-16" width="60" height="11" rx="5.5" fill="url(#sj-green)" />
    <rect x="-30" y="1" width="60" height="11" rx="5.5" fill="url(#sj-yellowStripe)" />
    <rect x="-30" y="-16" width="60" height="4" rx="2" fill="#ffffff" opacity="0.3" />
  </g>
);

const Ribbon = ({ x, y, color, dark }: { x: number; y: number; color: string; dark: string }) => (
  <g transform={`translate(${x} ${y}) scale(1.12)`} filter="url(#sj-tinyShadow)">
    <path
      d="M0 -44 C-32 -44 -32 -2 0 20 L-28 56 L-13 60 L0 32 L13 60 L28 56 L0 20 C32 -2 32 -44 0 -44 Z"
      fill={color}
      stroke="#fff"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <path
      d="M0 -44 C-32 -44 -32 -2 0 20 L-28 56 L-13 60 L0 32 L13 60 L28 56 L0 20 C32 -2 32 -44 0 -44 Z"
      fill="url(#sj-ribbonSheen)"
    />
    <path d="M0 -30 C-16 -30 -16 -6 0 8 C16 -6 16 -30 0 -30 Z" fill={dark} />
  </g>
);

const StrawHat = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`} filter="url(#sj-softShadow)">
    <ellipse cx="0" cy="12" rx="178" ry="30" fill="url(#sj-strawBrim)" stroke="#B88A3A" strokeWidth="3" />
    <path d="M-170 12 C-150 20 150 20 170 12" stroke="#B88A3A" strokeWidth="2" fill="none" opacity="0.5" />
    <path d="M-112 8 C-108 -92 108 -92 112 8 Z" fill="url(#sj-straw)" stroke="#B88A3A" strokeWidth="4" />
    <path d="M-96 -2 C-50 -18 50 -18 96 -2" stroke="#c99a4e" strokeWidth="2" fill="none" opacity="0.6" />
    <path d="M-76 -40 C-36 -54 36 -54 76 -40" stroke="#c99a4e" strokeWidth="2" fill="none" opacity="0.5" />
    <path d="M-108 -14 C-40 -30 40 -30 108 -14" stroke="#C0392B" strokeWidth="15" fill="none" />
    <path d="M-108 -17 C-40 -33 40 -33 108 -17" stroke="#E0564A" strokeWidth="3" fill="none" opacity="0.6" />
    <g transform="translate(58 -40) rotate(12)">
      <rect x="-17" y="-16" width="34" height="30" rx="4" fill="#2A9D8F" />
      <circle cx="0" cy="-16" r="8" fill="#F4D35E" />
    </g>
    <g transform="translate(-66 -32) rotate(-10)">
      <rect x="-14" y="-15" width="28" height="26" rx="4" fill="#E63946" />
      <circle cx="0" cy="-15" r="7" fill="#F4D35E" />
    </g>
    <path d="M-150 20 l-15 17 M-100 34 l-8 19 M140 22 l15 15 M95 36 l6 19" stroke="#B88A3A" strokeWidth="5" strokeLinecap="round" />
  </g>
);

const Freckles = ({ x, y }: { x: number; y: number }) => (
  <g fill="#8B4A2B" opacity="0.7">
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
      <SantaHat x={665} y={128} flip />
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
      <g transform="translate(935 232)" filter="url(#sj-tinyShadow)">
        <rect x="-5" y="-14" width="10" height="130" rx="4" fill="#7a5230" />
        <path d="M5 -14 L101 2 L101 62 L5 48 Z" fill="url(#sj-green)" />
        <path d="M53 0 L97 24 L53 48 L9 24 Z" fill="url(#sj-yellowStripe)" />
        <circle cx="53" cy="24" r="15" fill="#002776" />
        <circle cx="48" cy="19" r="5" fill="#ffffff" opacity="0.5" />
      </g>
      <g transform="translate(468 450)" filter="url(#sj-tinyShadow)">
        <circle r="44" fill="#fdfdfd" stroke="#111" strokeWidth="4" />
        <circle r="44" fill="url(#sj-ballShine)" />
        <path d="M0 -15 L14 -5 L9 13 L-9 13 L-14 -5 Z" fill="#161616" />
        <path d="M0 -15 L0 -42 M14 -5 L40 -13 M9 13 L24 36 M-9 13 L-24 36 M-14 -5 L-40 -13" stroke="#161616" strokeWidth="4" />
      </g>
    </>
  ),
  "ribbon-blue": (
    <>
      <Ribbon x={300} y={420} color="#1565C0" dark="#0D47A1" />
      <Ribbon x={665} y={432} color="#1565C0" dark="#0D47A1" />
    </>
  ),
  "ribbon-pink": (
    <>
      <Ribbon x={300} y={420} color="#D63384" dark="#AD1457" />
      <Ribbon x={665} y={432} color="#D63384" dark="#AD1457" />
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
