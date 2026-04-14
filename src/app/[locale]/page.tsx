"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, Code2, Database, Globe, Bot, Workflow, Puzzle,
  CheckCircle2, ChevronRight, Github, Linkedin, Instagram, Mail, Layers,
} from "lucide-react";
import { DATA } from "@/data/resume";
import Image from "next/image";
import { BookingModal } from "@/components/booking-modal";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { WordRotate } from "@/components/magicui/word-rotate";
import { Marquee } from "@/components/magicui/marquee";
import { BorderBeam } from "@/components/magicui/border-beam";
import { MagicCard } from "@/components/magicui/magic-card";
import { getDictionary, type Locale } from "@/lib/i18n";
import { LightRays } from "@/components/magicui/light-rays";

/* ── animation variants ───────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

/* ── static data (locale-independent) ────────────── */
const STATS_VALUES = [5, 20, 10, 100];
const STATS_SUFFIXES = ["+", "+", "+", "%"];

const SERVICE_META = [
  { icon: Globe,    from: "#38bdf8", to: "#6366f1" },
  { icon: Code2,    from: "#a855f7", to: "#ec4899" },
  { icon: Database, from: "#10b981", to: "#06b6d4" },
  { icon: Workflow, from: "#f97316", to: "#ef4444" },
  { icon: Bot,      from: "#e879f9", to: "#f43f5e" },
  { icon: Puzzle,   from: "#fbbf24", to: "#f97316" },
];

const TECHS = [
  "React","Next.js","TypeScript","Node.js","Python","PostgreSQL",
  "Docker","N8N","OpenAI","TailwindCSS","Prisma","REST APIs","C#",".NET","MongoDB","Framer","Vercel",
];

const ALL_PROJECTS = DATA.projects.filter((p) => p.image || p.video);
const ROW_A = ALL_PROJECTS.filter((_, i) => i % 2 === 0);
const ROW_B = ALL_PROJECTS.filter((_, i) => i % 2 !== 0);

/* ── project carousel card ───────────────────── */
function ProjectCarouselCard({ project }: { project: (typeof DATA.projects)[number] }) {
  return (
    <div className="group relative w-72 shrink-0 overflow-hidden rounded-2xl border border-border bg-card hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-900/10 transition-all duration-300 cursor-default">
      <div className="relative h-44 bg-muted overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : project.video ? (
          <video
            src={project.video}
            autoPlay loop muted playsInline
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Layers className="size-10 text-muted-foreground/15" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-sm leading-snug">{project.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{project.description}</p>
        <div className="flex flex-wrap gap-1 pt-1">
          {project.technologies.slice(0, 3).map((tech) => (
            <span key={tech} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────── */
export default function LandingPage({ params }: { params: { locale: Locale } }) {
  const dict = getDictionary(params.locale);
  const d = dict.landing;
  const locale = params.locale;

  return (
    <div className="min-h-[100dvh] overflow-x-hidden">

      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden">

        {/* brand logo top-left */}
        <div className="absolute top-6 left-8 z-10">
          <span className="text-lg font-black tracking-tight bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent select-none">
            Anthony Sanchez
          </span>
        </div>

        {/* Light Rays effect */}
        <LightRays
          count={9}
          color="rgba(167, 139, 250, 0.25)"
          blur={32}
          speed={12}
          length="90vh"
          className="-z-10"
        />

        {/* glows */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 h-[700px] w-[1100px] rounded-full bg-violet-700/15 blur-[140px]" />
          <div className="absolute left-1/4 bottom-0 h-[400px] w-[600px] rounded-full bg-sky-600/8 blur-[120px]" />
          <div className="absolute right-1/4 top-1/3 h-[300px] w-[400px] rounded-full bg-pink-600/6 blur-[80px]" />
        </div>

        <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-5xl mx-auto space-y-8">
          {/* badge */}
          <motion.div variants={fadeUp} className="flex justify-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
              </span>
              <AnimatedGradientText colorFrom="#a78bfa" colorTo="#38bdf8" speed={0.8} className="font-semibold">
                {d.available}
              </AnimatedGradientText>
            </span>
          </motion.div>

          {/* headline */}
          <motion.div variants={fadeUp} className="space-y-3">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[1.02]">
              {d.hero_build}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-x-4 text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[1.02]">
              <WordRotate
                words={d.hero_words as string[]}
                duration={2800}
                className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-sky-400 bg-clip-text text-transparent"
              />
            </div>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[1.02]">
              {d.hero_sell} <span className="text-muted-foreground">{d.hero_sell_muted}</span>
            </h1>
          </motion.div>

          {/* sub */}
          <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed">
            {d.hero_sub}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <BookingModal
              trigger={
                <ShimmerButton
                  background="rgba(109,40,217,0.9)"
                  shimmerColor="#c4b5fd"
                  borderRadius="14px"
                  className="px-8 py-4 text-base font-bold gap-2"
                >
                  {d.cta_book}
                  <ArrowRight className="size-4 inline ml-1" />
                </ShimmerButton>
              }
            />
            <Link
              href={`/${locale}/portfolio`}
              className="inline-flex items-center gap-2 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm px-8 py-4 text-base font-semibold hover:bg-muted hover:border-border transition-all"
            >
              {d.cta_projects}
              <ArrowRight className="size-4" />
            </Link>
          </motion.div>

          {/* trust strip */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground text-sm pt-2">
            {(d.trust as string[]).map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                {t}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <div className="h-8 w-px bg-gradient-to-b from-transparent to-muted-foreground/40" />
        </div>
      </section>

      {/* ══ STATS ════════════════════════════════════════════════════ */}
      <section className="border-y border-border/40 bg-card/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-10"
          >
            {d.stats.map((stat, i) => (
              <motion.div key={stat.label} variants={fadeUp} className="flex flex-col items-center text-center gap-1">
                <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight tabular-nums">
                  <NumberTicker value={STATS_VALUES[i]} className="text-foreground" />
                  <span>{STATS_SUFFIXES[i]}</span>
                </span>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ TECH MARQUEE ═════════════════════════════════════════════ */}
      <div className="py-8 border-b border-border/30">
        <p className="text-center text-xs text-muted-foreground/40 uppercase tracking-widest mb-5 font-semibold">
          {d.tech_label}
        </p>
        <Marquee pauseOnHover repeat={3} className="[--duration:22s]">
          {TECHS.map((tech) => (
            <div key={tech} className="mx-3 flex items-center gap-2 rounded-full border border-border/50 bg-card/60 px-5 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors">
              {tech}
            </div>
          ))}
        </Marquee>
      </div>

      {/* ══ SERVICES ═════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="space-y-16">
          <motion.div variants={fadeUp} className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="inline-block rounded-full border border-border px-4 py-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {d.services_tag}
            </span>
            <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tighter">
              {d.services_h2a}{" "}
              <span className="text-muted-foreground font-normal">{d.services_h2b}</span>
            </h2>
            <p className="text-lg text-muted-foreground">{d.services_sub}</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {d.services.map((svc, i) => {
              const meta = SERVICE_META[i];
              return (
                <motion.div key={svc.title} variants={fadeUp}>
                  <MagicCard gradientColor="#1a1040" gradientOpacity={0.7}
                    className="relative rounded-2xl border border-border bg-card h-full overflow-hidden group cursor-default">
                    <div className="p-7 flex flex-col gap-5 h-full">
                      <div className="size-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `linear-gradient(135deg,${meta.from}18,${meta.to}18)`, border: `1px solid ${meta.from}30` }}>
                        <meta.icon className="size-5" style={{ color: meta.from }} />
                      </div>
                      <div className="flex flex-col gap-2 flex-1">
                        <h3 className="text-base font-bold">{svc.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed flex-1">{svc.description}</p>
                        <span className="text-xs text-muted-foreground/40 font-mono pt-1">{svc.tag}</span>
                      </div>
                      <ChevronRight className="absolute right-6 top-7 size-4 text-muted-foreground/20 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <BorderBeam duration={5 + i} delay={i * 0.8} colorFrom={meta.from} colorTo={meta.to} size={70} borderWidth={1} />
                  </MagicCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ══ PROCESS ══════════════════════════════════════════════════ */}
      <section className="bg-card/20 border-y border-border/40 py-28 px-6">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
          className="max-w-6xl mx-auto space-y-16">
          <motion.div variants={fadeUp} className="text-center space-y-4">
            <span className="inline-block rounded-full border border-border px-4 py-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {d.process_tag}
            </span>
            <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tighter">
              {d.process_h2a}{" "}
              <span className="text-muted-foreground font-normal">{d.process_h2b}</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-8 lg:gap-14">
            {d.steps.map((step, i) => (
              <motion.div key={step.number} variants={fadeUp} className="relative">
                {i < d.steps.length - 1 && (
                  <div className="hidden sm:block absolute top-6 left-[calc(100%-8px)] w-full h-px border-t border-dashed border-border/50" />
                )}
                <div className="space-y-4">
                  <span className="text-6xl font-black text-muted-foreground/10 tabular-nums">{step.number}</span>
                  <h3 className="text-lg font-bold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══ PROJECTS CAROUSEL ════════════════════════════════════════ */}
      <section className="py-28 overflow-hidden">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="space-y-14">
          <motion.div variants={fadeUp} className="flex items-end justify-between px-6 max-w-7xl mx-auto">
            <div className="space-y-3">
              <span className="inline-block rounded-full border border-border px-4 py-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {d.projects_tag}
              </span>
              <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tighter">
                {d.projects_h2a}{" "}
                <span className="text-muted-foreground font-normal">{d.projects_h2b}</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl">
                {ALL_PROJECTS.length}{d.projects_count_post}
              </p>
            </div>
            <Link href={`/${locale}/portfolio`} className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors shrink-0 pb-2">
              {d.projects_see_all} <ArrowRight className="size-4" />
            </Link>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Marquee pauseOnHover repeat={2} className="[--duration:35s] [--gap:1.25rem]">
              {ROW_A.map((project) => <ProjectCarouselCard key={project.title} project={project} />)}
            </Marquee>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Marquee reverse pauseOnHover repeat={2} className="[--duration:32s] [--gap:1.25rem]">
              {ROW_B.map((project) => <ProjectCarouselCard key={project.title} project={project} />)}
            </Marquee>
          </motion.div>

          <motion.div variants={fadeUp} className="flex justify-center px-6">
            <Link href={`/${locale}/portfolio`} className="inline-flex items-center gap-2 rounded-2xl border border-border px-7 py-3.5 text-sm font-semibold hover:bg-muted transition-colors">
              {d.projects_see_portfolio} <ArrowRight className="size-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ══ WHY ME ═══════════════════════════════════════════════════ */}
      <section className="bg-card/20 border-y border-border/40 py-28 px-6">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
          className="max-w-6xl mx-auto space-y-14">
          <motion.div variants={fadeUp} className="text-center space-y-4">
            <span className="inline-block rounded-full border border-border px-4 py-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {d.why_tag}
            </span>
            <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tighter">
              {d.why_h2a}{" "}
              <span className="text-muted-foreground font-normal">{d.why_h2b}</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {d.why_items.map((item) => (
              <motion.div key={item.title} variants={fadeUp}>
                <MagicCard gradientColor="#1a1040" gradientOpacity={0.5}
                  className="flex gap-5 rounded-2xl border border-border bg-card p-7">
                  <span className="text-3xl leading-none mt-0.5 shrink-0">{item.icon}</span>
                  <div>
                    <h3 className="font-bold mb-1.5">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </MagicCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══ CTA FINAL ════════════════════════════════════════════════ */}
      <section className="relative px-6 py-36 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[900px] rounded-full bg-violet-700/15 blur-[120px]" />
        </div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
          className="max-w-4xl mx-auto text-center space-y-9">
          <motion.div variants={fadeUp} className="space-y-5">
            <span className="inline-block rounded-full border border-border px-4 py-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {d.cta_tag}
            </span>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter">
              {d.cta_h2a}{" "}
              <AnimatedGradientText colorFrom="#a78bfa" colorTo="#34d399" speed={0.5} className="font-extrabold">
                {d.cta_h2b}
              </AnimatedGradientText>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{d.cta_sub}</p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <BookingModal
              trigger={
                <ShimmerButton
                  background="rgba(109,40,217,0.9)"
                  shimmerColor="#c4b5fd"
                  borderRadius="14px"
                  className="px-10 py-5 text-base font-bold gap-2"
                >
                  {d.cta_book2}
                  <ArrowRight className="size-4 inline ml-1" />
                </ShimmerButton>
              }
            />
            <Link href={`mailto:${DATA.contact.email}`}
              className="inline-flex items-center gap-2 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm px-8 py-5 text-base font-semibold hover:bg-muted hover:border-border transition-all">
              <Mail className="size-4" />
              {d.cta_email}
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-6 pt-2">
            {[
              { href: DATA.contact.social.GitHub.url, Icon: Github },
              { href: DATA.contact.social.LinkedIn.url, Icon: Linkedin },
              { href: DATA.contact.social.ig.url, Icon: Instagram },
            ].map(({ href, Icon }) => (
              <Link key={href} href={href} target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground/50 hover:text-foreground transition-colors">
                <Icon className="size-5" />
              </Link>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════════ */}
      <footer className="border-t border-border/40 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground/50">
          <span>© {new Date().getFullYear()} Anthony Sanchez. {d.footer_made}</span>
          <div className="flex items-center gap-6">
            <Link href={`/${locale}/portfolio`} className="hover:text-foreground transition-colors">Portfolio</Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <Link href={`mailto:${DATA.contact.email}`} className="hover:text-foreground transition-colors">{d.footer_contact}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
