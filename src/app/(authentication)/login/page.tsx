import LoginForm from "@/components/ui/form/loginForm";
import Orb from "@/components/ui/orbe/orbe";
import { ArrowLeft, BookOpen, CheckCircle2, GraduationCap, Layers3, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const features = [
  { icon: BookOpen, title: "Biblioteca editorial", text: "Artículos, clases, tutoriales y apuntes en un solo lugar." },
  { icon: Layers3, title: "Flujo profesional", text: "Borradores, categorías, SEO y publicación controlada." },
  { icon: ShieldCheck, title: "Acceso privado", text: "Administración protegida por sesión y rol de administrador." },
];

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07070a] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(124,58,237,.18),transparent_32%),radial-gradient(circle_at_10%_90%,rgba(14,165,233,.10),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:64px_64px]" />

      <nav className="relative z-20 mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/blog" className="flex items-center gap-2.5 font-bold tracking-tight">
          <span className="grid size-9 place-items-center rounded-xl bg-violet-600 shadow-lg shadow-violet-600/25"><GraduationCap className="size-5" /></span>
          <span>Anthony<span className="text-violet-400">.Academy</span></span>
        </Link>
        <Link href="/blog" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/65 backdrop-blur hover:border-white/20 hover:text-white"><ArrowLeft className="size-3.5" /> Volver a la academia</Link>
      </nav>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-14 px-5 pb-16 pt-6 lg:grid-cols-[1.08fr_.92fr] lg:px-8">
        <section className="relative hidden lg:block">
          <div className="absolute -left-28 -top-28 size-[560px] opacity-80"><Orb hue={18} hoverIntensity={0.35} /></div>
          <div className="relative z-10 max-w-xl pt-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3.5 py-2 text-xs font-semibold text-violet-300 backdrop-blur"><Sparkles className="size-3.5" /> Tu conocimiento, bien organizado</div>
            <h1 className="text-5xl font-black leading-[1.05] tracking-[-0.045em] xl:text-6xl">El centro de operaciones para tu <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-sky-300 bg-clip-text text-transparent">academia digital.</span></h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/50">Convierte experiencia en contenido que enseña, posiciona y construye comunidad.</p>
            <div className="mt-10 grid gap-3">{features.map(({icon:Icon,title,text})=><div key={title} className="group flex max-w-lg items-start gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4 backdrop-blur-md transition-colors hover:border-violet-400/20 hover:bg-white/[0.055]"><span className="grid size-10 shrink-0 place-items-center rounded-xl border border-violet-400/15 bg-violet-400/10 text-violet-300"><Icon className="size-4.5" /></span><div><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-sm leading-relaxed text-white/40">{text}</p></div><CheckCircle2 className="ml-auto mt-1 size-4 shrink-0 text-emerald-400/70" /></div>)}</div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md lg:mx-0 lg:ml-auto">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.055] p-1 shadow-2xl shadow-black/50 backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/80 to-transparent" />
            <div className="rounded-[24px] border border-white/[0.04] bg-black/25 p-6 sm:p-8">
              <div className="mb-8">
                <div className="mb-6 grid size-12 place-items-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-300 lg:hidden"><GraduationCap className="size-6" /></div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Área administrativa</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight">Bienvenido de nuevo</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/45">Accede para gestionar la biblioteca, tus clases y la comunidad.</p>
              </div>
              <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-white/[0.035]" />}>
                <LoginForm />
              </Suspense>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-white/30"><ShieldCheck className="size-3.5" /> Acceso exclusivo para administradores autorizados</div>
        </section>
      </div>
    </main>
  );
}
