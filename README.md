# Supermercado Japão — Site e Painel Administrativo

Site oficial do **Supermercado Japão** com painel administrativo próprio (CMS), login de clientes (e-mail/senha e Google), banco de dados, imagens e segurança, tudo usando **Next.js + Supabase**, pronto para publicar na **Vercel**.

> Este guia foi escrito para quem não é programador. Siga os passos na ordem.

---

## 1. O que existe no projeto

**Site público**
- Início (banner, Acontece no Japão, atalhos, Ofertas da Semana, Destaque da Semana, Novidades, Nossa Loja, Serviços, Setores, Institucional e Contato)
- Ofertas, Produtos (com busca, categorias, ordenação e página do produto)
- Setores, Serviços, Cafeteria (cardápio com botão **Ver imagens**), Cartão Japão, APP (em breve), Institucional e Contato
- Entrar, Criar conta, Continuar com Google, Recuperar senha, Minha Conta
- **Sem carrinho / sem checkout** (não solicitado)

**Painel administrativo** (`/admin`)
- Dashboard, Produtos, Categorias e Setores, Ofertas (com datas e expiração automática), Destaque da Semana, Novidades, Banners, Serviços, Cafeteria (itens e categorias), Conteúdo do site (rascunho → pré-visualização → publicação), Temas, Agendamentos de temas, Configurações, Histórico de alterações e Minha conta de acesso.
- **Acesso discreto:** clique em **"© 2026 Supermercado Japão"** no rodapé do site → abre `/admin/login`. O link continua funcionando mesmo que o texto do rodapé seja alterado.

**Logo:** o arquivo `public/brand/logo-supermercado-japao.png` é a logo original enviada pelo gerente, **sem nenhuma alteração** (é servida sem recompressão).

---

## 2. Tecnologias

| Parte | Tecnologia |
|---|---|
| Site e painel | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS |
| Banco de dados | Supabase (PostgreSQL) com Row Level Security |
| Login | Supabase Auth (e-mail/senha + Google OAuth) |
| Imagens | Supabase Storage (bucket `site-media`) |
| Hospedagem | Vercel |

---

## 3. Estrutura de pastas

```
public/
  brand/            → logo oficial e ícones
  demo/             → imagens demonstrativas (recortadas dos layouts aprovados)
src/
  app/(site)/       → páginas públicas (início, ofertas, setores, cafeteria...)
  app/(site)/(conta)/ → entrar, cadastro, recuperar senha, minha conta
  app/admin/        → painel administrativo (login + telas)
  app/auth/         → retorno do Google / e-mails e logout
  components/       → componentes reutilizáveis (site e admin)
  lib/              → acesso ao Supabase, consultas, textos padrão, utilitários
  lib/admin-resources.ts → configuração de todas as telas de cadastro do painel
  middleware.ts     → renova a sessão e protege /admin e /minha-conta
supabase/migrations/ → TODA a estrutura do banco (versionada no GitHub)
```

---

## 4. Banco de dados (Supabase)

Projeto Supabase: **supermercado-japao** (região São Paulo).
URL do projeto: `https://btpyliitcwneqqonuwfg.supabase.co`

### Tabelas
| Tabela | Para que serve |
|---|---|
| `profiles` | Dados dos clientes (nome, telefone, avatar). **Nunca guarda senha.** |
| `admins` | O administrador e seu nome de usuário de login |
| `categories` | Categorias e cards da página Setores |
| `products` | Produtos (com campos `external_source`/`external_id` para o futuro ERP) |
| `offers` | Ofertas com preço promocional e período |
| `highlights` | Destaque da Semana |
| `news` | Novidades |
| `banners` | Banners (carrossel, faixa 728×110, topos das páginas) |
| `services` | Serviços (Lotérica, Chaveiro...) |
| `cafe_categories`, `cafe_items` | Cardápio da cafeteria |
| `site_content` / `site_content_drafts` | Todos os textos do site (publicados / rascunhos) |
| `site_settings` | Nome, logo, favicon, telefones, endereço, redes sociais |
| `themes` / `theme_schedules` | Temas sazonais e seus agendamentos |
| `media` | Registro das imagens enviadas |
| `audit_logs` | Histórico de alterações (gravado automaticamente) |

### Automatizações no banco
- **Histórico automático:** qualquer criação/alteração/exclusão feita no painel gera uma linha em `audit_logs` (ex.: "Produto Café alterado.").
- **Ofertas que expiram sozinhas:** uma rotina (`pg_cron`, a cada 10 min) desativa ofertas, destaques, banners e agendamentos vencidos. O site também já esconde itens vencidos na mesma hora.
- **Preço promocional do produto** é calculado a partir das ofertas ativas (uma única fonte da verdade).
- **Tema atual:** a função `current_theme()` escolhe o tema agendado vigente; fora dos períodos volta ao tema padrão.

### Migrations
Todas as mudanças de estrutura estão em `supabase/migrations/` e **já foram aplicadas** no projeto Supabase:
1. `..._core_schema.sql` — tabelas
2. `..._security_rls_storage.sql` — RLS, Storage, histórico, rotinas
3. `..._seed_demo_data.sql` — dados demonstrativos (produtos, textos, temas...)

Para criar o banco em outro projeto Supabase: abra **SQL Editor** e rode os 3 arquivos na ordem (ou use a Supabase CLI: `supabase db push`).

> O usuário administrador **não** fica em migration (para não colocar senha no GitHub). Ele foi criado diretamente no Supabase. Veja a seção 7.

### Segurança (RLS)
- **Público:** só lê produtos/categorias/serviços **ativos**, ofertas/banners/destaques **vigentes**, textos publicados e configurações.
- **Cliente logado:** lê e edita **somente o próprio perfil**.
- **Administrador:** cria, edita, exclui e publica. A checagem é feita **no banco** (função `is_admin()`), nunca só no navegador.
- Rascunhos, agendamentos, mídia e histórico **não são públicos**.
- Ninguém consegue se tornar admin pelo site (não existe permissão de inserir em `admins`).
- Avisos do Supabase Advisor sobre `is_admin()` e `current_theme()` serem executáveis publicamente são **intencionais**: a primeira só responde "sim/não" para o próprio usuário e a segunda só devolve o tema que já aparece no site.

### Storage (imagens)
Bucket `site-media` (público para leitura, máx. 5 MB, só JPG/JPEG/PNG/WEBP), organizado em pastas:
`products/`, `banners/`, `branding/` (logo/favicon), `campaigns/`, `institutional/`, `sectors/`, `services/`, `cafe/`, `news/`, `highlights/`.
Somente o administrador consegue enviar, substituir ou remover arquivos. Ao substituir uma imagem no painel, a antiga é apagada automaticamente.

---

## 5. Variáveis de ambiente

Copie `.env.example` para `.env.local` (no seu computador) e preencha. **Nunca envie `.env.local` ao GitHub** (ele já está no `.gitignore`).

| Variável | Onde encontrar | Pública? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → Data API → Project URL | Sim |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API Keys → `anon` / `publishable` | Sim (protegida pelo RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API Keys → `service_role` / `secret` | **NÃO — somente servidor** |
| `NEXT_PUBLIC_SITE_URL` | Endereço do site (`http://localhost:3000` ou o domínio) | Sim |

A `SUPABASE_SERVICE_ROLE_KEY` é usada **apenas** no login do admin (para achar o e-mail interno a partir do nome de usuário). Ela nunca vai para o navegador.

---

## 6. Rodar no seu computador

Pré-requisito: [Node.js 20 ou superior](https://nodejs.org).

```bash
npm install
cp .env.example .env.local   # depois edite o .env.local
npm run dev
```
Abra http://localhost:3000

Para conferir se tudo compila: `npm run build`.

---

## 7. Login do administrador

- Endereço: `/admin/login` (ou clique em "© 2026 Supermercado Japão" no rodapé)
- Usuário e senha: entregues em particular ao responsável (não ficam no GitHub). **Troque a senha no primeiro acesso** em **Painel → Minha conta de acesso**.

Como funciona por dentro (sem sistema de senha paralelo):
- O Supabase Auth trabalha com e-mail. O admin tem um e-mail interno e o nome de usuário fica na tabela `admins`.
- No login, o servidor troca o usuário pelo e-mail e autentica normalmente no Supabase Auth (senha criptografada com bcrypt).
- Em **Minha conta de acesso** é possível trocar usuário, senha e o e-mail de recuperação (recomendado colocar um e-mail real).

---

## 8. Login com Google (Google OAuth + Supabase Auth)

O código já está pronto (botão **Continuar com Google**). Falta só cadastrar as credenciais — isso precisa ser feito por você, porque exige acesso à sua conta Google.

### 8.1 Google Cloud Console
1. Acesse https://console.cloud.google.com e crie (ou escolha) um projeto, ex.: "Supermercado Japão".
2. Menu **APIs e serviços → Tela de consentimento OAuth** (ou **Google Auth Platform → Branding**):
   - Tipo de usuário: **Externo**
   - Nome do app: `Supermercado Japão`, e-mail de suporte, logo (opcional)
   - Domínios autorizados: `supabase.co` e o domínio oficial do site
   - Escopos: `openid`, `.../auth/userinfo.email`, `.../auth/userinfo.profile`
   - Publique o app (status "Em produção") para qualquer cliente conseguir entrar.
3. Menu **APIs e serviços → Credenciais → Criar credenciais → ID do cliente OAuth** (ou **Google Auth Platform → Clients → Create client**):
   - Tipo de aplicativo: **Aplicativo da Web**
   - **Origens JavaScript autorizadas:**
     - `http://localhost:3000`
     - `https://SEU-PROJETO.vercel.app` (endereço que a Vercel gerar)
     - `https://www.SEU-DOMINIO.com.br` (quando publicar no domínio oficial)
   - **URIs de redirecionamento autorizados:**
     - `https://btpyliitcwneqqonuwfg.supabase.co/auth/v1/callback`
4. Clique em **Criar** e copie o **ID do cliente** e a **Chave secreta do cliente**.

### 8.2 Supabase
1. Supabase → **Authentication → Sign In / Providers → Google** → ative.
2. Cole o **Client ID** e o **Client Secret**. Salve.
   (O Client Secret fica **somente** no Supabase — nunca no código nem no GitHub.)
3. Supabase → **Authentication → URL Configuration**:
   - **Site URL:** o endereço principal do site (ex.: `https://www.SEU-DOMINIO.com.br`; enquanto testa, a URL da Vercel)
   - **Redirect URLs** (adicione todas):
     - `http://localhost:3000/**`
     - `https://SEU-PROJETO.vercel.app/**`
     - `https://www.SEU-DOMINIO.com.br/**`

### 8.3 Testar
Abra o site → **Entrar** → **Continuar com Google** → escolha a conta → você deve cair em **Minha Conta** com nome, e-mail e foto do Google.

---

## 9. E-mails de cadastro e recuperação de senha

O Supabase envia os e-mails automaticamente. No plano gratuito há limite de poucos e-mails por hora. Para uso real, configure um SMTP próprio em **Authentication → Emails → SMTP Settings** (ex.: o e-mail do domínio da empresa).
Opcional: traduza os modelos em **Authentication → Emails → Templates** para português.

---

## 10. Publicar na Vercel

1. Acesse https://vercel.com e entre com o GitHub.
2. **Add New → Project** → importe o repositório `supermercado-japao`.
3. Em **Environment Variables**, cadastre as 4 variáveis da seção 5 (`NEXT_PUBLIC_SITE_URL` = a URL da Vercel por enquanto).
4. Clique em **Deploy**.
5. Teste tudo na URL `*.vercel.app` **antes** de mexer no domínio oficial.
6. Domínio oficial: **somente depois da aprovação**, em Vercel → Project → Settings → Domains. O HTTPS (SSL) é automático. Atualize `NEXT_PUBLIC_SITE_URL`, a Site URL do Supabase e as origens do Google.

> O site antigo não deve ser desligado nem o DNS alterado até o novo estar testado e aprovado.

---

## 11. Futuro: integração com Hipcom/ERP

Nada foi integrado agora (de propósito). A estrutura já está preparada:
- `products` e `categories` têm `external_source` e `external_id` (código no ERP, único por origem), além de `stock_quantity` e `synced_at`.
- O preço promocional vem da tabela `offers`, que pode ser alimentada por uma sincronização.
- Uma futura rotina (ex.: Supabase Edge Function agendada) poderá fazer *upsert* por `external_id` sem mudar o site nem o painel.

---

## 12. Checklist antes de publicar

- [ ] `npm run build` sem erros
- [ ] Variáveis cadastradas na Vercel (service role **sem** `NEXT_PUBLIC_`)
- [ ] Login do admin funcionando e **senha inicial trocada**
- [ ] Google OAuth testado
- [ ] Cadastro, confirmação de e-mail e recuperação de senha testados
- [ ] Supabase → Advisors sem alertas novos
- [ ] Textos, telefones, horários e redes sociais revisados no painel
- [ ] Produtos demonstrativos substituídos pelos reais
- [ ] Testado em celular, tablet e computador
