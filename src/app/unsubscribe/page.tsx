import UnsubscribeModal from "@/components/blog/unsubscribe-modal";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cancelar suscripción", robots: { index: false, follow: false } };

export default function UnsubscribePage({ searchParams }: { searchParams: { token?: string } }) {
  return <main className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,.15),transparent_45%)]"><UnsubscribeModal token={searchParams.token} /></main>;
}
