"use client";

import { useState, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  User,
  Mail,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── constants ───────────────────────────────────────────── */
const MONTHS = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];
const DAYS_SHORT = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

const TIME_SLOTS = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "14:00","14:30","15:00","15:30","16:00","16:30","17:00",
];

const MEETING_TYPES = [
  { id: "discovery", label: "Llamada de descubrimiento", duration: "30 min", icon: "🚀", desc: "Cuéntame tu proyecto y vemos cómo puedo ayudarte." },
  { id: "technical", label: "Consulta técnica", duration: "60 min", icon: "⚙️", desc: "Revisamos arquitectura, stack o problemas técnicos." },
  { id: "proposal", label: "Presentación de propuesta", duration: "45 min", icon: "📋", desc: "Te presento mi propuesta y presupuesto personalizado." },
];

/* ── helpers ─────────────────────────────────────────────── */
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function isWeekend(year: number, month: number, day: number) {
  const d = new Date(year, month, day).getDay();
  return d === 0 || d === 6;
}
function isPast(year: number, month: number, day: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(year, month, day) < today;
}

/* ── step indicator ─────────────────────────────────────── */
function StepDot({ active, done }: { active: boolean; done: boolean }) {
  return (
    <div className={cn(
      "size-2 rounded-full transition-all duration-300",
      done ? "bg-violet-500" : active ? "bg-violet-400 scale-125" : "bg-border"
    )} />
  );
}

/* ── main component ──────────────────────────────────────── */
interface BookingModalProps {
  trigger: React.ReactNode;
}

const CALENDLY_URL =
  "https://calendly.com/anthonysa0813/proyecto?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=09090b&text_color=f4f4f5&primary_color=7c3aed";

export function BookingModal({ trigger }: BookingModalProps) {
  const today = new Date();
  const [tab, setTab] = useState<"calendly" | "form">("calendly");
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0); // 0=type, 1=date, 2=time, 3=form
  const [meetingType, setMeetingType] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStep(0);
    setMeetingType("");
    setSelectedDay(null);
    setSelectedTime("");
    setForm({ name: "", email: "", message: "" });
    setSubmitted(false);
    setSendError(null);
    setLoading(false);
    setTab("calendly");
  }, []);

  const selectedTypeMeta = MEETING_TYPES.find((t) => t.id === meetingType);

  /* calendar helpers */
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);

  const prevMonth = () => {
    if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(y => y - 1); }
    else setSelectedMonth(m => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(y => y + 1); }
    else setSelectedMonth(m => m + 1);
    setSelectedDay(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSendError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "booking",
          meetingType: selectedTypeMeta?.label,
          meetingDuration: selectedTypeMeta?.duration,
          date: `${selectedDay} de ${MONTHS[selectedMonth]} de ${selectedYear}`,
          time: selectedTime,
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error("Error al enviar");
      setSubmitted(true);
    } catch {
      setSendError("Hubo un error al enviar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const fadeVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.15 } },
  };

  return (
    <Dialog.Root onOpenChange={(open) => { if (!open) reset(); }}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl shadow-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">

          {/* header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <Calendar className="size-4 text-violet-400" />
              </div>
              <div>
                <Dialog.Title className="text-sm font-bold">Agenda una reunión</Dialog.Title>
                <p className="text-xs text-muted-foreground">Anthony Sanchez · Lima, Perú (GMT-5)</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* step dots — only for form tab */}
              {tab === "form" && (
                <div className="flex items-center gap-1.5">
                  {[0,1,2,3].map(s => (
                    <StepDot key={s} active={step === s} done={step > s} />
                  ))}
                </div>
              )}
              {/* tab switcher */}
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1 text-xs font-semibold">
                <button
                  onClick={() => setTab("calendly")}
                  className={cn(
                    "px-3 py-1.5 rounded-md transition-all",
                    tab === "calendly"
                      ? "bg-violet-600 text-white shadow"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  📅 Calendly
                </button>
                <button
                  onClick={() => setTab("form")}
                  className={cn(
                    "px-3 py-1.5 rounded-md transition-all",
                    tab === "form"
                      ? "bg-violet-600 text-white shadow"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  ✉️ Formulario
                </button>
              </div>
              <Dialog.Close className="rounded-lg p-1.5 hover:bg-muted transition-colors">
                <X className="size-4 text-muted-foreground" />
              </Dialog.Close>
            </div>
          </div>

          {/* content */}
          <div className="overflow-y-auto max-h-[calc(92vh-72px)]">

            {/* ── CALENDLY TAB ── */}
            {tab === "calendly" && (
              <iframe
                src={CALENDLY_URL}
                width="100%"
                height="660"
                frameBorder="0"
                title="Agendar reunión con Calendly"
              />
            )}

            {/* ── FORM TAB ── */}
            {tab === "form" && (
            <AnimatePresence mode="wait">

              {/* ── STEP 0: meeting type ── */}
              {step === 0 && !submitted && (
                <motion.div key="step0" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="p-6 space-y-4">
                  <div>
                    <h2 className="text-lg font-bold">¿Qué tipo de reunión?</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Selecciona el tipo de sesión que mejor se adapta a tu necesidad.</p>
                  </div>
                  <div className="space-y-3">
                    {MEETING_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => { setMeetingType(type.id); setStep(1); }}
                        className={cn(
                          "w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200 hover:border-violet-500/50 hover:bg-violet-500/5 group",
                          meetingType === type.id ? "border-violet-500 bg-violet-500/10" : "border-border bg-card"
                        )}
                      >
                        <span className="text-2xl">{type.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">{type.label}</span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0 ml-2">
                              <Clock className="size-3" />{type.duration}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{type.desc}</p>
                        </div>
                        <ArrowRight className="size-4 text-muted-foreground/40 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-muted/30 p-3 text-xs text-muted-foreground">
                    <Video className="size-4 shrink-0 text-violet-400" />
                    Las reuniones se realizan por Google Meet o Zoom. Recibirás el link por email.
                  </div>
                </motion.div>
              )}

              {/* ── STEP 1: calendar ── */}
              {step === 1 && !submitted && (
                <motion.div key="step1" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="p-6 space-y-5">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setStep(0)} className="rounded-lg p-1.5 hover:bg-muted transition-colors">
                      <ChevronLeft className="size-4" />
                    </button>
                    <div>
                      <h2 className="text-lg font-bold">Selecciona una fecha</h2>
                      <p className="text-xs text-muted-foreground">{selectedTypeMeta?.label} · {selectedTypeMeta?.duration}</p>
                    </div>
                  </div>

                  {/* calendar */}
                  <div className="rounded-xl border border-border bg-card p-4">
                    {/* month nav */}
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={prevMonth} className="rounded-lg p-1.5 hover:bg-muted transition-colors">
                        <ChevronLeft className="size-4" />
                      </button>
                      <span className="text-sm font-semibold">
                        {MONTHS[selectedMonth]} {selectedYear}
                      </span>
                      <button onClick={nextMonth} className="rounded-lg p-1.5 hover:bg-muted transition-colors">
                        <ChevronRight className="size-4" />
                      </button>
                    </div>

                    {/* day names */}
                    <div className="grid grid-cols-7 mb-2">
                      {DAYS_SHORT.map(d => (
                        <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-1">{d}</div>
                      ))}
                    </div>

                    {/* days grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
                      {Array(daysInMonth).fill(null).map((_, i) => {
                        const day = i + 1;
                        const weekend = isWeekend(selectedYear, selectedMonth, day);
                        const past = isPast(selectedYear, selectedMonth, day);
                        const disabled = weekend || past;
                        const selected = selectedDay === day;
                        return (
                          <button
                            key={day}
                            disabled={disabled}
                            onClick={() => { setSelectedDay(day); setStep(2); }}
                            className={cn(
                              "aspect-square rounded-lg text-xs font-medium transition-all duration-150",
                              disabled ? "text-muted-foreground/30 cursor-not-allowed" : "hover:bg-violet-500/20 hover:text-violet-300 cursor-pointer",
                              selected ? "bg-violet-500 text-white hover:bg-violet-500 hover:text-white" : ""
                            )}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">Solo días laborables (lunes a viernes)</p>
                </motion.div>
              )}

              {/* ── STEP 2: time slots ── */}
              {step === 2 && !submitted && (
                <motion.div key="step2" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="p-6 space-y-5">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setStep(1)} className="rounded-lg p-1.5 hover:bg-muted transition-colors">
                      <ChevronLeft className="size-4" />
                    </button>
                    <div>
                      <h2 className="text-lg font-bold">Elige un horario</h2>
                      <p className="text-xs text-muted-foreground">
                        {selectedDay} de {MONTHS[selectedMonth]} · {selectedTypeMeta?.duration}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => { setSelectedTime(slot); setStep(3); }}
                        className={cn(
                          "rounded-xl border py-3 text-sm font-medium transition-all duration-150",
                          selectedTime === slot
                            ? "border-violet-500 bg-violet-500 text-white"
                            : "border-border bg-card hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-violet-300"
                        )}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">Horario de Lima, Perú (GMT-5)</p>
                </motion.div>
              )}

              {/* ── STEP 3: contact form ── */}
              {step === 3 && !submitted && (
                <motion.div key="step3" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="p-6 space-y-5">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setStep(2)} className="rounded-lg p-1.5 hover:bg-muted transition-colors">
                      <ChevronLeft className="size-4" />
                    </button>
                    <div>
                      <h2 className="text-lg font-bold">Tus datos</h2>
                      <p className="text-xs text-muted-foreground">
                        {selectedDay} de {MONTHS[selectedMonth]} · {selectedTime} · {selectedTypeMeta?.duration}
                      </p>
                    </div>
                  </div>

                  {/* summary card */}
                  <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-4 text-sm space-y-1">
                    <div className="flex items-center gap-2 font-semibold text-violet-300">
                      <span>{selectedTypeMeta?.icon}</span>
                      {selectedTypeMeta?.label}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                      <span className="flex items-center gap-1"><Clock className="size-3" />{selectedTypeMeta?.duration}</span>
                      <span className="flex items-center gap-1"><Calendar className="size-3" />{selectedDay} de {MONTHS[selectedMonth]}, {selectedYear}</span>
                      <span>{selectedTime} (GMT-5)</span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                        <User className="size-3" /> Nombre completo *
                      </label>
                      <input
                        required
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Tu nombre"
                        className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                        <Mail className="size-3" /> Email *
                      </label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="tu@email.com"
                        className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                        <MessageSquare className="size-3" /> Cuéntame sobre tu proyecto
                      </label>
                      <textarea
                        rows={3}
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        placeholder="¿Qué necesitas? ¿Cuál es tu objetivo?"
                        className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all resize-none"
                      />
                    </div>
                    {sendError && (
                      <p className="text-xs text-red-400 text-center">{sendError}</p>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                          </svg>
                          Enviando…
                        </span>
                      ) : (
                        <>Confirmar reunión <ArrowRight className="size-4" /></>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* ── SUCCESS ── */}
              {submitted && (
                <motion.div key="success" variants={fadeVariants} initial="hidden" animate="visible" className="p-12 flex flex-col items-center text-center space-y-4">
                  <div className="size-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="size-8 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">¡Solicitud enviada!</h2>
                    <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                      Te responderé a <span className="text-foreground font-medium">{form.email}</span> para confirmar la reunión del{" "}
                      <span className="text-violet-400">{selectedDay} de {MONTHS[selectedMonth]} a las {selectedTime}</span>.
                    </p>
                  </div>
                  <Dialog.Close className="mt-4 rounded-xl border border-border px-6 py-2.5 text-sm font-semibold hover:bg-muted transition-colors">
                    Cerrar
                  </Dialog.Close>
                </motion.div>
              )}

            </AnimatePresence>
            )}

          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
