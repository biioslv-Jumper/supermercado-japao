"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Check, ImagePlus, Loader2, RefreshCw, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { mediaUrl } from "@/lib/format";
import { registerMedia } from "@/app/admin/(painel)/actions";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX = 5 * 1024 * 1024;

/**
 * Envio de imagem em 4 passos: selecionar → ver prévia → confirmar envio → salvar o formulário.
 * O arquivo vai para o Supabase Storage (bucket site-media/<pasta>/).
 * O caminho fica num campo oculto e só é gravado ao salvar o formulário.
 */
export function ImageUpload({ name, folder, value, hint }: { name: string; folder: string; value: string; hint?: string }) {
  const [path, setPath] = useState(value);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const pick = (f: File | undefined) => {
    setError(null);
    if (!f) return;
    if (!ALLOWED.includes(f.type)) return setError("Formato não permitido. Use JPG, JPEG, PNG ou WEBP.");
    if (f.size > MAX) return setError("Arquivo maior que 5 MB. Reduza o tamanho da imagem.");
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStatus("idle");
  };

  const upload = async () => {
    if (!file) return;
    setStatus("uploading");
    setError(null);
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const newPath = `${folder}/${new Date().toISOString().slice(0, 10)}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    const supabase = createClient();
    const { error: upErr } = await supabase.storage.from("site-media").upload(newPath, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
    if (upErr) {
      setStatus("idle");
      setError("Não foi possível enviar a imagem. Verifique sua conexão e se você está logado como administrador.");
      return;
    }
    await registerMedia(newPath, folder, file.type, file.size).catch(() => undefined);
    setPath(newPath);
    setFile(null);
    setStatus("done");
  };

  const cancel = () => {
    setFile(null);
    setPreview(null);
    setStatus("idle");
    if (input.current) input.current.value = "";
  };

  const current = mediaUrl(path);

  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
      <input type="hidden" name={name} value={path} />
      <div className="flex flex-wrap items-start gap-4">
        <div className="relative flex h-32 w-48 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">
          {file && preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Prévia da nova imagem" className="h-full w-full object-contain" />
          ) : current ? (
            <Image src={current} alt="Imagem atual" fill sizes="192px" className="object-contain" />
          ) : (
            <ImagePlus className="h-10 w-10 text-slate-300" aria-hidden="true" />
          )}
          {file && <span className="absolute left-1 top-1 rounded bg-amber-400 px-1.5 text-[10px] font-bold">PRÉVIA</span>}
        </div>

        <div className="flex-1 space-y-2 text-sm">
          {hint && <p className="text-slate-500">{hint}</p>}
          <input ref={input} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="sr-only" id={`file-${name}`} onChange={(e) => pick(e.target.files?.[0])} />

          {!file && (
            <div className="flex flex-wrap gap-2">
              <label htmlFor={`file-${name}`} className="btn-outline cursor-pointer py-1.5">
                {path ? <RefreshCw className="h-4 w-4" /> : <ImagePlus className="h-4 w-4" />} {path ? "Substituir imagem" : "Selecionar imagem"}
              </label>
              {path && (
                <button type="button" onClick={() => { setPath(""); setStatus("idle"); }} className="btn py-1.5 text-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" /> Remover
                </button>
              )}
            </div>
          )}

          {file && (
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={upload} disabled={status === "uploading"} className="btn bg-green-600 py-1.5 text-white hover:bg-green-700">
                {status === "uploading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Confirmar envio
              </button>
              <button type="button" onClick={cancel} disabled={status === "uploading"} className="btn-outline py-1.5">
                <X className="h-4 w-4" /> Cancelar
              </button>
            </div>
          )}

          {status === "done" && <p className="font-semibold text-green-700">Imagem enviada! Agora clique em &quot;Salvar&quot; no fim do formulário.</p>}
          {!path && !file && <p className="text-slate-500">Nenhuma imagem selecionada.</p>}
          {error && <p role="alert" className="font-semibold text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
