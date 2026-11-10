import Image from "next/image";
import { mediaUrl } from "@/lib/format";

/**
 * Logo oficial do Supermercado Japão.
 * O arquivo /public/brand/logo-supermercado-japao.png é a logo original
 * enviada pelo gerente, SEM nenhuma alteração (servida sem otimização
 * para não recomprimir os pixels). Se o admin enviar outra logo em
 * Configurações, ela substitui esta.
 */
export function Logo({ path, className, priority }: { path?: string | null; className?: string; priority?: boolean }) {
  const custom = mediaUrl(path);
  return (
    <Image
      src={custom ?? "/brand/logo-supermercado-japao.png"}
      alt="Japão Supermercado"
      width={264}
      height={112}
      unoptimized
      priority={priority}
      className={className}
    />
  );
}
