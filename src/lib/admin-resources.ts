// =====================================================================
// Configuração das telas de cadastro do painel. Cada "recurso" descreve
// uma tabela, seus campos e como aparece na lista. As telas e as ações
// de salvar/excluir são genéricas e usam esta configuração — assim fica
// fácil adicionar um novo cadastro (ou, no futuro, campos vindos do ERP).
// =====================================================================

export type FieldType =
  | "text"
  | "textarea"
  | "money"
  | "number"
  | "boolean"
  | "select"
  | "relation"
  | "image"
  | "datetime"
  | "url"
  | "icon"
  | "color"
  | "slug"
  | "keyvalue";

export type Field = {
  name: string; // coluna (aceita "colors.primary" para campos JSON)
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  relation?: { table: string; labelColumn: string; orderBy?: string };
  folder?: string; // pasta no Storage para imagens
  imageHint?: string;
  slugFrom?: string;
  virtual?: boolean; // não é coluna da tabela (tratado em hooks)
  default?: string | number | boolean;
  wide?: boolean;
};

export type Column = { name: string; label: string; type?: "image" | "money" | "boolean" | "relation" | "datetime" | "badge"; relationKey?: string };

export type Resource = {
  key: string; // usado na URL: /admin/<key>
  table: string;
  title: string;
  singular: string;
  description: string;
  select: string;
  searchColumn: string;
  orderBy: { column: string; ascending: boolean }[];
  sortable?: boolean; // possui sort_order (setas para ordenar)
  hasActive?: boolean;
  fields: Field[];
  columns: Column[];
  filters?: { name: string; label: string; options: { value: string; label: string }[] }[];
};

export const BANNER_PLACEMENTS = [
  { value: "home_carousel", label: "Início — Acontece no Japão (carrossel)" },
  { value: "home_hero", label: "Início — ilustração do banner principal" },
  { value: "strip", label: "Faixa promocional 728 × 110 px (Início)" },
  { value: "offers_header", label: "Ofertas — ilustração do topo" },
  { value: "sectors_header", label: "Setores — ilustração do topo" },
  { value: "services_header", label: "Serviços — ilustração do topo" },
  { value: "cafe_header", label: "Cafeteria — banner do topo" }
];

const active = (def = true): Field => ({ name: "is_active", label: "Ativo (visível no site)", type: "boolean", default: def });
const order: Field = { name: "sort_order", label: "Ordem de exibição", type: "number", default: 0, help: "Números menores aparecem primeiro. Você também pode usar as setas na lista." };
const period: Field[] = [
  { name: "starts_at", label: "Data/hora inicial", type: "datetime", help: "Opcional. Horário de Brasília." },
  { name: "ends_at", label: "Data/hora final", type: "datetime", help: "Opcional. Ao terminar, sai do site automaticamente." }
];
const productRel = { table: "products", labelColumn: "name", orderBy: "name" };

export const RESOURCES: Resource[] = [
  {
    key: "produtos",
    table: "products",
    title: "Produtos",
    singular: "produto",
    description: "Cadastre, edite preços, imagens e marque ofertas, destaques e novidades.",
    select: "*, categories(name)",
    searchColumn: "name",
    orderBy: [
      { column: "sort_order", ascending: true },
      { column: "name", ascending: true }
    ],
    sortable: true,
    hasActive: true,
    fields: [
      { name: "name", label: "Nome do produto", type: "text", required: true, placeholder: "Ex.: Arroz Tipo 1" },
      { name: "slug", label: "Endereço (URL)", type: "slug", slugFrom: "name", help: "Gerado automaticamente a partir do nome." },
      { name: "unit_label", label: "Unidade / embalagem", type: "text", placeholder: "Ex.: 5kg, Kg, Lata 350ml" },
      { name: "category_id", label: "Categoria", type: "relation", relation: { table: "categories", labelColumn: "name", orderBy: "sort_order" } },
      { name: "price", label: "Preço normal (R$)", type: "money", required: true },
      { name: "offer_enabled", label: "Em oferta", type: "boolean", virtual: true, help: "Cria/atualiza uma oferta sem prazo. Para ofertas com datas, use o menu Ofertas." },
      { name: "offer_price", label: "Preço promocional (R$)", type: "money", virtual: true },
      { name: "is_new", label: "Novidade", type: "boolean" },
      { name: "is_featured", label: "Destaque", type: "boolean", help: "Para o Destaque da Semana, use o menu Destaque da Semana." },
      { name: "description", label: "Descrição", type: "textarea", wide: true },
      { name: "image_path", label: "Imagem do produto", type: "image", folder: "products", imageHint: "Recomendado: quadrada, fundo branco, até 5 MB (JPG, PNG ou WEBP).", wide: true },
      order,
      active()
    ],
    columns: [
      { name: "image_path", label: "", type: "image" },
      { name: "name", label: "Produto" },
      { name: "categories", label: "Categoria", type: "relation", relationKey: "name" },
      { name: "price", label: "Preço", type: "money" },
      { name: "promo_price", label: "Promoção", type: "money" },
      { name: "flags", label: "Marcações", type: "badge" }
    ],
    filters: [
      {
        name: "flag",
        label: "Mostrar",
        options: [
          { value: "", label: "Todos" },
          { value: "ativos", label: "Ativos" },
          { value: "inativos", label: "Inativos" },
          { value: "oferta", label: "Em oferta" },
          { value: "novidade", label: "Novidades" }
        ]
      }
    ]
  },
  {
    key: "categorias",
    table: "categories",
    title: "Categorias e Setores",
    singular: "categoria",
    description: "Categorias do catálogo. Marque \"Mostrar em Setores\" para aparecer na página Setores.",
    select: "*",
    searchColumn: "name",
    orderBy: [{ column: "sort_order", ascending: true }],
    sortable: true,
    hasActive: true,
    fields: [
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "slug", label: "Endereço (URL)", type: "slug", slugFrom: "name" },
      { name: "icon", label: "Ícone", type: "icon" },
      { name: "description", label: "Descrição (texto do card de Setores)", type: "textarea" },
      { name: "show_in_sectors", label: "Mostrar na página Setores", type: "boolean" },
      { name: "link_url", label: "Link especial (opcional)", type: "url", help: "Ex.: /cafeteria. Se vazio, o botão leva aos produtos da categoria." },
      { name: "image_path", label: "Imagem do card de Setores", type: "image", folder: "sectors", imageHint: "Formato horizontal (aprox. 2,2 : 1).", wide: true },
      order,
      active()
    ],
    columns: [
      { name: "image_path", label: "", type: "image" },
      { name: "name", label: "Categoria" },
      { name: "show_in_sectors", label: "Em Setores", type: "boolean" }
    ]
  },
  {
    key: "ofertas",
    table: "offers",
    title: "Ofertas",
    singular: "oferta",
    description: "Ofertas com preço promocional e período. Ao terminar a data final, a oferta sai do site sozinha.",
    select: "*, products(name, price, image_path)",
    searchColumn: "title",
    orderBy: [{ column: "sort_order", ascending: true }],
    sortable: true,
    hasActive: true,
    fields: [
      { name: "product_id", label: "Produto", type: "relation", required: true, relation: productRel },
      { name: "promo_price", label: "Preço promocional (R$)", type: "money", required: true },
      { name: "badge_label", label: "Etiqueta", type: "select", options: [
        { value: "Oferta especial", label: "Oferta especial" },
        { value: "Promoção", label: "Promoção" },
        { value: "Imperdível", label: "Imperdível" },
        { value: "Só hoje", label: "Só hoje" }
      ], default: "Oferta especial" },
      { name: "title", label: "Título (opcional)", type: "text" },
      { name: "description", label: "Descrição (opcional)", type: "textarea" },
      ...period,
      order,
      active()
    ],
    columns: [
      { name: "products", label: "", type: "image", relationKey: "image_path" },
      { name: "products", label: "Produto", type: "relation", relationKey: "name" },
      { name: "promo_price", label: "Preço oferta", type: "money" },
      { name: "starts_at", label: "Início", type: "datetime" },
      { name: "ends_at", label: "Fim", type: "datetime" }
    ]
  },
  {
    key: "destaques",
    table: "highlights",
    title: "Destaque da Semana",
    singular: "destaque",
    description: "O produto em destaque na página inicial. O mais recente ativo é o exibido.",
    select: "*, products(name, image_path)",
    searchColumn: "title",
    orderBy: [{ column: "created_at", ascending: false }],
    hasActive: true,
    fields: [
      { name: "product_id", label: "Produto", type: "relation", relation: productRel },
      { name: "title", label: "Título", type: "text", required: true, default: "Destaque da Semana" },
      { name: "description", label: "Descrição", type: "textarea" },
      { name: "image_path", label: "Imagem (opcional — se vazio, usa a do produto)", type: "image", folder: "highlights", wide: true },
      ...period,
      active()
    ],
    columns: [
      { name: "products", label: "", type: "image", relationKey: "image_path" },
      { name: "title", label: "Título" },
      { name: "products", label: "Produto", type: "relation", relationKey: "name" },
      { name: "ends_at", label: "Até", type: "datetime" }
    ]
  },
  {
    key: "novidades",
    table: "news",
    title: "Novidades",
    singular: "novidade",
    description: "Itens da seção Novidades da página inicial (podem apontar para um produto).",
    select: "*, products(name, image_path)",
    searchColumn: "title",
    orderBy: [{ column: "sort_order", ascending: true }],
    sortable: true,
    hasActive: true,
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "product_id", label: "Produto (opcional)", type: "relation", relation: productRel },
      { name: "description", label: "Descrição", type: "textarea" },
      { name: "link_url", label: "Link (opcional)", type: "url", help: "Se vazio e houver produto, abre a página do produto." },
      { name: "image_path", label: "Imagem (opcional)", type: "image", folder: "news", wide: true },
      order,
      active()
    ],
    columns: [
      { name: "image_path", label: "", type: "image" },
      { name: "title", label: "Título" },
      { name: "products", label: "Produto", type: "relation", relationKey: "name" }
    ]
  },
  {
    key: "banners",
    table: "banners",
    title: "Banners",
    singular: "banner",
    description: "Imagens promocionais do site. Tamanho padrão das faixas: 728 × 110 px.",
    select: "*, themes(name)",
    searchColumn: "title",
    orderBy: [
      { column: "placement", ascending: true },
      { column: "sort_order", ascending: true }
    ],
    sortable: true,
    hasActive: true,
    fields: [
      { name: "placement", label: "Onde aparece", type: "select", required: true, options: BANNER_PLACEMENTS, default: "home_carousel" },
      { name: "image_path", label: "Imagem", type: "image", folder: "banners", imageHint: "Faixa: 728 × 110 px. Carrossel: aprox. 1030 × 185 px. Ilustrações do topo das páginas: PNG ou WEBP com fundo transparente.", wide: true },
      { name: "title", label: "Título (opcional — aparece sobre a imagem)", type: "text" },
      { name: "description", label: "Descrição (opcional)", type: "textarea" },
      { name: "button_text", label: "Texto do botão (opcional)", type: "text" },
      { name: "link_url", label: "Link ao clicar", type: "url", placeholder: "/ofertas ou https://..." },
      { name: "theme_id", label: "Exclusivo de um tema (opcional)", type: "relation", relation: { table: "themes", labelColumn: "name", orderBy: "name" }, help: "Se escolher um tema, o banner só aparece enquanto esse tema estiver ativo." },
      ...period,
      order,
      active()
    ],
    columns: [
      { name: "image_path", label: "", type: "image" },
      { name: "placement", label: "Local" },
      { name: "title", label: "Título" },
      { name: "themes", label: "Tema", type: "relation", relationKey: "name" }
    ],
    filters: [{ name: "placement", label: "Local", options: [{ value: "", label: "Todos" }, ...BANNER_PLACEMENTS] }]
  },
  {
    key: "servicos",
    table: "services",
    title: "Serviços",
    singular: "serviço",
    description: "Lotérica, Chaveiro, Farmácia e demais serviços.",
    select: "*",
    searchColumn: "name",
    orderBy: [{ column: "sort_order", ascending: true }],
    sortable: true,
    hasActive: true,
    fields: [
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "icon", label: "Ícone", type: "icon" },
      { name: "description", label: "Descrição", type: "textarea" },
      { name: "link_url", label: "Link do botão \"Saiba mais\" (opcional)", type: "url", help: "Se vazio, abre o WhatsApp da loja." },
      { name: "image_path", label: "Imagem", type: "image", folder: "services", wide: true },
      order,
      active()
    ],
    columns: [
      { name: "image_path", label: "", type: "image" },
      { name: "name", label: "Serviço" }
    ]
  },
  {
    key: "cafeteria",
    table: "cafe_items",
    title: "Cafeteria — Cardápio",
    singular: "item do cardápio",
    description: "Itens do cardápio. O botão \"Ver imagens\" abre o link configurado em cada item.",
    select: "*, cafe_categories(name)",
    searchColumn: "name",
    orderBy: [{ column: "sort_order", ascending: true }],
    sortable: true,
    hasActive: true,
    fields: [
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "cafe_category_id", label: "Categoria", type: "relation", relation: { table: "cafe_categories", labelColumn: "name", orderBy: "sort_order" } },
      { name: "description", label: "Descrição", type: "textarea" },
      { name: "price", label: "Preço (R$)", type: "money" },
      { name: "images_url", label: "Link do botão \"Ver imagens\"", type: "url", placeholder: "https://...", help: "Ex.: álbum do Google Fotos, Instagram ou Drive. Se vazio, o botão amplia a foto do item." },
      { name: "image_path", label: "Foto", type: "image", folder: "cafe", wide: true },
      order,
      active()
    ],
    columns: [
      { name: "image_path", label: "", type: "image" },
      { name: "name", label: "Item" },
      { name: "cafe_categories", label: "Categoria", type: "relation", relationKey: "name" },
      { name: "price", label: "Preço", type: "money" }
    ]
  },
  {
    key: "cafeteria-categorias",
    table: "cafe_categories",
    title: "Cafeteria — Categorias",
    singular: "categoria da cafeteria",
    description: "Abas do cardápio (Cafés, Bebidas, Lanches...).",
    select: "*",
    searchColumn: "name",
    orderBy: [{ column: "sort_order", ascending: true }],
    sortable: true,
    hasActive: true,
    fields: [
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "slug", label: "Identificador", type: "slug", slugFrom: "name" },
      { name: "icon", label: "Ícone", type: "icon" },
      order,
      active()
    ],
    columns: [{ name: "name", label: "Categoria" }]
  },
  {
    key: "temas",
    table: "themes",
    title: "Temas",
    singular: "tema",
    description: "Visual do site em datas especiais. O tema padrão é o visual oficial do Supermercado Japão.",
    select: "*",
    searchColumn: "name",
    orderBy: [
      { column: "is_default", ascending: false },
      { column: "name", ascending: true }
    ],
    hasActive: true,
    fields: [
      { name: "name", label: "Nome do tema", type: "text", required: true },
      { name: "slug", label: "Identificador", type: "slug", slugFrom: "name" },
      { name: "colors.primary", label: "Cor principal", type: "color", default: "#E30613" },
      { name: "colors.primaryDark", label: "Cor principal escura (menu)", type: "color", default: "#B0000E" },
      { name: "colors.accent", label: "Cor de destaque (botões amarelos)", type: "color", default: "#FFD200" },
      { name: "colors.accentInk", label: "Cor do texto sobre o destaque", type: "color", default: "#1A1A1A" },
      { name: "colors.footer", label: "Cor do rodapé", type: "color", default: "#0B1A2C" },
      { name: "decorations.emoji", label: "Enfeite (emoji)", type: "text", placeholder: "🎄" },
      { name: "decorations.ribbon", label: "Faixa de aviso no topo do site", type: "text", placeholder: "Feliz Natal! Ofertas especiais...", wide: true },
      { name: "texts", label: "Textos especiais do tema (opcional)", type: "keyvalue", wide: true, help: "Uma linha por texto, no formato chave = texto. Ex.: home.hero_highlight = ofertas de Natal. As chaves aparecem em Conteúdo do site." },
      active()
    ],
    columns: [
      { name: "name", label: "Tema" },
      { name: "is_default", label: "Padrão", type: "boolean" }
    ]
  },
  {
    key: "agendamentos",
    table: "theme_schedules",
    title: "Agendamentos de temas",
    singular: "agendamento",
    description: "Programe quando cada tema entra e sai do ar. Fora dos períodos, volta o tema padrão (ou o próximo programado).",
    select: "*, themes(name)",
    searchColumn: "id",
    orderBy: [{ column: "starts_at", ascending: true }],
    hasActive: true,
    fields: [
      { name: "theme_id", label: "Tema", type: "relation", required: true, relation: { table: "themes", labelColumn: "name", orderBy: "name" } },
      { name: "starts_at", label: "Início", type: "datetime", required: true },
      { name: "ends_at", label: "Fim", type: "datetime", required: true },
      { name: "priority", label: "Prioridade", type: "number", default: 0, help: "Se dois períodos se sobrepõem, vale o de maior prioridade." },
      active()
    ],
    columns: [
      { name: "themes", label: "Tema", type: "relation", relationKey: "name" },
      { name: "starts_at", label: "Início", type: "datetime" },
      { name: "ends_at", label: "Fim", type: "datetime" }
    ]
  }
];

export function getResource(key: string) {
  return RESOURCES.find((r) => r.key === key) ?? null;
}
