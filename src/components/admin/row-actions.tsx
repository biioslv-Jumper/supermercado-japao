"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Loader2, MonitorPlay, Pencil, Star, Trash2 } from "lucide-react";
import { deleteResource, moveResource, setDefaultTheme, toggleActive } from "@/app/admin/(painel)/actions";
import { ConfirmDialog } from "./confirm-dialog";

export function RowActions({
  resourceKey,
  id,
  label,
  isActive,
  hasActive,
  sortable,
  isDefaultTheme,
  canSetDefault,
  previewSlug
}: {
  resourceKey: string;
  id: string;
  label: string;
  isActive?: boolean;
  hasActive?: boolean;
  sortable?: boolean;
  isDefaultTheme?: boolean;
  canSetDefault?: boolean;
  previewSlug?: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = (fn: () => Promise<unknown>) =>
    start(async () => {
      await fn();
      router.refresh();
    });

  const btn = "rounded-md p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40";

  return (
    <div className="flex items-center justify-end gap-0.5">
      {pending && <Loader2 className="h-4 w-4 animate-spin text-slate-400" aria-label="Processando" />}
      {sortable && (
        <>
          <button type="button" className={btn} disabled={pending} onClick={() => run(() => moveResource(resourceKey, id, "up"))} title="Mover para cima" aria-label={`Mover ${label} para cima`}>
            <ArrowUp className="h-4 w-4" />
          </button>
          <button type="button" className={btn} disabled={pending} onClick={() => run(() => moveResource(resourceKey, id, "down"))} title="Mover para baixo" aria-label={`Mover ${label} para baixo`}>
            <ArrowDown className="h-4 w-4" />
          </button>
        </>
      )}
      {previewSlug && (
        <a href={`/admin/preview/tema?slug=${encodeURIComponent(previewSlug)}`} target="_blank" className={btn} title="Pré-visualizar o site com este tema" aria-label={`Pré-visualizar ${label}`}>
          <MonitorPlay className="h-4 w-4" />
        </a>
      )}
      {canSetDefault && !isDefaultTheme && (
        <button type="button" className={btn} disabled={pending} onClick={() => run(() => setDefaultTheme(id))} title="Definir como tema padrão" aria-label={`Definir ${label} como padrão`}>
          <Star className="h-4 w-4" />
        </button>
      )}
      {hasActive && !isDefaultTheme && (
        <button
          type="button"
          className={btn}
          disabled={pending}
          onClick={() => run(() => toggleActive(resourceKey, id))}
          title={isActive ? "Desativar (ocultar do site)" : "Ativar (mostrar no site)"}
          aria-label={isActive ? `Desativar ${label}` : `Ativar ${label}`}
        >
          {isActive ? <Eye className="h-4 w-4 text-green-600" /> : <EyeOff className="h-4 w-4 text-slate-400" />}
        </button>
      )}
      <Link href={`/admin/${resourceKey}/${id}`} className={btn} title="Editar" aria-label={`Editar ${label}`}>
        <Pencil className="h-4 w-4" />
      </Link>
      {!isDefaultTheme && (
        <button type="button" className={`${btn} hover:bg-red-50 hover:text-red-600`} disabled={pending} onClick={() => setConfirm(true)} title="Excluir" aria-label={`Excluir ${label}`}>
          <Trash2 className="h-4 w-4" />
        </button>
      )}
      <ConfirmDialog
        open={confirm}
        title="Excluir definitivamente?"
        message={
          <>
            Você está excluindo <strong>{label}</strong>. Esta ação não pode ser desfeita. Se quiser apenas esconder do site, use o botão de
            ativar/desativar.
            {error && <span className="mt-2 block text-red-600">{error}</span>}
          </>
        }
        confirmLabel="Sim, excluir"
        onCancel={() => {
          setConfirm(false);
          setError(null);
        }}
        onConfirm={() =>
          start(async () => {
            const res = await deleteResource(resourceKey, id);
            if (res && "error" in res && res.error) {
              setError(res.error);
              return;
            }
            setConfirm(false);
            router.refresh();
          })
        }
        pending={pending}
      />
    </div>
  );
}
