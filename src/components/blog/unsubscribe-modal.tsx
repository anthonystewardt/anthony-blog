"use client";

import { ArrowLeft, CheckCircle2, Loader2, LogOut, MailX, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function UnsubscribeModal({ token }: { token?: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ message: string; emailSent: boolean; already?: boolean } | null>(null);
  const [error, setError] = useState(!token ? "Este enlace de cancelación no es válido." : "");

  async function unsubscribe() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/subscribers/unsubscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setResult({ message: data.message, emailSent: data.emailSent, already: data.status === "inactive" });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo cancelar la suscripción");
    } finally { setLoading(false); }
  }

  return <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-zinc-950/80 p-4 backdrop-blur-md">
    <section role="dialog" aria-modal="true" aria-labelledby="unsubscribe-title" className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-white/10 bg-background shadow-2xl shadow-black/50">
      <Link href="/blog" aria-label="Cerrar" className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full border bg-background/70 text-muted-foreground backdrop-blur hover:text-foreground"><X className="size-4" /></Link>
      <div className="border-b bg-gradient-to-br from-violet-500/15 via-background to-sky-500/10 p-8 text-center sm:p-10">
        <span className={`mx-auto grid size-16 place-items-center rounded-2xl ${result ? "bg-emerald-500/10 text-emerald-500" : "bg-violet-500/10 text-violet-500"}`}>{result ? <CheckCircle2 className="size-8" /> : <MailX className="size-8" />}</span>
        <h1 id="unsubscribe-title" className="mt-5 text-3xl font-black tracking-tight">{result ? "Salida confirmada" : "¿Quieres salir de la comunidad?"}</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{result ? result.message : "Si confirmas, dejarás de recibir nuevas clases, recursos y actualizaciones de contenido por correo."}</p>
      </div>
      <div className="p-7 sm:p-8">
        {!result ? <>
          <div className="rounded-xl border bg-muted/35 p-4 text-sm text-muted-foreground"><ShieldCheck className="mr-2 inline size-4 text-emerald-500" />La baja es inmediata. No eliminaremos información administrativa ni afectará tu acceso al contenido público.</div>
          {error && <p role="alert" className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500">{error}</p>}
          <div className="mt-6 grid gap-3 sm:grid-cols-2"><Link href="/blog" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border text-sm font-semibold hover:bg-muted"><ArrowLeft className="size-4" /> Seguir en la comunidad</Link><button type="button" onClick={unsubscribe} disabled={loading || !token} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50">{loading ? <Loader2 className="size-4 animate-spin" /> : <><LogOut className="size-4" /> Sí, salir</>}</button></div>
        </> : <><div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center text-sm text-muted-foreground">{result.already ? "Tu correo ya estaba fuera de la lista." : result.emailSent ? "También enviamos una constancia a tu correo." : "La baja está aplicada. El correo de constancia no pudo entregarse."}</div><Link href="/blog" className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-xl bg-violet-600 text-sm font-semibold text-white hover:bg-violet-500">Volver a la academia</Link></>}
      </div>
    </section>
  </div>;
}
