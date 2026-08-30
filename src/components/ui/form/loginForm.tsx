"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    // Remove credentials left by a native GET submission from old/stale clients.
    if (searchParams.has("email") || searchParams.has("password")) {
      window.history.replaceState(null, "", "/login");
    }
  }, [searchParams]);

  function validate() {
    const next: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Ingresa un correo válido";
    if (password.length < 12) next.password = "La contraseña debe tener al menos 12 caracteres";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await signIn("credentials", { redirect: false, email: email.trim().toLowerCase(), password });
      if (!result?.ok || result.error) {
        toast.error("Credenciales incorrectas o acceso no autorizado");
        return;
      }
      toast.success("Acceso verificado");
      const requested = searchParams.get("callbackUrl");
      const destination = requested?.startsWith("/") ? requested : "/dashboard/home";
      router.replace(destination);
      router.refresh();
    } catch {
      toast.error("No fue posible iniciar sesión. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-5" method="post" action="/login" onSubmit={handleSubmit} noValidate>
      <label className="block">
        <span className="mb-2 block text-xs font-semibold text-white/65">Correo administrativo</span>
        <div className="group relative">
          <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/25 transition-colors group-focus-within:text-violet-300" />
          <Input name="email" type="email" autoComplete="email" value={email} onChange={e=>{setEmail(e.target.value);setErrors(x=>({...x,email:undefined}))}} placeholder="admin@tuacademia.com" className="h-12 rounded-xl border-white/10 bg-white/[0.055] pl-10 text-white placeholder:text-white/20 focus-visible:border-violet-400/50 focus-visible:ring-violet-400/20" />
        </div>
        {errors.email && <span className="mt-1.5 block text-xs text-rose-300">{errors.email}</span>}
      </label>
      <label className="block">
        <div className="mb-2 flex items-center justify-between"><span className="text-xs font-semibold text-white/65">Contraseña</span><span className="text-[11px] text-white/25">Acceso cifrado</span></div>
        <div className="group relative">
          <LockKeyhole className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/25 transition-colors group-focus-within:text-violet-300" />
          <Input name="password" type={showPassword?"text":"password"} autoComplete="current-password" value={password} onChange={e=>{setPassword(e.target.value);setErrors(x=>({...x,password:undefined}))}} placeholder="••••••••••••" className="h-12 rounded-xl border-white/10 bg-white/[0.055] px-10 text-white placeholder:text-white/20 focus-visible:border-violet-400/50 focus-visible:ring-violet-400/20" />
          <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/30 hover:bg-white/5 hover:text-white" aria-label={showPassword?"Ocultar contraseña":"Mostrar contraseña"}>{showPassword?<EyeOff className="size-4"/>:<Eye className="size-4"/>}</button>
        </div>
        {errors.password && <span className="mt-1.5 block text-xs text-rose-300">{errors.password}</span>}
      </label>
      <Button type="submit" disabled={loading} className="group h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold text-white shadow-lg shadow-violet-900/30 hover:from-violet-500 hover:to-indigo-500">
        {loading?<><Loader2 className="mr-2 size-4 animate-spin"/> Verificando acceso…</>:<>Entrar al workspace <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1"/></>}
      </Button>
      <p className="text-center text-[11px] leading-relaxed text-white/25">Al continuar confirmas que eres un administrador autorizado de esta plataforma.</p>
    </form>
  );
}
