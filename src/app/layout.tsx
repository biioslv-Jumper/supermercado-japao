import type { Metadata } from "next";
import { Baloo_2, Kaushan_Script, Nunito } from "next/font/google";
import { getSite, themeCssVars } from "@/lib/site";
import { mediaUrl } from "@/lib/format";
import "./globals.css";

const display = Baloo_2({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display" });
const body = Nunito({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--font-body" });
const script = Kaushan_Script({ subsets: ["latin"], weight: "400", variable: "--font-script" });

export async function generateMetadata(): Promise<Metadata> {
  const { settings, content } = await getSite();
  const favicon = mediaUrl(settings.favicon_path);
  return {
    title: { default: settings.store_name, template: `%s | ${settings.store_name}` },
    description: content["footer.tagline"],
    ...(favicon ? { icons: { icon: favicon } } : {})
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { theme } = await getSite();
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable} ${script.variable}`}>
      <body style={parseStyle(themeCssVars(theme))} data-theme={theme.slug}>
        {children}
      </body>
    </html>
  );
}

function parseStyle(css: string): React.CSSProperties {
  const style: Record<string, string> = {};
  for (const part of css.split(";")) {
    const [k, v] = part.split(":");
    if (k && v) style[k.trim()] = v.trim();
  }
  return style as React.CSSProperties;
}
