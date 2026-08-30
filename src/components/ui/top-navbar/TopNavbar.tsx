"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookOpen, ExternalLink, FileText, FolderTree, GraduationCap, LayoutDashboard, LibraryBig, LogOut, Mail, Menu, NotebookPen, Settings, UserRound, X } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/dashboard/home", label: "Resumen", icon: LayoutDashboard },
  { href: "/dashboard/blog", label: "Contenido", icon: FileText },
  { href: "/dashboard/blog/create", label: "Nuevo contenido", icon: NotebookPen },
  { href: "/dashboard/categories", label: "Categorías", icon: FolderTree },
  { href: "/dashboard/series", label: "Series y cursos", icon: LibraryBig },
  { href: "/dashboard/community", label: "Comunidad", icon: Mail },
  { href: "/dashboard/profile", label: "Mi perfil", icon: UserRound },
  { href: "/dashboard/settings", label: "Configuración", icon: Settings },
];

export default function TopNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return <>
    <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center border-b bg-background/90 px-4 backdrop-blur lg:hidden">
      <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} aria-label="Abrir navegación">{open ? <X /> : <Menu />}</Button>
      <div className="ml-3"><p className="font-bold">Anthony CMS</p><p className="text-[11px] text-muted-foreground">Centro de contenidos</p></div>
    </header>
    <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r bg-card transition-transform lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
      <div className="flex h-20 items-center gap-3 border-b px-6">
        <div className="grid size-10 place-items-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-600/20"><GraduationCap className="size-5" /></div>
        <div><p className="font-bold tracking-tight">Anthony CMS</p><p className="text-xs text-muted-foreground">Contenido educativo</p></div>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Administración</p>
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href === "/dashboard/blog" && pathname.startsWith("/dashboard/blog/") && pathname !== "/dashboard/blog/create");
          return <Link key={href} href={href} onClick={() => setOpen(false)} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors", active ? "bg-violet-500/12 text-violet-500" : "text-muted-foreground hover:bg-muted hover:text-foreground")}><Icon className="size-4" />{label}</Link>;
        })}
        <p className="mb-3 mt-8 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Plataforma</p>
        <Link href="/blog" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"><BookOpen className="size-4" /> Ver academia <ExternalLink className="ml-auto size-3" /></Link>
      </nav>
      <div className="border-t p-4"><Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" onClick={() => signOut({ callbackUrl: "/login" })}><LogOut className="size-4" /> Cerrar sesión</Button></div>
    </aside>
  </>;
}
