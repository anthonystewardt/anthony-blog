import prisma from "@/lib/db";
import { BookOpen, Eye, FileText, FolderTree, GraduationCap, PenLine, Sparkles } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomeDashboardPage() {
  const [posts, categories, subscribers] = await Promise.all([
    prisma.post.findMany({ orderBy: { updatedAt: "desc" }, take: 5, include: { category: true } }),
    prisma.category.count(), prisma.subscriber.count(),
  ]);
  const cards = [
    { label: "Contenido reciente", value: posts.length, hint: "últimas entradas", icon: FileText },
    { label: "Publicados", value: posts.filter(p => p.published).length, hint: "visibles ahora", icon: Eye },
    { label: "Categorías", value: categories, hint: "rutas de aprendizaje", icon: FolderTree },
    { label: "Comunidad", value: subscribers, hint: "suscriptores", icon: GraduationCap },
  ];
  return <div className="space-y-8">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 flex items-center gap-2 text-sm font-medium text-violet-500"><Sparkles className="size-4"/> Centro editorial</p><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Buenos días, Anthony</h1><p className="mt-2 text-muted-foreground">Publica conocimiento, organiza clases y haz crecer tu biblioteca.</p></div><Link href="/dashboard/blog/create" className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white"><PenLine className="size-4"/> Crear contenido</Link></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({label,value,hint,icon:Icon},i)=><div key={label} className="rounded-2xl border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><div className="rounded-xl bg-violet-500/10 p-2.5 text-violet-500"><Icon className="size-5"/></div><span className="text-xs text-muted-foreground">0{i+1}</span></div><p className="mt-5 text-3xl font-bold">{value}</p><p className="mt-1 text-sm font-medium">{label}</p><p className="text-xs text-muted-foreground">{hint}</p></div>)}</div>
    <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]"><section className="rounded-2xl border bg-card p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-bold">Contenido reciente</h2><p className="text-sm text-muted-foreground">Continúa donde lo dejaste</p></div><Link href="/dashboard/blog" className="text-sm font-medium text-violet-500">Ver todo</Link></div><div className="space-y-2">{posts.length ? posts.map(post=><Link href={`/dashboard/blog/${post.id}/edit`} key={post.id} className="flex items-center gap-4 rounded-xl p-3 hover:bg-muted"><div className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted">{post.type === "CLASS" ? <BookOpen className="size-4"/>:<FileText className="size-4"/>}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{post.title}</p><p className="text-xs text-muted-foreground">{post.category?.name ?? "Sin categoría"}</p></div><span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${post.published ? "bg-emerald-500/10 text-emerald-500":"bg-amber-500/10 text-amber-500"}`}>{post.published ? "Publicado":"Borrador"}</span></Link>):<p className="py-10 text-center text-sm text-muted-foreground">Todavía no hay contenido.</p>}</div></section><section className="rounded-2xl border bg-gradient-to-br from-violet-600 to-indigo-700 p-6 text-white"><Sparkles className="size-6"/><h2 className="mt-8 text-2xl font-bold">Tu próxima gran lección empieza aquí.</h2><p className="mt-3 text-sm leading-relaxed text-white/70">Combina video, apuntes, ejemplos de código y recursos en una experiencia educativa clara.</p><Link href="/dashboard/blog/create" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-violet-700">Empezar a escribir</Link></section></div>
  </div>;
}
