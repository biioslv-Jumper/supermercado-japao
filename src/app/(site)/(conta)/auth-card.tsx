export function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="container-site flex justify-center py-10">
      <div className="card w-full max-w-md p-6 sm:p-8">
        <h1 className="font-display text-3xl font-extrabold">{title}</h1>
        {subtitle && <p className="mb-5 mt-1 text-slate-600">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
