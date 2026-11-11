// Tipos das tabelas usadas pelo site.

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image_path: string | null;
  show_in_sectors: boolean;
  link_url: string | null;
  sort_order: number;
  is_active: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  unit_label: string | null;
  description: string | null;
  category_id: string | null;
  price: number;
  promo_price: number | null;
  image_path: string | null;
  is_active: boolean;
  is_offer: boolean;
  is_featured: boolean;
  is_new: boolean;
  sort_order: number;
  categories?: Pick<Category, "name" | "slug"> | null;
};

export type Offer = {
  id: string;
  product_id: string;
  title: string | null;
  description: string | null;
  promo_price: number;
  badge_label: string | null;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  sort_order: number;
  products: Product | null;
};

export type Highlight = {
  id: string;
  product_id: string | null;
  title: string;
  description: string | null;
  image_path: string | null;
  starts_at: string | null;
  ends_at: string | null;
  products: Product | null;
};

export type NewsItem = {
  id: string;
  product_id: string | null;
  title: string;
  description: string | null;
  image_path: string | null;
  link_url: string | null;
  sort_order: number;
  products: Product | null;
};

export type BannerPlacement =
  | "home_hero"
  | "home_carousel"
  | "strip"
  | "offers_header"
  | "sectors_header"
  | "services_header"
  | "cafe_header";

export type Banner = {
  id: string;
  placement: BannerPlacement;
  image_path: string | null;
  title: string | null;
  description: string | null;
  button_text: string | null;
  link_url: string | null;
  sort_order: number;
  theme_id: string | null;
};

export type Service = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  image_path: string | null;
  link_url: string | null;
  sort_order: number;
};

export type CafeCategory = { id: string; name: string; slug: string; icon: string | null; sort_order: number };

export type CafeItem = {
  id: string;
  cafe_category_id: string | null;
  name: string;
  description: string | null;
  price: number | null;
  image_path: string | null;
  images_url: string | null;
  sort_order: number;
};

export type SiteSettings = {
  store_name: string;
  logo_path: string | null;
  favicon_path: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  address: string | null;
  address_city: string | null;
  maps_url: string | null;
  store_photo_path: string | null;
  opening_hours: string | null;
};

export type ThemeColors = {
  primary?: string;
  primaryDark?: string;
  accent?: string;
  accentInk?: string;
  footer?: string;
};

export type Theme = {
  id: string;
  slug: string;
  name: string;
  is_default: boolean;
  colors: ThemeColors;
  decorations: { emoji?: string; ribbon?: string; accessory?: string; effect?: string; garland?: string; hero?: string };
  texts: Record<string, string>;
};
