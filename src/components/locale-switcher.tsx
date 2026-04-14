"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const other: Locale = locale === "es" ? "en" : "es";

  // Swap the locale segment in the current path
  const newPath = pathname.replace(new RegExp(`^/${locale}(/|$)`), `/${other}$1`);

  return (
    <Link
      href={newPath}
      title={other === "en" ? "Switch to English" : "Cambiar a Español"}
      className={cn(
        "flex items-center justify-center size-9 rounded-xl text-xs font-bold",
        "border border-border/60 bg-card/80 hover:bg-muted hover:border-border",
        "text-muted-foreground hover:text-foreground transition-all"
      )}
    >
      {other.toUpperCase()}
    </Link>
  );
}
