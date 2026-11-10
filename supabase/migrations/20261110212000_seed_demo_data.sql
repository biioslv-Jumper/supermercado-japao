-- =====================================================================
-- Dados iniciais (demonstrativos) — podem ser editados/substituídos no admin.
-- Imagens começando com "/" ficam na pasta public/ do site;
-- imagens enviadas pelo admin ficam no bucket "site-media".
-- =====================================================================

-- Link opcional para setores que levam a outra página (ex.: Cafeteria)
alter table public.categories add column if not exists link_url text;

insert into public.site_settings (id, store_name, phone, whatsapp, email, address, address_city, maps_url, store_photo_path, cafe_hours_weekdays, cafe_hours_sunday)
values (1, 'Supermercado Japão', '(11) 4198-7070', '(11) 94016-3200', 'contato@superjapao.com.br',
  'Estr. Velha de Itapevi, 4296 - Vila Militar', 'Barueri - SP, 06444-000',
  'https://www.google.com/maps/search/?api=1&query=Estr.+Velha+de+Itapevi,+4296+-+Vila+Militar,+Barueri+-+SP,+06444-000',
  '/demo/store-barueri.webp', '8:00h às 20:30h', '8:00h às 15:30h')
on conflict (id) do nothing;

insert into public.site_content (key, value, group_name, label, multiline, sort_order) values
('header.search_placeholder', 'O que você está procurando?', 'Cabeçalho e menu', 'Texto da busca', false, 0),
('header.login', 'Entrar', 'Cabeçalho e menu', 'Botão Entrar', false, 1),
('header.my_account', 'Minha Conta', 'Cabeçalho e menu', 'Botão Minha Conta', false, 2),
('nav.home', 'Início', 'Cabeçalho e menu', 'Menu: Início', false, 3),
('nav.offers', 'Ofertas', 'Cabeçalho e menu', 'Menu: Ofertas', false, 4),
('nav.sectors', 'Setores', 'Cabeçalho e menu', 'Menu: Setores', false, 5),
('nav.services', 'Serviços', 'Cabeçalho e menu', 'Menu: Serviços', false, 6),
('nav.card', 'Cartão Japão', 'Cabeçalho e menu', 'Menu: Cartão Japão', false, 7),
('nav.contact', 'Contato', 'Cabeçalho e menu', 'Menu: Contato', false, 8),
('nav.app', 'APP (Em breve)', 'Cabeçalho e menu', 'Menu: APP', false, 9),
('home.hero_line1', 'Aqui você encontra', 'Página inicial', 'Banner principal: linha 1', false, 10),
('home.hero_highlight', 'qualidade e variedade', 'Página inicial', 'Banner principal: destaque amarelo', false, 11),
('home.hero_line3', 'para o seu dia a dia!', 'Página inicial', 'Banner principal: linha 3', false, 12),
('home.hero_button', 'Confira as ofertas', 'Página inicial', 'Banner principal: botão', false, 13),
('home.hero_button_url', '/ofertas', 'Página inicial', 'Banner principal: link do botão', false, 14),
('home.hero_script', 'Mais que um supermercado, um lugar para sua família.', 'Página inicial', 'Banner principal: frase manuscrita', true, 15),
('home.events_title', 'Acontece no Japão', 'Página inicial', 'Acontece no Japão: título', false, 16),
('home.events_subtitle', 'Campanhas, sorteios, eventos e muitas novidades para você!', 'Página inicial', 'Acontece no Japão: subtítulo', false, 17),
('home.quick_offers_title', 'Ofertas da Semana', 'Página inicial', 'Atalho 1: título', false, 18),
('home.quick_offers_button', 'Ver ofertas', 'Página inicial', 'Atalho 1: botão', false, 19),
('home.quick_card_title', 'Cartão Japão', 'Página inicial', 'Atalho 2: título', false, 20),
('home.quick_card_button', 'Saiba mais', 'Página inicial', 'Atalho 2: botão', false, 21),
('home.quick_cafe_title', 'Cafeteria Japão', 'Página inicial', 'Atalho 3: título', false, 22),
('home.quick_cafe_button', 'Ver cardápio', 'Página inicial', 'Atalho 3: botão', false, 23),
('home.quick_store_title', 'Nossa Loja', 'Página inicial', 'Atalho 4: título', false, 24),
('home.quick_store_text', 'Veja como chegar', 'Página inicial', 'Atalho 4: texto', false, 25),
('home.offers_title', 'Ofertas da Semana', 'Página inicial', 'Ofertas: título', false, 26),
('home.offers_subtitle', 'Produtos selecionados com qualidade e economia para o seu dia a dia.', 'Página inicial', 'Ofertas: subtítulo', false, 27),
('home.offers_link', 'Ver todas as ofertas', 'Página inicial', 'Ofertas: link', false, 28),
('home.highlight_subtitle', 'O produto escolhido especialmente para você nesta semana.', 'Página inicial', 'Destaque da Semana: subtítulo', false, 29),
('home.highlight_button', 'Ver produto', 'Página inicial', 'Destaque da Semana: botão', false, 30),
('home.news_title', 'Novidades', 'Página inicial', 'Novidades: título', false, 31),
('home.news_subtitle', 'Acabou de chegar no Super Japão.', 'Página inicial', 'Novidades: subtítulo', false, 32),
('home.categories_title', 'Nossos Setores', 'Página inicial', 'Categorias: título', false, 33),
('home.categories_subtitle', 'Tudo o que você precisa em um só lugar.', 'Página inicial', 'Categorias: subtítulo', false, 34),
('home.categories_link', 'Ver todos os setores', 'Página inicial', 'Categorias: link', false, 35),
('home.store_title', 'Nossa Loja', 'Página inicial', 'Nossa Loja: título', false, 36),
('home.store_subtitle', 'Venha nos visitar!', 'Página inicial', 'Nossa Loja: subtítulo', false, 37),
('home.store_name', 'Loja Barueri', 'Página inicial', 'Nossa Loja: nome da loja', false, 38),
('home.store_button', 'Ver no mapa', 'Página inicial', 'Nossa Loja: botão', false, 39),
('home.services_title', 'Nossos Serviços', 'Página inicial', 'Serviços: título', false, 40),
('home.services_subtitle', 'Mais conveniência para o seu dia a dia.', 'Página inicial', 'Serviços: subtítulo', false, 41),
('home.services_link', 'Ver todos os serviços', 'Página inicial', 'Serviços: link', false, 42),
('home.about_title', 'Sobre o Supermercado Japão', 'Página inicial', 'Institucional: título', false, 43),
('home.about_text', 'Mais que um supermercado, um lugar para sua família. No Supermercado Japão você encontra qualidade, variedade e atendimento de verdade, com setores completos e serviços para facilitar o seu dia a dia.', 'Página inicial', 'Institucional: texto', true, 44),
('home.about_button', 'Conheça nossa história', 'Página inicial', 'Institucional: botão', false, 45),
('home.contact_title', 'Fale com a gente', 'Página inicial', 'Contato: título', false, 46),
('home.contact_subtitle', 'Estamos prontos para atender você.', 'Página inicial', 'Contato: subtítulo', false, 47),
('offers.hero_title', 'Ofertas', 'Ofertas e produtos', 'Ofertas: título do topo', false, 48),
('offers.hero_subtitle', 'Aproveite os melhores preços e qualidade todos os dias no Super Japão!', 'Ofertas e produtos', 'Ofertas: subtítulo do topo', true, 49),
('offers.hero_script', 'Super Japão sempre com você!', 'Ofertas e produtos', 'Ofertas: frase manuscrita', false, 50),
('offers.list_title', 'Todas as Ofertas', 'Ofertas e produtos', 'Ofertas: título da lista', false, 51),
('offers.list_subtitle', 'Qualidade, economia e variedade para o seu dia a dia!', 'Ofertas e produtos', 'Ofertas: subtítulo da lista', false, 52),
('products.list_title', 'Nossos Produtos', 'Ofertas e produtos', 'Produtos: título da lista', false, 53),
('products.list_subtitle', 'Confira os produtos do Supermercado Japão.', 'Ofertas e produtos', 'Produtos: subtítulo da lista', false, 54),
('offers.categories_title', 'Categorias', 'Ofertas e produtos', 'Barra lateral: título', false, 55),
('offers.all_products', 'Todos os produtos', 'Ofertas e produtos', 'Barra lateral: todos', false, 56),
('offers.sort_label', 'Ordenar por:', 'Ofertas e produtos', 'Texto ''Ordenar por''', false, 57),
('offers.badge_default', 'Promoção', 'Ofertas e produtos', 'Etiqueta padrão de oferta', false, 58),
('offers.empty', 'Nenhum produto encontrado nesta categoria no momento.', 'Ofertas e produtos', 'Mensagem sem ofertas', false, 59),
('offers.price_note', 'Preços e ofertas válidos enquanto durarem os estoques. Imagens meramente ilustrativas.', 'Ofertas e produtos', 'Observação de preços', true, 60),
('sectors.hero_title1', 'Nossos', 'Setores', 'Topo: linha 1', false, 61),
('sectors.hero_title2', 'Setores', 'Setores', 'Topo: linha 2 (amarela)', false, 62),
('sectors.hero_subtitle', 'Qualidade, variedade e tudo que sua família precisa em um só lugar!', 'Setores', 'Topo: subtítulo', true, 63),
('sectors.hero_script', 'Produtos frescos, setores completos e atendimento sempre perto de você!', 'Setores', 'Topo: frase manuscrita', true, 64),
('sectors.list_title', 'Setores do Supermercado', 'Setores', 'Lista: título', false, 65),
('sectors.list_subtitle', 'Tudo o que você precisa para o seu dia a dia, com qualidade e variedade.', 'Setores', 'Lista: subtítulo', false, 66),
('sectors.search_placeholder', 'Buscar setor...', 'Setores', 'Busca de setor', false, 67),
('sectors.card_button', 'Ver produtos', 'Setores', 'Botão dos cards', false, 68),
('sectors.grill_title', 'Restaurante Grill', 'Setores', 'Restaurante: título', false, 69),
('sectors.grill_text', 'Refeições saborosas, grelhados e pratos especiais todos os dias.', 'Setores', 'Restaurante: texto', false, 70),
('sectors.grill_button', 'Ver mais', 'Setores', 'Restaurante: botão', false, 71),
('sectors.grill_url', '/contato', 'Setores', 'Restaurante: link do botão', false, 72),
('sectors.services_title', 'Serviços para facilitar o seu dia', 'Setores', 'Serviços: título', false, 73),
('sectors.services_subtitle', 'Mais conveniência em um só lugar.', 'Setores', 'Serviços: subtítulo', false, 74),
('app.badge', 'EM BREVE', 'Aplicativo', 'Etiqueta', false, 75),
('app.title1', 'Super Japão', 'Aplicativo', 'Título linha 1', false, 76),
('app.title2', 'no seu celular!', 'Aplicativo', 'Título linha 2 (vermelha)', false, 77),
('app.text', 'Estamos desenvolvendo um aplicativo para trazer ainda mais praticidade, ofertas exclusivas e benefícios para você!', 'Aplicativo', 'Texto', true, 78),
('app.features', 'Ofertas personalizadas
Encarte digital
Notificações de ofertas
Lista de compras
E muito mais!', 'Aplicativo', 'Lista de vantagens (uma por linha)', true, 79),
('app.button', 'Quero ser avisado quando lançar', 'Aplicativo', 'Botão', false, 80),
('services.hero_title1', 'Nossos', 'Serviços', 'Topo: linha 1', false, 81),
('services.hero_title2', 'Serviços', 'Serviços', 'Topo: linha 2 (amarela)', false, 82),
('services.hero_subtitle', 'Mais praticidade, comodidade e tudo o que você precisa em um só lugar!', 'Serviços', 'Topo: subtítulo', true, 83),
('services.hero_script', 'Diversos serviços para facilitar o seu dia, sempre perto de você!', 'Serviços', 'Topo: frase manuscrita', true, 84),
('services.list_title', 'Conheça nossos serviços', 'Serviços', 'Lista: título', false, 85),
('services.list_subtitle', 'Qualidade, praticidade e atendimento em um só lugar.', 'Serviços', 'Lista: subtítulo', false, 86),
('services.button', 'Saiba mais', 'Serviços', 'Botão dos cards', false, 87),
('services.benefit1_title', 'Tudo em um', 'Serviços', 'Vantagem 1: título', false, 88),
('services.benefit1_text', 'só lugar', 'Serviços', 'Vantagem 1: texto', false, 89),
('services.benefit2_title', 'Atendimento', 'Serviços', 'Vantagem 2: título', false, 90),
('services.benefit2_text', 'especializado', 'Serviços', 'Vantagem 2: texto', false, 91),
('services.benefit3_title', 'Segurança', 'Serviços', 'Vantagem 3: título', false, 92),
('services.benefit3_text', 'e confiança', 'Serviços', 'Vantagem 3: texto', false, 93),
('services.benefit4_title', 'Mais comodidade', 'Serviços', 'Vantagem 4: título', false, 94),
('services.benefit4_text', 'para o seu dia a dia', 'Serviços', 'Vantagem 4: texto', false, 95),
('cafe.hours_title', 'Horário de Atendimento', 'Cafeteria', 'Horário: título', false, 96),
('cafe.hours_weekdays_label', 'Segunda a Sábado', 'Cafeteria', 'Horário: dias úteis (rótulo)', false, 97),
('cafe.hours_weekdays', '8:00h às 20:30h', 'Cafeteria', 'Horário: dias úteis', false, 98),
('cafe.hours_sunday_label', 'Domingos', 'Cafeteria', 'Horário: domingo (rótulo)', false, 99),
('cafe.hours_sunday', '8:00h às 15:30h', 'Cafeteria', 'Horário: domingo', false, 100),
('cafe.all', 'Todos', 'Cafeteria', 'Filtro ''Todos''', false, 101),
('cafe.menu_title', 'Nosso Cardápio', 'Cafeteria', 'Título do cardápio', false, 102),
('cafe.button', 'Ver imagens', 'Cafeteria', 'Botão dos itens', false, 103),
('cafe.empty', 'Nenhum item nesta categoria no momento.', 'Cafeteria', 'Mensagem sem itens', false, 104),
('about.title', 'Nossa história', 'Institucional', 'Nossa história: título', false, 105),
('about.text', 'O Supermercado Japão nasceu com o propósito de oferecer qualidade, variedade e um atendimento próximo para as famílias da região.

Edite este texto no painel administrativo em Conteúdo do site → Institucional.', 'Institucional', 'Nossa história: texto', true, 106),
('about.sustainability_title', 'Sustentabilidade', 'Institucional', 'Sustentabilidade: título', false, 107),
('about.sustainability_text', 'Edite este texto no painel administrativo para contar as ações de sustentabilidade do Supermercado Japão.', 'Institucional', 'Sustentabilidade: texto', true, 108),
('about.work_title', 'Trabalhe conosco', 'Institucional', 'Trabalhe conosco: título', false, 109),
('about.work_text', 'Quer fazer parte da nossa equipe? Entre em contato pelo e-mail ou WhatsApp informados abaixo.', 'Institucional', 'Trabalhe conosco: texto', true, 110),
('card.title', 'Cartão Japão', 'Institucional', 'Cartão Japão: título', false, 111),
('card.text', 'Informações sobre o Cartão Japão. Edite este texto no painel administrativo em Conteúdo do site → Institucional.', 'Institucional', 'Cartão Japão: texto', true, 112),
('app.page_title', 'APP Super Japão', 'Institucional', 'Página do APP: título', false, 113),
('contact.title', 'Fale conosco', 'Contato', 'Título', false, 114),
('contact.subtitle', 'Estamos prontos para atender você. Escolha o melhor canal:', 'Contato', 'Subtítulo', false, 115),
('contact.phone_label', 'Telefone', 'Contato', 'Rótulo telefone', false, 116),
('contact.whatsapp_label', 'WhatsApp', 'Contato', 'Rótulo WhatsApp', false, 117),
('contact.email_label', 'E-mail', 'Contato', 'Rótulo e-mail', false, 118),
('contact.address_label', 'Endereço', 'Contato', 'Rótulo endereço', false, 119),
('contact.hours_label', 'Horário de funcionamento', 'Contato', 'Rótulo horário', false, 120),
('contact.whatsapp_button', 'Chamar no WhatsApp', 'Contato', 'Botão WhatsApp', false, 121),
('footer.tagline', 'Mais que um supermercado, um lugar para sua família.', 'Rodapé', 'Frase abaixo da logo', true, 122),
('footer.about_title', 'Sobre o Super Japão', 'Rodapé', 'Coluna 1: título', false, 123),
('footer.link_history', 'Nossa história', 'Rodapé', 'Link: Nossa história', false, 124),
('footer.link_sustainability', 'Sustentabilidade', 'Rodapé', 'Link: Sustentabilidade', false, 125),
('footer.link_work', 'Trabalhe conosco', 'Rodapé', 'Link: Trabalhe conosco', false, 126),
('footer.link_contact', 'Fale conosco', 'Rodapé', 'Link: Fale conosco', false, 127),
('footer.useful_title', 'Links úteis', 'Rodapé', 'Coluna 2: título', false, 128),
('footer.social_title', 'Siga-nos', 'Rodapé', 'Coluna 3: título', false, 129),
('footer.contact_title', 'Contato', 'Rodapé', 'Coluna 4: título', false, 130),
('footer.copyright', '© 2026 Supermercado Japão', 'Rodapé', 'Texto de copyright', false, 131),
('footer.rights', 'Todos os direitos reservados.', 'Rodapé', 'Texto ''direitos reservados''', false, 132),
('footer.made_for', 'Desenvolvido para você.', 'Rodapé', 'Texto do coração', false, 133),
('auth.login_title', 'Entrar na sua conta', 'Login e conta', 'Login: título', false, 134),
('auth.login_subtitle', 'Acesse para aproveitar uma experiência completa no Super Japão.', 'Login e conta', 'Login: subtítulo', false, 135),
('auth.google_button', 'Continuar com Google', 'Login e conta', 'Botão Google', false, 136),
('auth.signup_title', 'Criar conta', 'Login e conta', 'Cadastro: título', false, 137),
('auth.signup_subtitle', 'É rápido e gratuito.', 'Login e conta', 'Cadastro: subtítulo', false, 138),
('auth.forgot_title', 'Recuperar senha', 'Login e conta', 'Recuperação: título', false, 139),
('auth.forgot_subtitle', 'Informe seu e-mail e enviaremos um link para criar uma nova senha.', 'Login e conta', 'Recuperação: subtítulo', false, 140),
('account.title', 'Minha Conta', 'Login e conta', 'Minha Conta: título', false, 141),
('account.subtitle', 'Gerencie seus dados de acesso.', 'Login e conta', 'Minha Conta: subtítulo', false, 142)
on conflict (key) do nothing;

insert into public.categories (slug, name, icon, show_in_sectors, image_path, description, link_url, sort_order) values
('acougue', 'Açougue', 'beef', true, '/demo/sector-acougue.webp', 'Carnes de qualidade para o seu dia a dia.', null, 0),
('hortifruti', 'Hortifruti', 'carrot', true, '/demo/sector-hortifruti.webp', 'Frutas, verduras e legumes sempre frescos e selecionados.', null, 1),
('mercearia', 'Mercearia', 'package', false, null, 'Arroz, feijão, massas, óleos e tudo para sua despensa.', null, 2),
('bebidas', 'Bebidas', 'cup-soda', false, null, 'Refrigerantes, sucos, águas, cervejas e muito mais.', null, 3),
('higiene-beleza', 'Higiene e Beleza', 'sparkles', false, null, 'Cuidados pessoais para toda a família.', null, 4),
('limpeza', 'Limpeza', 'spray-can', false, null, 'Tudo para deixar sua casa limpinha.', null, 5),
('bebes', 'Bebês', 'baby', false, null, 'Fraldas, papinhas e cuidados para os pequenos.', null, 6),
('pet', 'Pet', 'paw-print', false, null, 'Rações e cuidados para o seu pet.', null, 7),
('padaria', 'Padaria', 'croissant', true, '/demo/sector-padaria.webp', 'Pães, doces, bolos e muito mais, sempre fresquinhos.', null, 8),
('rotisseria', 'Rotisseria', 'drumstick', true, '/demo/sector-rotisseria.webp', 'Pratos prontos e refeições deliciosas para sua rotina.', null, 9),
('frios-laticinios', 'Frios e Laticínios', 'milk', true, '/demo/sector-frios-laticinios.webp', 'Queijos, presuntos, iogurtes e produtos lácteos.', null, 10),
('salsicharia', 'Salsicharia', 'ham', true, '/demo/sector-salsicharia.webp', 'Salsichas, linguiças e embutidos de qualidade.', null, 11),
('peixaria', 'Peixaria', 'fish', true, '/demo/sector-peixaria.webp', 'Peixes e frutos do mar sempre frescos.', null, 12),
('congelados', 'Congelados', 'snowflake', false, null, 'Praticidade congelada para o seu dia.', null, 13),
('utilidades-domesticas', 'Utilidades Domésticas', 'utensils', false, null, 'Utensílios e itens para o lar.', null, 14),
('cafeteria', 'Cafeteria', 'coffee', true, '/demo/sector-cafeteria.webp', 'Cafés, lanches, salgados e muito mais para o seu dia.', '/cafeteria', 15)
on conflict (slug) do nothing;

insert into public.products (slug, name, unit_label, category_id, price, image_path, is_new, sort_order, description) values
('picanha-bovina', 'Picanha Bovina', 'Kg', (select id from public.categories where slug='acougue'), 69.9, '/demo/product-picanha.webp', false, 0, 'Produto demonstrativo — substitua pelos dados reais no painel.'),
('arroz-japones-5kg', 'Arroz Japonês', '5kg', (select id from public.categories where slug='mercearia'), 39.9, '/demo/product-arroz-japones.webp', true, 1, 'Produto demonstrativo — substitua pelos dados reais no painel.'),
('cerveja-lata-350ml', 'Cerveja Pilsen', 'Lata 350ml', (select id from public.categories where slug='bebidas'), 4.99, '/demo/product-cerveja-lata.webp', false, 2, 'Produto demonstrativo — substitua pelos dados reais no painel.'),
('lamen-instantaneo-85g', 'Lámen Instantâneo', '85g', (select id from public.categories where slug='mercearia'), 2.49, '/demo/product-lamen.webp', true, 3, 'Produto demonstrativo — substitua pelos dados reais no painel.'),
('banana-prata', 'Banana Prata', 'Kg', (select id from public.categories where slug='hortifruti'), 5.99, '/demo/product-banana-prata.webp', false, 4, 'Produto demonstrativo — substitua pelos dados reais no painel.'),
('leite-longa-vida-1l', 'Leite Longa Vida', '1L', (select id from public.categories where slug='frios-laticinios'), 5.49, '/demo/product-leite-longa-vida.webp', false, 5, 'Produto demonstrativo — substitua pelos dados reais no painel.'),
('refrigerante-cola-2l', 'Refrigerante Cola', '2L', (select id from public.categories where slug='bebidas'), 9.99, '/demo/product-refrigerante-cola.webp', false, 6, 'Produto demonstrativo — substitua pelos dados reais no painel.'),
('detergente-em-po-1-6kg', 'Detergente em Pó', '1,6kg', (select id from public.categories where slug='limpeza'), 24.9, '/demo/product-detergente-po.webp', false, 7, 'Produto demonstrativo — substitua pelos dados reais no painel.'),
('oleo-de-soja-900ml', 'Óleo de Soja', '900ml', (select id from public.categories where slug='mercearia'), 8.99, '/demo/product-oleo-soja.webp', false, 8, 'Produto demonstrativo — substitua pelos dados reais no painel.'),
('papel-higienico-12un', 'Papel Higiênico', 'Folha dupla 12 un.', (select id from public.categories where slug='higiene-beleza'), 18.9, '/demo/product-papel-higienico.webp', false, 9, 'Produto demonstrativo — substitua pelos dados reais no painel.'),
('sabao-em-po-1-6kg', 'Sabão em Pó', '1,6kg', (select id from public.categories where slug='limpeza'), 22.9, '/demo/product-sabao-po.webp', false, 10, 'Produto demonstrativo — substitua pelos dados reais no painel.'),
('mortadela', 'Mortadela', 'Kg', (select id from public.categories where slug='frios-laticinios'), 22.9, '/demo/product-mortadela.webp', false, 11, 'Produto demonstrativo — substitua pelos dados reais no painel.'),
('queijo-mussarela', 'Queijo Mussarela', 'Kg', (select id from public.categories where slug='frios-laticinios'), 49.9, '/demo/product-queijo-mussarela.webp', false, 12, 'Produto demonstrativo — substitua pelos dados reais no painel.'),
('presunto-cozido', 'Presunto Cozido', 'Kg', (select id from public.categories where slug='frios-laticinios'), 35.9, '/demo/product-presunto-cozido.webp', false, 13, 'Produto demonstrativo — substitua pelos dados reais no painel.'),
('pao-frances', 'Pão Francês', 'Kg', (select id from public.categories where slug='padaria'), 16.9, '/demo/product-pao-frances.webp', false, 14, 'Produto demonstrativo — substitua pelos dados reais no painel.'),
('frango-inteiro', 'Frango Inteiro', 'Kg', (select id from public.categories where slug='acougue'), 12.9, '/demo/product-frango-inteiro.webp', false, 15, 'Produto demonstrativo — substitua pelos dados reais no painel.'),
('tomate', 'Tomate', 'Kg', (select id from public.categories where slug='hortifruti'), 8.99, '/demo/product-tomate.webp', false, 16, 'Produto demonstrativo — substitua pelos dados reais no painel.'),
('cebola', 'Cebola', 'Kg', (select id from public.categories where slug='hortifruti'), 6.99, '/demo/product-cebola.webp', false, 17, 'Produto demonstrativo — substitua pelos dados reais no painel.'),
('feijao-carioca-1kg', 'Feijão Carioca', '1kg', (select id from public.categories where slug='mercearia'), 8.49, null, false, 18, 'Produto demonstrativo — substitua pelos dados reais no painel.'),
('acucar-refinado-1kg', 'Açúcar Refinado', '1kg', (select id from public.categories where slug='mercearia'), 4.99, null, false, 19, 'Produto demonstrativo — substitua pelos dados reais no painel.'),
('cafe-torrado-moido-500g', 'Café Torrado e Moído', '500g', (select id from public.categories where slug='mercearia'), 18.9, null, true, 20, 'Produto demonstrativo — substitua pelos dados reais no painel.'),
('macarrao-espaguete-500g', 'Macarrão Espaguete', '500g', (select id from public.categories where slug='mercearia'), 4.29, null, false, 21, 'Produto demonstrativo — substitua pelos dados reais no painel.'),
('biscoito-recheado-130g', 'Biscoito Recheado', '130g', (select id from public.categories where slug='mercearia'), 2.99, null, false, 22, 'Produto demonstrativo — substitua pelos dados reais no painel.'),
('agua-mineral-1-5l', 'Água Mineral', '1,5L', (select id from public.categories where slug='bebidas'), 2.49, null, false, 23, 'Produto demonstrativo — substitua pelos dados reais no painel.'),
('detergente-liquido-500ml', 'Detergente Líquido', '500ml', (select id from public.categories where slug='limpeza'), 2.79, null, false, 24, 'Produto demonstrativo — substitua pelos dados reais no painel.'),
('sabonete-85g', 'Sabonete', '85g', (select id from public.categories where slug='higiene-beleza'), 2.49, null, false, 25, 'Produto demonstrativo — substitua pelos dados reais no painel.'),
('creme-dental-90g', 'Creme Dental', '90g', (select id from public.categories where slug='higiene-beleza'), 4.99, null, false, 26, 'Produto demonstrativo — substitua pelos dados reais no painel.')
on conflict (slug) do nothing;

insert into public.offers (product_id, promo_price, badge_label, sort_order) values
((select id from public.products where slug='picanha-bovina'), 49.9, 'Oferta especial', 0),
((select id from public.products where slug='arroz-japones-5kg'), 29.9, 'Oferta especial', 1),
((select id from public.products where slug='cerveja-lata-350ml'), 3.99, 'Promoção', 2),
((select id from public.products where slug='lamen-instantaneo-85g'), 1.99, 'Promoção', 3),
((select id from public.products where slug='banana-prata'), 3.99, 'Oferta especial', 4),
((select id from public.products where slug='leite-longa-vida-1l'), 4.49, 'Promoção', 5),
((select id from public.products where slug='refrigerante-cola-2l'), 8.49, 'Promoção', 6),
((select id from public.products where slug='detergente-em-po-1-6kg'), 19.9, 'Oferta especial', 7),
((select id from public.products where slug='oleo-de-soja-900ml'), 6.99, 'Promoção', 8),
((select id from public.products where slug='papel-higienico-12un'), 14.9, 'Promoção', 9),
((select id from public.products where slug='sabao-em-po-1-6kg'), 19.9, 'Oferta especial', 10),
((select id from public.products where slug='mortadela'), 17.9, 'Promoção', 11),
((select id from public.products where slug='queijo-mussarela'), 39.9, 'Oferta especial', 12),
((select id from public.products where slug='presunto-cozido'), 27.9, 'Promoção', 13),
((select id from public.products where slug='pao-frances'), 12.9, 'Promoção', 14),
((select id from public.products where slug='frango-inteiro'), 9.9, 'Oferta especial', 15),
((select id from public.products where slug='tomate'), 5.99, 'Promoção', 16),
((select id from public.products where slug='cebola'), 4.99, 'Promoção', 17);

insert into public.highlights (product_id, title, description)
values ((select id from public.products where slug='picanha-bovina'), 'Destaque da Semana',
        'Picanha bovina selecionada, macia e saborosa — perfeita para o seu churrasco.');

insert into public.news (product_id, title, description, sort_order) values
((select id from public.products where slug='arroz-japones-5kg'), 'Arroz Japonês 5kg', 'Grãos selecionados, ideais para sushi e pratos orientais.', 0),
((select id from public.products where slug='lamen-instantaneo-85g'), 'Lámen Instantâneo', 'Novos sabores para o seu dia a dia.', 1),
((select id from public.products where slug='cafe-torrado-moido-500g'), 'Café Torrado e Moído', 'Aroma marcante para começar bem o dia.', 2);

insert into public.banners (placement, image_path, title, description, button_text, link_url, sort_order) values
('home_hero', '/demo/mascotes.webp', null, null, null, null, 0),
('home_carousel', '/demo/campaign-sorteio.webp', null, null, null, '/contato', 0),
('offers_header', '/demo/mascotes.webp', null, null, null, null, 0),
('sectors_header', '/demo/mascotes.webp', null, null, null, null, 0),
('services_header', '/demo/mascotes.webp', null, null, null, null, 0),
('cafe_header', '/demo/cafe-header.webp', null, null, null, null, 0);

insert into public.services (name, description, icon, image_path, sort_order) values
('Lotérica', 'Pagamentos, jogos, apostas e diversos serviços lotéricos para o seu dia a dia.', 'clover', '/demo/service-loterica.webp', 0),
('Chaveiro', 'Cópias de chaves, abertura de fechaduras e serviços especializados.', 'key-round', '/demo/service-chaveiro.webp', 1),
('Assistência Técnica', 'Manutenção de celulares, tablets, notebooks e eletrônicos com equipe especializada.', 'smartphone', '/demo/service-assistencia-tecnica.webp', 2),
('Oculista', 'Exames de vista, óculos de grau e óculos de sol com qualidade e atendimento profissional.', 'glasses', '/demo/service-oculista.webp', 3),
('Dentista', 'Cuidados com a sua saúde bucal, com profissionais qualificados e atendimento de confiança.', 'smile', '/demo/service-dentista.webp', 4),
('Farmácia', 'Medicamentos, produtos de saúde e bem-estar, com variedade e atendimento especializado.', 'cross', '/demo/service-farmacia.webp', 5),
('Recarga de Transporte', 'Recarga de cartão de ônibus e outros meios de transporte com rapidez e praticidade.', 'bus', '/demo/service-recarga-transporte.webp', 6),
('Carregamento de Carro Elétrico', 'Ponto de recarga para veículos elétricos, com mais comodidade e sustentabilidade para o seu dia a dia.', 'plug-zap', '/demo/service-carro-eletrico.webp', 7);

insert into public.cafe_categories (name, slug, icon, sort_order) values
('Cafés', 'cafes', 'coffee', 0),
('Bebidas', 'bebidas', 'cup-soda', 1),
('Lanches', 'lanches', 'sandwich', 2),
('Salgados', 'salgados', 'croissant', 3),
('Doces', 'doces', 'cake-slice', 4),
('Sobremesas', 'sobremesas', 'ice-cream-bowl', 5)
on conflict (slug) do nothing;

insert into public.cafe_items (cafe_category_id, name, description, price, image_path, sort_order) values
((select id from public.cafe_categories where slug='cafes'), 'Café Expresso', 'Café expresso tradicional e encorpado.', 5.0, '/demo/cafe-cafe-expresso.webp', 0),
((select id from public.cafe_categories where slug='cafes'), 'Cappuccino', 'Cappuccino cremoso com toque de chocolate.', 9.9, '/demo/cafe-cappuccino.webp', 1),
((select id from public.cafe_categories where slug='lanches'), 'Pão na Chapa', 'Pão francês na chapa com manteiga.', 6.5, '/demo/cafe-pao-na-chapa.webp', 2),
((select id from public.cafe_categories where slug='lanches'), 'Sanduíche Natural', 'Pão integral, frango, alface, tomate e maionese.', 12.9, '/demo/cafe-sanduiche-natural.webp', 3),
((select id from public.cafe_categories where slug='salgados'), 'Pão de Queijo', 'Tradicional, quentinho e saboroso.', 4.9, '/demo/cafe-pao-de-queijo.webp', 4),
((select id from public.cafe_categories where slug='salgados'), 'Coxinha', 'Coxinha de frango com catupiry.', 7.9, '/demo/cafe-coxinha.webp', 5),
((select id from public.cafe_categories where slug='doces'), 'Bolo do Dia', 'Fatia de bolo caseiro. (Consulte os sabores)', 8.9, '/demo/cafe-bolo-do-dia.webp', 6),
((select id from public.cafe_categories where slug='bebidas'), 'Suco Natural', 'Suco natural da fruta. (Laranja, Limão ou Maracujá)', 7.9, '/demo/cafe-suco-natural.webp', 7),
((select id from public.cafe_categories where slug='bebidas'), 'Chocolate Quente', 'Chocolate quente cremoso.', 9.9, '/demo/cafe-chocolate-quente.webp', 8),
((select id from public.cafe_categories where slug='sobremesas'), 'Sobremesa do Dia', 'Sobremesa especial do dia.', 8.5, '/demo/cafe-sobremesa-do-dia.webp', 9);

insert into public.themes (slug, name, is_default, colors, decorations) values
('padrao', 'Padrão Supermercado Japão', true, '{"primary": "#E30613", "primaryDark": "#B0000E", "accent": "#FFD200", "accentInk": "#1A1A1A", "footer": "#0B1A2C"}'::jsonb, '{}'::jsonb),
('halloween', 'Halloween', false, '{"primary": "#E8590C", "primaryDark": "#7A2E0B", "accent": "#B197FC", "accentInk": "#1A1A1A", "footer": "#1B1026"}'::jsonb, '{"emoji": "🎃", "ribbon": "Halloween no Super Japão: ofertas de arrepiar!"}'::jsonb),
('natal', 'Natal', false, '{"primary": "#C8102E", "primaryDark": "#0F5132", "accent": "#F5C542", "accentInk": "#1A1A1A", "footer": "#0F2A1D"}'::jsonb, '{"emoji": "🎄", "ribbon": "Feliz Natal! Ofertas especiais para a sua ceia."}'::jsonb),
('pascoa', 'Páscoa', false, '{"primary": "#8E44AD", "primaryDark": "#5B2C6F", "accent": "#F9D56E", "accentInk": "#3B1F00", "footer": "#2D1B3A"}'::jsonb, '{"emoji": "🐰", "ribbon": "Feliz Páscoa! Chocolates e ovos com preços especiais."}'::jsonb),
('copa', 'Copa do Mundo', false, '{"primary": "#009C3B", "primaryDark": "#00632A", "accent": "#FFDF00", "accentInk": "#002776", "footer": "#002776"}'::jsonb, '{"emoji": "⚽", "ribbon": "Torcida Super Japão! Ofertas para assistir aos jogos."}'::jsonb),
('aniversario', 'Aniversário do Supermercado Japão', false, '{"primary": "#E30613", "primaryDark": "#8F0009", "accent": "#F2C230", "accentInk": "#1A1A1A", "footer": "#2A0A0A"}'::jsonb, '{"emoji": "🎉", "ribbon": "Aniversário Super Japão! Venha comemorar com a gente."}'::jsonb),
('ano-novo', 'Ano Novo', false, '{"primary": "#1F3A93", "primaryDark": "#0B1A4A", "accent": "#E9C46A", "accentInk": "#1A1A1A", "footer": "#070F2B"}'::jsonb, '{"emoji": "✨", "ribbon": "Feliz Ano Novo! Tudo para a sua festa."}'::jsonb),
('black-friday', 'Black Friday', false, '{"primary": "#111111", "primaryDark": "#000000", "accent": "#FFD200", "accentInk": "#111111", "footer": "#000000"}'::jsonb, '{"emoji": "🏷️", "ribbon": "Black Friday Super Japão: descontos imperdíveis!"}'::jsonb),
('novembro-azul', 'Novembro Azul', false, '{"primary": "#1565C0", "primaryDark": "#0D3C78", "accent": "#90CAF9", "accentInk": "#0D1B2A", "footer": "#0B1A2C"}'::jsonb, '{"emoji": "💙", "ribbon": "Novembro Azul: cuide da sua saúde."}'::jsonb),
('outubro-rosa', 'Outubro Rosa', false, '{"primary": "#D63384", "primaryDark": "#A61E63", "accent": "#FFC2DC", "accentInk": "#4A0E2B", "footer": "#3A0D24"}'::jsonb, '{"emoji": "🎀", "ribbon": "Outubro Rosa: a prevenção é o melhor cuidado."}'::jsonb),
('festa-junina', 'Festa Junina', false, '{"primary": "#D35400", "primaryDark": "#8E3200", "accent": "#F7DC6F", "accentInk": "#4A2500", "footer": "#3B1F0A"}'::jsonb, '{"emoji": "🌽", "ribbon": "Arraiá do Super Japão! Tudo para sua festa junina."}'::jsonb)
on conflict (slug) do nothing;

-- Exemplos de agendamento (horário de Brasília)
insert into public.theme_schedules (theme_id, starts_at, ends_at, priority) values
((select id from public.themes where slug='black-friday'), '2026-11-27 00:00-03', '2026-11-30 23:59-03', 10),
((select id from public.themes where slug='natal'),        '2026-12-01 00:00-03', '2026-12-26 23:59-03', 5),
((select id from public.themes where slug='ano-novo'),     '2026-12-27 00:00-03', '2027-01-02 23:59-03', 5);

-- Os dados iniciais não precisam aparecer no histórico.
delete from public.audit_logs;
