import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { getSite } from "@/lib/site";
import { FallingEffect, Garland } from "@/components/site/theme-effects";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { theme, preview } = await getSite();
  const ribbon = theme.decorations?.ribbon;
  const emoji = theme.decorations?.emoji;

  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2">
        Pular para o conteúdo
      </a>
      {(preview.content || preview.theme) && (
        <div className="bg-amber-400 px-4 py-2 text-center text-sm font-bold text-amber-950">
          Modo pré-visualização {preview.theme ? `(tema: ${preview.theme})` : "(textos em rascunho)"} — somente você está vendo.{" "}
          <Link href="/admin/preview/sair" className="underline" prefetch={false}>
            Sair da pré-visualização
          </Link>
        </div>
      )}
      {ribbon && (
        <div className="bg-accent px-4 py-1.5 text-center text-sm font-bold text-accent-ink">
          {emoji} {ribbon} {emoji}
        </div>
      )}
      <Header />
      <Garland kind={theme.decorations?.garland} />
      <FallingEffect effect={theme.decorations?.effect} emojis={theme.decorations?.hero || theme.decorations?.emoji} />
      <main id="conteudo">{children}</main>
      <Footer />
    </>
  );
}
