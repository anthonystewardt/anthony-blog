"use client";

import { ArrowRight, BookOpenCheck, CheckCircle2, Code2, Loader2, Mail, Sparkles, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { toast } from "sonner";

export default function SubscriberForm() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"confirmation" | "active" | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", close);
    };
  }, [open]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/suscriber", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, consent }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setResult(data.status === "active" ? "active" : "confirmation");
      data.status === "active" ? toast.info(data.message) : toast.success(data.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo completar la suscripción");
    } finally {
      setLoading(false);
    }
  }

  return <>
    <button type="button" onClick={() => setOpen(true)} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:-translate-y-0.5 hover:bg-violet-500 sm:w-auto">
      Unirme a la comunidad <ArrowRight className="size-4" />
    </button>

    {open && <div className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-zinc-950/75 p-2 backdrop-blur-md sm:p-4" onMouseDown={event => event.target === event.currentTarget && setOpen(false)}>
      <section role="dialog" aria-modal="true" aria-labelledby={titleId} className="relative w-full max-w-4xl max-h-[calc(100dvh-1rem)] overflow-y-auto rounded-2xl border border-white/10 bg-background text-foreground shadow-2xl shadow-violet-950/40 sm:max-h-[calc(100dvh-2rem)] sm:rounded-[28px]">
        <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar" className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full border border-white/10 bg-black/25 text-white/80 backdrop-blur transition hover:bg-black/45 hover:text-white sm:right-4 sm:top-4 sm:size-9"><X className="size-4" /></button>
        <div className="grid md:grid-cols-[.9fr_1.1fr]">
          <div className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-indigo-700 to-sky-600 p-6 text-white sm:p-10">
            <div className="absolute -left-20 -top-20 size-56 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute -bottom-24 -right-20 size-64 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold"><Sparkles className="size-3.5" /> Comunidad educativa</span>
              <h2 id={titleId} className="mt-5 pr-9 text-2xl font-black leading-tight sm:mt-8 sm:pr-0 sm:text-4xl">Aprende, construye y avanza acompañado.</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/75">Recibe solamente contenido nuevo y útil. Sin ruido, sin cadenas y con salida en un clic.</p>
              <div className="mt-6 hidden space-y-3 sm:block">
                <p className="flex items-center gap-3 text-sm"><span className="grid size-8 place-items-center rounded-lg bg-white/10"><BookOpenCheck className="size-4" /></span> Nuevas clases y rutas de aprendizaje</p>
                <p className="flex items-center gap-3 text-sm"><span className="grid size-8 place-items-center rounded-lg bg-white/10"><Code2 className="size-4" /></span> Ejemplos prácticos y apuntes</p>
                <p className="flex items-center gap-3 text-sm"><span className="grid size-8 place-items-center rounded-lg bg-white/10"><Mail className="size-4" /></span> Avisos únicamente al publicar</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-10">
            {!result ? <>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-violet-500">Tu próxima lección te espera</p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight">Únete gratis a la comunidad</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Escribe tu mejor correo. Te enviaremos un enlace para confirmar que realmente eres tú.</p>
              <form onSubmit={submit} className="mt-7 space-y-4">
                <div className="relative"><Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input type="email" required autoFocus value={email} onChange={event => setEmail(event.target.value)} placeholder="tu@email.com" className="w-full rounded-xl border bg-background py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10" /></div>
                <label className="flex items-start gap-3 rounded-xl border bg-muted/35 p-3.5 text-left text-xs leading-relaxed text-muted-foreground"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} className="mt-0.5 size-4 accent-violet-600" required /><span>Acepto recibir nuevas clases y contenidos por correo. Puedo cancelar la suscripción cuando quiera.</span></label>
                <button disabled={loading} className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-violet-600 px-5 text-sm font-bold text-white transition hover:bg-violet-500 disabled:opacity-60">{loading ? <Loader2 className="size-4 animate-spin" /> : <>Quiero ser parte <ArrowRight className="ml-2 size-4" /></>}</button>
              </form>
              <p className="mt-5 text-center text-[11px] text-muted-foreground">Privacidad protegida · Sin spam · Cancela cuando quieras</p>
            </> : <div className="py-8 text-center"><span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-500/10"><CheckCircle2 className="size-8 text-emerald-500" /></span><h3 className="mt-5 text-2xl font-bold">{result === "active" ? "¡Ya eres parte!" : "¡Ya casi estás dentro!"}</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{result === "active" ? "Este correo ya está confirmado y recibirá las próximas publicaciones." : "Revisa tu correo y confirma la suscripción para comenzar a recibir nuevas lecciones."}</p><button type="button" onClick={() => setOpen(false)} className="mt-6 rounded-xl border px-5 py-2.5 text-sm font-semibold hover:bg-muted">Entendido</button></div>}
          </div>
        </div>
      </section>
    </div>}
  </>;
}
