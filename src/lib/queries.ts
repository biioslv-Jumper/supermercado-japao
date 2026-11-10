import "server-only";
import { createClient } from "@/lib/supabase/server";
import type {
  Banner,
  BannerPlacement,
  CafeCategory,
  CafeItem,
  Category,
  Highlight,
  NewsItem,
  Offer,
  Product,
  Service
} from "@/lib/types";

// Todas as consultas usam o cliente com RLS: o público só recebe
// registros ativos/vigentes (as regras estão no banco).

const PRODUCT_FIELDS =
  "id, name, slug, unit_label, description, category_id, price, promo_price, image_path, is_active, is_offer, is_featured, is_new, sort_order, categories(name, slug)";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").eq("is_active", true).order("sort_order");
  return (data as Category[]) ?? [];
}

export async function getBanners(placement: BannerPlacement, themeId?: string): Promise<Banner[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("banners")
    .select("*")
    .eq("placement", placement)
    .eq("is_active", true)
    .order("sort_order");
  const all = (data as Banner[]) ?? [];
  // Banners de um tema aparecem só quando aquele tema está ativo (e têm prioridade)
  const themed = themeId ? all.filter((b) => b.theme_id === themeId) : [];
  return themed.length ? themed : all.filter((b) => !b.theme_id);
}

export async function getOffers(opts: { categorySlug?: string; limit?: number; sort?: string } = {}): Promise<Offer[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("offers")
    .select(`*, products!inner(${PRODUCT_FIELDS})`)
    .eq("is_active", true)
    .eq("products.is_active", true)
    .order("sort_order")
    .order("created_at", { ascending: false });
  let rows = ((data as Offer[]) ?? []).filter((o) => o.products);
  // Uma oferta por produto
  const seen = new Set<string>();
  rows = rows.filter((o) => (seen.has(o.product_id) ? false : (seen.add(o.product_id), true)));
  if (opts.categorySlug) rows = rows.filter((o) => o.products?.categories?.slug === opts.categorySlug);
  rows = sortOffers(rows, opts.sort);
  return opts.limit ? rows.slice(0, opts.limit) : rows;
}

function sortOffers(rows: Offer[], sort?: string) {
  const copy = [...rows];
  switch (sort) {
    case "menor-preco":
      return copy.sort((a, b) => a.promo_price - b.promo_price);
    case "maior-preco":
      return copy.sort((a, b) => b.promo_price - a.promo_price);
    case "maior-desconto": {
      const d = (o: Offer) => (o.products ? (o.products.price - o.promo_price) / o.products.price : 0);
      return copy.sort((a, b) => d(b) - d(a));
    }
    case "nome":
      return copy.sort((a, b) => (a.products?.name ?? "").localeCompare(b.products?.name ?? "", "pt-BR"));
    default:
      return copy;
  }
}

export async function getProducts(opts: { categorySlug?: string; q?: string; sort?: string } = {}): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase.from("products").select(PRODUCT_FIELDS).eq("is_active", true);
  if (opts.q) query = query.ilike("name", `%${opts.q.replace(/[%_,()]/g, " ")}%`);
  switch (opts.sort) {
    case "menor-preco":
      query = query.order("price", { ascending: true });
      break;
    case "maior-preco":
      query = query.order("price", { ascending: false });
      break;
    case "nome":
      query = query.order("name");
      break;
    default:
      query = query.order("sort_order").order("name");
  }
  const { data } = await query;
  let rows = (data as unknown as Product[]) ?? [];
  if (opts.categorySlug) rows = rows.filter((p) => p.categories?.slug === opts.categorySlug);
  return rows;
}

export async function getProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select(PRODUCT_FIELDS).eq("slug", slug).eq("is_active", true).maybeSingle();
  return (data as unknown as Product) ?? null;
}

export async function getHighlight(): Promise<Highlight | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("highlights")
    .select(`*, products(${PRODUCT_FIELDS})`)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as Highlight) ?? null;
}

export async function getNews(limit = 8): Promise<NewsItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select(`*, products(${PRODUCT_FIELDS})`)
    .eq("is_active", true)
    .order("sort_order")
    .limit(limit);
  return (data as NewsItem[]) ?? [];
}

export async function getServices(): Promise<Service[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("services").select("*").eq("is_active", true).order("sort_order");
  return (data as Service[]) ?? [];
}

export async function getCafe(): Promise<{ categories: CafeCategory[]; items: CafeItem[] }> {
  const supabase = await createClient();
  const [c, i] = await Promise.all([
    supabase.from("cafe_categories").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("cafe_items").select("*").eq("is_active", true).order("sort_order")
  ]);
  return { categories: (c.data as CafeCategory[]) ?? [], items: (i.data as CafeItem[]) ?? [] };
}
