import {
  Baby,
  Beef,
  Bus,
  CakeSlice,
  Carrot,
  Clover,
  Coffee,
  Croissant,
  Cross,
  CupSoda,
  Drumstick,
  Fish,
  Glasses,
  Ham,
  IceCreamBowl,
  KeyRound,
  LayoutGrid,
  Milk,
  Package,
  PawPrint,
  PlugZap,
  Sandwich,
  Smartphone,
  Smile,
  Snowflake,
  Sparkles,
  SprayCan,
  Store,
  Utensils,
  type LucideIcon
} from "lucide-react";

// Ícones disponíveis para categorias, serviços e cafeteria.
// O admin escolhe pelo nome (ex.: "beef").
export const ICONS: Record<string, LucideIcon> = {
  beef: Beef,
  carrot: Carrot,
  package: Package,
  "cup-soda": CupSoda,
  sparkles: Sparkles,
  "spray-can": SprayCan,
  baby: Baby,
  "paw-print": PawPrint,
  croissant: Croissant,
  drumstick: Drumstick,
  milk: Milk,
  ham: Ham,
  fish: Fish,
  snowflake: Snowflake,
  utensils: Utensils,
  coffee: Coffee,
  clover: Clover,
  "key-round": KeyRound,
  smartphone: Smartphone,
  glasses: Glasses,
  smile: Smile,
  cross: Cross,
  bus: Bus,
  "plug-zap": PlugZap,
  sandwich: Sandwich,
  "cake-slice": CakeSlice,
  "ice-cream-bowl": IceCreamBowl,
  store: Store,
  grid: LayoutGrid
};

export const ICON_OPTIONS = Object.keys(ICONS);

export function Icon({ name, className }: { name: string | null | undefined; className?: string }) {
  const Cmp = (name && ICONS[name]) || LayoutGrid;
  return <Cmp className={className} aria-hidden="true" />;
}
