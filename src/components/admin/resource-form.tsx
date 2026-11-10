"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Save } from "lucide-react";
import { saveResource } from "@/app/admin/(painel)/actions";
import { FormMessage, SubmitButton } from "@/components/forms";
import { ICON_OPTIONS, Icon } from "@/components/icon";
import { slugify } from "@/lib/format";
import type { Field } from "@/lib/admin-resources";
import type { FormState } from "@/lib/auth-messages";
import { ImageUpload } from "./image-upload";

export type FormValues = Record<string, string | number | boolean>;
export type RelationOptions = Record<string, { value: string; label: string }[]>;

export function ResourceForm({
  resourceKey,
  id,
  fields,
  values,
  relations
}: {
  resourceKey: string;
  id: string | null;
  fields: Field[];
  values: FormValues;
  relations: RelationOptions;
}) {
  const action = saveResource.bind(null, resourceKey, id);
  const [state, formAction] = useActionState<FormState, FormData>(action, {});
  const [slugSource, setSlugSource] = useState<Record<string, string>>({});

  return (
    <form action={formAction} className="space-y-4">
      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((f) => (
            <div key={f.name} className={f.wide || f.type === "textarea" || f.type === "image" || f.type === "keyvalue" ? "md:col-span-2" : ""}>
              <FieldInput
                field={f}
                value={values[f.name]}
                options={relations[f.name]}
                slugPreview={f.type === "slug" ? slugSource[f.slugFrom ?? "name"] : undefined}
                onSourceChange={(v) => setSlugSource((s) => ({ ...s, [f.name]: v }))}
                isNew={!id}
              />
              {f.help && <p className="mt-1 text-xs text-slate-500">{f.help}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <SubmitButton className="btn bg-red-600 px-6 text-white hover:bg-red-700" pendingText="Salvando...">
          <Save className="h-4 w-4" /> Salvar
        </SubmitButton>
        <Link href={`/admin/${resourceKey}`} className="btn-outline">
          Cancelar
        </Link>
        <div className="flex-1">
          <FormMessage state={state} />
        </div>
      </div>
    </form>
  );
}

function FieldInput({
  field: f,
  value,
  options,
  slugPreview,
  onSourceChange,
  isNew
}: {
  field: Field;
  value: string | number | boolean | undefined;
  options?: { value: string; label: string }[];
  slugPreview?: string;
  onSourceChange: (v: string) => void;
  isNew: boolean;
}) {
  const id = `f-${f.name}`;
  const label = (
    <label htmlFor={id} className="label">
      {f.label} {f.required && <span className="text-red-600">*</span>}
    </label>
  );
  const str = value === undefined || value === null ? "" : String(value);

  switch (f.type) {
    case "boolean":
      return (
        <label htmlFor={id} className="flex cursor-pointer items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5 ring-1 ring-slate-200">
          <input id={id} name={f.name} type="checkbox" defaultChecked={!!value} className="h-5 w-5 accent-red-600" />
          <span className="text-sm font-semibold text-slate-700">{f.label}</span>
        </label>
      );
    case "textarea":
      return (
        <>
          {label}
          <textarea id={id} name={f.name} defaultValue={str} rows={4} className="input" placeholder={f.placeholder} />
        </>
      );
    case "keyvalue":
      return (
        <>
          {label}
          <textarea id={id} name={f.name} defaultValue={str} rows={4} className="input font-mono text-xs" placeholder="home.hero_highlight = ofertas de Natal" />
        </>
      );
    case "money":
      return (
        <>
          {label}
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">R$</span>
            <input id={id} name={f.name} defaultValue={str} inputMode="decimal" placeholder="0,00" className="input pl-9" required={f.required} />
          </div>
        </>
      );
    case "number":
      return (
        <>
          {label}
          <input id={id} name={f.name} type="number" step={1} defaultValue={str} className="input" />
        </>
      );
    case "select":
    case "relation":
      return (
        <>
          {label}
          <select id={id} name={f.name} defaultValue={str} className="input" required={f.required}>
            {!f.required || f.type === "relation" ? <option value="">{f.required ? "Selecione..." : "— Nenhum —"}</option> : null}
            {(f.type === "select" ? f.options : options)?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </>
      );
    case "icon":
      return <IconPicker id={id} name={f.name} label={label} value={str} />;
    case "image":
      return (
        <>
          <span className="label">{f.label}</span>
          <ImageUpload name={f.name} folder={f.folder ?? "campaigns"} value={str} hint={f.imageHint} />
        </>
      );
    case "datetime":
      return (
        <>
          {label}
          <input id={id} name={f.name} type="datetime-local" defaultValue={str} className="input" required={f.required} />
        </>
      );
    case "color":
      return (
        <>
          {label}
          <input id={id} name={f.name} type="color" defaultValue={str || "#000000"} className="h-10 w-full cursor-pointer rounded-lg border border-slate-300 bg-white p-1" />
        </>
      );
    case "slug":
      return (
        <>
          {label}
          <input id={id} name={f.name} defaultValue={str} placeholder={isNew ? slugify(slugPreview ?? "") || "gerado automaticamente" : ""} className="input font-mono text-xs" />
        </>
      );
    case "url":
      return (
        <>
          {label}
          <input id={id} name={f.name} defaultValue={str} placeholder={f.placeholder ?? "https://..."} className="input" />
        </>
      );
    default:
      return (
        <>
          {label}
          <input
            id={id}
            name={f.name}
            defaultValue={str}
            placeholder={f.placeholder}
            className="input"
            required={f.required}
            maxLength={300}
            onChange={(e) => onSourceChange(e.target.value)}
          />
        </>
      );
  }
}

function IconPicker({ id, name, label, value }: { id: string; name: string; label: React.ReactNode; value: string }) {
  const [v, setV] = useState(value);
  return (
    <>
      {label}
      <input type="hidden" name={name} value={v} id={id} />
      <div className="flex flex-wrap gap-1.5 rounded-lg bg-slate-50 p-2 ring-1 ring-slate-200">
        {ICON_OPTIONS.map((ic) => (
          <button
            key={ic}
            type="button"
            onClick={() => setV(ic)}
            title={ic}
            aria-label={`Ícone ${ic}`}
            aria-pressed={v === ic}
            className={`flex h-9 w-9 items-center justify-center rounded-md ${v === ic ? "bg-red-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"}`}
          >
            <Icon name={ic} className="h-5 w-5" />
          </button>
        ))}
      </div>
    </>
  );
}
