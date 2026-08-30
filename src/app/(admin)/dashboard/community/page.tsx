import CommunityManager from "@/components/admin/community-manager";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const [members, campaigns] = await Promise.all([
    prisma.subscriber.findMany({ select: { id: true, email: true, active: true, confirmedAt: true, createdAt: true }, orderBy: { createdAt: "desc" } }),
    prisma.newsletterCampaign.findMany({ select: { id: true, subject: true, status: true, recipientCount: true, sentAt: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 30 }),
  ]);
  return <section className="space-y-7"><div><p className="text-sm font-medium text-violet-500">Audiencia y comunicación</p><h1 className="mt-1 text-3xl font-bold">Comunidad</h1><p className="mt-2 text-sm text-muted-foreground">Gestiona miembros confirmados y crea campañas profesionales desde un solo lugar.</p></div><CommunityManager members={members} campaigns={campaigns} /></section>;
}
