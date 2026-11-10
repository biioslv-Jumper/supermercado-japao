"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { FormMessage, SubmitButton } from "@/components/forms";
import { ImageUpload } from "@/components/admin/image-upload";
import type { FormState } from "@/lib/auth-messages";
import { saveSettings } from "./actions";

type V = Record<string, string | null>;

export function SettingsForm({ values }: { values: V }) {
  const [state, action] = useActionState<FormState, FormData>(saveSettings, {});
  const input = (name: string, label: string, placeholder?: string, help?: string) => (
    <div>
      <label htmlFor={name} className="label">{label}</label>
      <input id={name} name={name} defaultValue={values[name] ?? ""} placeholder={placeholder} className="input" />
      {help && <p className="mt-1 text-xs text-slate-500">{help}</p>}
    </div>
  );

  return (
    <form action={action} className="space-y-4">
      <Section title="Identidade">
        {input("store_name", "Nome do supermercado")}
        <div className="md:col-span-2">
          <span className="label">Logo</span>
          <ImageUpload
            name="logo_path"
            folder="branding"
            value={values.logo_path ?? ""}
            hint="Deixe vazio para usar a logo oficial original do Supermercado Japão (recomendado)."
          />
        </div>
        <div className="md:col-span-2">
          <span className="label">Favicon (ícone da aba do navegador)</span>
          <ImageUpload name="favicon_path" folder="branding" value={values.favicon_path ?? ""} hint="Imagem quadrada PNG, 512 × 512 px. Vazio = ícone padrão." />
        </div>
      </Section>

      <Section title="Contato">
        {input("phone", "Telefone", "(11) 4198-7070")}
        {input("whatsapp", "WhatsApp", "(11) 94016-3200", "Usado nos botões \"Chamar no WhatsApp\" e \"Saiba mais\".")}
        {input("email", "E-mail", "contato@superjapao.com.br")}
      </Section>

      <Section title="Endereço e horário">
        {input("address", "Endereço (rua, número, bairro)")}
        {input("address_city", "Cidade - UF, CEP")}
        <div className="md:col-span-2">{input("maps_url", "Link do Google Maps (botão Ver no mapa)", "https://maps.google.com/...")}</div>
        <div className="md:col-span-2">
          <label htmlFor="opening_hours" className="label">Horário de funcionamento da loja</label>
          <textarea id="opening_hours" name="opening_hours" rows={3} defaultValue={values.opening_hours ?? ""} placeholder={"Segunda a sábado: 7h às 22h\nDomingos e feriados: 7h às 20h"} className="input" />
        </div>
        <div className="md:col-span-2">
          <span className="label">Foto da loja (seção Nossa Loja)</span>
          <ImageUpload name="store_photo_path" folder="institutional" value={values.store_photo_path ?? ""} hint="Foto horizontal da fachada." />
        </div>
      </Section>

      <Section title="Redes sociais">
        {input("instagram_url", "Instagram", "https://instagram.com/...")}
        {input("facebook_url", "Facebook", "https://facebook.com/...")}
        {input("youtube_url", "YouTube", "https://youtube.com/...")}
        {input("tiktok_url", "TikTok", "https://tiktok.com/@...")}
      </Section>

      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <SubmitButton className="btn bg-red-600 px-6 text-white hover:bg-red-700" pendingText="Salvando...">
          <Save className="h-4 w-4" /> Salvar configurações
        </SubmitButton>
        <div className="flex-1">
          <FormMessage state={state} />
        </div>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <legend className="px-1 text-lg font-extrabold">{title}</legend>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </fieldset>
  );
}
