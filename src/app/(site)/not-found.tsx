import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-site mt-10 text-center">
      <p className="font-display text-6xl font-extrabold text-brand">404</p>
      <h1 className="mt-2 text-2xl font-bold">Página não encontrada</h1>
      <p className="text-slate-600">O endereço pode ter mudado ou o item não está mais disponível.</p>
      <Link href="/" className="btn-brand mt-5">
        Voltar para o início
      </Link>
    </div>
  );
}
