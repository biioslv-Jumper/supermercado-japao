import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { AdminShell } from "@/components/admin/shell";

export const metadata: Metadata = { title: { default: "Painel", template: "%s | Painel Supermercado Japão" }, robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { username } = await requireAdmin();
  return <AdminShell username={username}>{children}</AdminShell>;
}
