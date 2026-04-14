import Navbar from "@/components/navbar";
import { locales, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  if (!locales.includes(params.locale)) notFound();

  return (
    <>
      {children}
      <Navbar locale={params.locale} />
    </>
  );
}
