import CodeCopy from "@/components/blog/code-copy";
import SubscriberForm from "@/components/ui/form/subscriber";
import { markdownToHTML } from "@/data/blog";
import { contentTypes, getYoutubeId, type ContentTypeKey } from "@/lib/content";
import prisma from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Layers3, PlayCircle } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.post.findUnique({ where: { slug: params.slug } });
  if (!post) return {};
  return { title: post.seoTitle || post.title, description: post.seoDescription || post.resumen, openGraph: { title: post.seoTitle || post.title, description: post.seoDescription || post.resumen, images: post.imagePreview ? [post.imagePreview] : [] } };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findFirst({
    where: { slug: params.slug, published: true },
    include: {
      author: true,
      category: true,
      series: { include: { posts: { where: { published: true }, orderBy: [{ lessonNumber: "asc" }, { publishedAt: "asc" }], select: { id: true, title: true, slug: true, lessonNumber: true } } } },
    },
  });
  if (!post) notFound();

  const html = await markdownToHTML(post.content);
  const youtubeId = getYoutubeId(post.youtubeUrl);
  const meta = contentTypes[post.type as ContentTypeKey];
  const lessons = post.series?.posts ?? [];
  const currentIndex = lessons.findIndex(lesson => lesson.id === post.id);
  const previous = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const currentPart = currentIndex >= 0 ? currentIndex + 1 : post.lessonNumber;
  const related = await prisma.post.findMany({ where: { published: true, id: { not: post.id }, ...(post.categoryId ? { categoryId: post.categoryId } : {}) }, take: 3, orderBy: { publishedAt: "desc" } });

  return <main className="min-w-0 overflow-x-clip">
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-5 sm:py-8"><Link href="/blog" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Volver a la biblioteca</Link></div>
    <article>
      <header className="mx-auto max-w-4xl px-4 pb-8 pt-3 text-center sm:px-5 sm:pb-10 sm:pt-6">
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-500"><span>{meta.label}</span><span className="text-border">●</span><span>{post.category?.name ?? "Academia"}</span>{post.series && <><span className="text-border">●</span><span>Parte {currentPart} de {lessons.length}</span></>}</div>
        {post.series && <Link href={`#programa`} className="mt-5 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-medium text-violet-500"><Layers3 className="size-3.5" /> {post.series.title}</Link>}
        <h1 className="mt-5 text-balance text-3xl font-black leading-[1.08] tracking-tight sm:mt-6 sm:text-6xl">{post.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">{post.resumen}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground sm:mt-8 sm:gap-5 sm:text-sm"><span className="font-medium text-foreground">{post.author.name}</span><span className="flex items-center gap-1.5"><CalendarDays className="size-4 shrink-0" />{formatDate((post.publishedAt ?? post.createdAt).toISOString())}</span><span className="flex items-center gap-1.5"><Clock3 className="size-4 shrink-0" />{post.readingTime} min</span></div>
      </header>
      {post.imagePreview && <div className="relative mx-4 aspect-[16/9] max-w-6xl overflow-hidden rounded-2xl bg-muted sm:mx-auto sm:aspect-[16/8] sm:rounded-3xl"><Image src={post.imagePreview} alt={post.title} fill priority className="object-cover" /></div>}
      <div className="mx-auto grid min-w-0 max-w-7xl gap-8 px-4 py-10 sm:px-5 sm:py-14 lg:grid-cols-[minmax(0,760px)_300px] lg:justify-center lg:gap-10">
        <div className="min-w-0 max-w-full">
          {youtubeId && <section className="mb-8 min-w-0 max-w-full overflow-hidden rounded-2xl border bg-card sm:mb-10"><div className="aspect-video w-full"><iframe className="block size-full max-w-full" src={`https://www.youtube-nocookie.com/embed/${youtubeId}`} title={post.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div><div className="flex min-w-0 items-center gap-3 border-t p-4"><PlayCircle className="size-5 shrink-0 text-red-500" /><div className="min-w-0"><p className="text-sm font-semibold">Video de la clase</p><p className="text-xs leading-relaxed text-muted-foreground">Los apuntes y ejemplos están disponibles debajo.</p></div></div></section>}
          <CodeCopy />
          <div className="article-content prose prose-zinc max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-headings:tracking-tight prose-a:text-violet-500 prose-img:rounded-2xl prose-pre:relative" dangerouslySetInnerHTML={{ __html: html }} />
          <div className="mt-12 flex flex-wrap gap-2 border-t pt-8">{post.tags.map(tag => <span key={tag} className="rounded-full border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">#{tag}</span>)}</div>
          {post.series && <nav className="mt-10 grid gap-3 border-t pt-8 sm:grid-cols-2" aria-label="Navegación del curso">
            {previous ? <Link href={`/blog/${previous.slug}`} className="group rounded-2xl border bg-card p-5 hover:border-violet-500/40"><span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground"><ChevronLeft className="size-3.5" /> Anterior</span><p className="mt-2 text-sm font-bold group-hover:text-violet-500">Parte {currentIndex}: {previous.title}</p></Link> : <div />}
            {next ? <Link href={`/blog/${next.slug}`} className="group rounded-2xl border bg-card p-5 text-right hover:border-violet-500/40"><span className="flex items-center justify-end gap-1 text-xs font-semibold text-muted-foreground">Siguiente <ChevronRight className="size-3.5" /></span><p className="mt-2 text-sm font-bold group-hover:text-violet-500">Parte {currentIndex + 2}: {next.title}</p></Link> : <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-right"><span className="text-xs font-semibold text-emerald-500">¡Serie completada!</span><p className="mt-2 text-sm font-bold">Llegaste al final del recorrido</p></div>}
          </nav>}
        </div>
        <aside className="min-w-0 space-y-5 lg:sticky lg:top-24 lg:h-fit">
          {post.series && <div id="programa" className="scroll-mt-24 overflow-hidden rounded-2xl border bg-card"><div className="border-b bg-violet-500/[.06] p-5"><p className="text-xs font-bold uppercase tracking-wider text-violet-500">Programa del curso</p><h2 className="mt-2 font-bold">{post.series.title}</h2><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{post.series.description}</p><div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><Layers3 className="size-3.5" /> {lessons.length} partes</div></div><div className="max-h-[360px] overflow-y-auto p-2">{lessons.map((lesson, index) => <Link key={lesson.id} href={`/blog/${lesson.slug}`} className={`flex items-start gap-3 rounded-xl p-3 text-sm transition-colors ${lesson.id === post.id ? "bg-violet-500/10 text-violet-500" : "hover:bg-muted"}`}><span className={`grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-bold ${lesson.id === post.id ? "bg-violet-600 text-white" : "bg-muted text-muted-foreground"}`}>{lesson.id === post.id ? <CheckCircle2 className="size-3.5" /> : index + 1}</span><span className="leading-snug"><small className="mb-0.5 block text-[10px] uppercase opacity-60">Parte {index + 1}</small>{lesson.title}</span></Link>)}</div></div>}
          <div className="rounded-2xl border bg-card p-5"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tu instructor</p><div className="mt-4 flex items-center gap-3"><div className="grid size-11 place-items-center overflow-hidden rounded-full bg-violet-600 font-bold text-white">{post.author.avatarUrl ? <img src={post.author.avatarUrl} alt={post.author.name} className="size-full object-cover" /> : post.author.name.split(" ").map(word => word[0]).join("").slice(0, 2)}</div><div><p className="font-semibold">{post.author.name}</p><p className="text-xs text-muted-foreground">{post.author.jobTitle ?? "Instructor"}</p></div></div><p className="mt-4 text-sm leading-relaxed text-muted-foreground">{post.author.bio ?? "Comparto aprendizajes prácticos sobre software, producto e inteligencia artificial."}</p><Link href={post.author.website ?? "/es/portfolio"} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-violet-500">Conocer más <ArrowRight className="size-3.5" /></Link></div>
          <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-5 text-white"><BookOpen className="size-5" /><p className="mt-8 font-bold">Recibe nuevas lecciones</p><p className="mb-5 mt-2 text-sm text-white/70">Apuntes, tutoriales y recursos directamente en tu correo.</p><SubscriberForm /></div>
        </aside>
      </div>
    </article>
    {related.length > 0 && <section className="border-t bg-muted/20"><div className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-14"><h2 className="text-2xl font-bold">Continúa aprendiendo</h2><div className="mt-6 grid gap-4 md:grid-cols-3">{related.map(item => <Link href={`/blog/${item.slug}`} key={item.id} className="rounded-2xl border bg-card p-5 hover:border-violet-500/40"><p className="text-xs font-semibold uppercase text-violet-500">Relacionado</p><h3 className="mt-3 font-bold leading-snug">{item.title}</h3><p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.resumen}</p></Link>)}</div></div></section>}
  </main>;
}
