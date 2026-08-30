"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Clock3, Download, Mail, Search, Send, ShieldCheck, UserMinus, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type Member = { id: string; email: string; active: boolean; confirmedAt: string | Date | null; createdAt: string | Date };
type Campaign = { id: string; subject: string; status: string; recipientCount: number; sentAt: string | Date | null; createdAt: string | Date };

export default function CommunityManager({ members, campaigns }: { members: Member[]; campaigns: Campaign[] }) {
  const [query, setQuery] = useState("");
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState(campaigns);
  const [form, setForm] = useState({ subject: "", previewText: "", content: "", buttonLabel: "", buttonUrl: "" });
  const active = members.filter(member => member.active && member.confirmedAt).length;
  const pending = members.filter(member => !member.confirmedAt).length;
  const cancelled = members.filter(member => !member.active && member.confirmedAt).length;
  const filtered = useMemo(() => members.filter(member => member.email.toLowerCase().includes(query.toLowerCase())), [members, query]);
  const set = (key: keyof typeof form, value: string) => setForm(current => ({ ...current, [key]: value }));

  async function send() {
    if (!form.subject.trim() || form.content.trim().length < 10) return toast.error("Completa el asunto y el mensaje");
    if (!active) return toast.error("No hay miembros confirmados para recibir la campaña");
    if (!window.confirm(`Esta campaña se enviará ahora a ${active} miembro${active === 1 ? "" : "s"} confirmado${active === 1 ? "" : "s"}. ¿Deseas continuar?`)) return;
    setSending(true);
    try {
      const response = await fetch("/api/admin/campaigns", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? campaignError(data.delivery?.reason));
      setHistory(current => [data.campaign, ...current]);
      setForm({ subject: "", previewText: "", content: "", buttonLabel: "", buttonUrl: "" });
      toast.success(`Campaña enviada a ${data.delivery.sent} miembros`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo enviar la campaña");
    } finally { setSending(false); }
  }

  function exportCsv() {
    const rows = [["email", "estado", "fecha_registro"], ...members.map(member => [member.email, member.active && member.confirmedAt ? "activo" : member.confirmedAt ? "cancelado" : "pendiente", new Date(member.createdAt).toISOString()])];
    const csv = rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    link.download = `comunidad-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-3">
      <Metric icon={CheckCircle2} label="Miembros activos" value={active} color="text-emerald-500 bg-emerald-500/10" />
      <Metric icon={Clock3} label="Pendientes" value={pending} color="text-amber-500 bg-amber-500/10" />
      <Metric icon={UserMinus} label="Cancelaron" value={cancelled} color="text-zinc-500 bg-zinc-500/10" />
    </div>

    <div className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
      <section className="overflow-hidden rounded-2xl border bg-card">
        <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-bold">Directorio de la comunidad</h2><p className="text-xs text-muted-foreground">{members.length} registros totales</p></div><Button variant="outline" size="sm" onClick={exportCsv} disabled={!members.length}><Download className="mr-2 size-4" /> Exportar CSV</Button></div>
        <div className="border-b p-4"><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar por correo…" className="pl-9" /></div></div>
        <div className="max-h-[520px] overflow-auto">
          {filtered.length ? <table className="w-full text-left text-sm"><thead className="sticky top-0 bg-muted/95 text-xs text-muted-foreground backdrop-blur"><tr><th className="px-5 py-3 font-medium">Miembro</th><th className="px-5 py-3 font-medium">Estado</th><th className="px-5 py-3 font-medium">Registro</th></tr></thead><tbody>{filtered.map(member => { const status = member.active && member.confirmedAt ? "Activo" : member.confirmedAt ? "Cancelado" : "Pendiente"; return <tr key={member.id} className="border-t"><td className="px-5 py-4 font-medium">{member.email}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${status === "Activo" ? "bg-emerald-500/10 text-emerald-500" : status === "Pendiente" ? "bg-amber-500/10 text-amber-500" : "bg-muted text-muted-foreground"}`}>{status}</span></td><td className="whitespace-nowrap px-5 py-4 text-xs text-muted-foreground">{new Date(member.createdAt).toLocaleDateString("es", { dateStyle: "medium" })}</td></tr>})}</tbody></table> : <div className="py-20 text-center text-sm text-muted-foreground"><UsersRound className="mx-auto mb-3 size-10 opacity-30" />No hay miembros que mostrar.</div>}
        </div>
      </section>

      <section className="h-fit rounded-2xl border bg-card p-6">
        <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-500/10 text-violet-500"><Mail className="size-5" /></span><div><h2 className="font-bold">Nueva campaña</h2><p className="text-xs leading-relaxed text-muted-foreground">Se enviará solamente a {active} miembros confirmados y activos.</p></div></div>
        <div className="mt-6 space-y-4"><label className="block"><span className="mb-2 block text-sm font-semibold">Asunto</span><Input value={form.subject} onChange={event => set("subject", event.target.value)} maxLength={120} placeholder="Una nueva guía para esta semana" /></label><label className="block"><span className="mb-2 block text-sm font-semibold">Texto de vista previa</span><Input value={form.previewText} onChange={event => set("previewText", event.target.value)} maxLength={160} placeholder="Lo primero que verán en su bandeja…" /></label><label className="block"><span className="mb-2 block text-sm font-semibold">Mensaje</span><Textarea value={form.content} onChange={event => set("content", event.target.value)} rows={8} placeholder={"Hola comunidad,\n\nEsta semana preparé…"} /></label><div className="grid gap-3 sm:grid-cols-2"><label><span className="mb-2 block text-xs font-semibold">Texto del botón</span><Input value={form.buttonLabel} onChange={event => set("buttonLabel", event.target.value)} placeholder="Ver contenido" /></label><label><span className="mb-2 block text-xs font-semibold">Enlace del botón</span><Input value={form.buttonUrl} onChange={event => set("buttonUrl", event.target.value)} placeholder="https://…" /></label></div></div>
        <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs leading-relaxed text-muted-foreground"><ShieldCheck className="mr-2 inline size-4 text-emerald-500" />Cada mensaje incluye automáticamente el enlace personal para cancelar la suscripción.</div>
        <Button onClick={send} disabled={sending || !active} className="mt-5 w-full bg-violet-600 text-white hover:bg-violet-500"><Send className="mr-2 size-4" />{sending ? "Enviando campaña…" : `Revisar y enviar a ${active}`}</Button>
      </section>
    </div>

    <section className="rounded-2xl border bg-card p-6"><h2 className="font-bold">Historial de campañas</h2>{history.length ? <div className="mt-4 divide-y">{history.map(campaign => <div key={campaign.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center"><div className="flex-1"><p className="text-sm font-semibold">{campaign.subject}</p><p className="mt-1 text-xs text-muted-foreground">{new Date(campaign.sentAt ?? campaign.createdAt).toLocaleString("es")}</p></div><span className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${campaign.status === "SENT" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>{campaign.status === "SENT" ? "Enviada" : "Fallida"}</span><span className="text-xs text-muted-foreground">{campaign.recipientCount} destinatarios</span></div>)}</div> : <p className="mt-4 text-sm text-muted-foreground">Aún no se han enviado campañas.</p>}</section>
  </div>;
}

function Metric({ icon: Icon, label, value, color }: { icon: typeof Mail; label: string; value: number; color: string }) { return <div className="rounded-2xl border bg-card p-5"><span className={`grid size-10 place-items-center rounded-xl ${color}`}><Icon className="size-5" /></span><p className="mt-5 text-3xl font-bold">{value}</p><p className="mt-1 text-sm text-muted-foreground">{label}</p></div>; }
function campaignError(reason?: string) { if (reason === "missing_api_key") return "Configura RESEND_API_KEY antes de enviar"; if (reason === "no_recipients") return "No hay miembros confirmados"; return reason || "No se pudo enviar la campaña"; }
