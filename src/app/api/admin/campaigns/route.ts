import prisma from "@/lib/db";
import { sendNewsletterCampaign } from "@/lib/newsletter";
import { authOptions } from "@/lib/options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function authorized() {
  const session = await getServerSession(authOptions);
  return !!session?.user?.id && session.user.role === "ADMIN";
}

export async function GET() {
  if (!await authorized()) return NextResponse.json({ message: "No autorizado" }, { status: 403 });
  return NextResponse.json(await prisma.newsletterCampaign.findMany({ orderBy: { createdAt: "desc" }, take: 30 }));
}

export async function POST(request: Request) {
  if (!await authorized()) return NextResponse.json({ message: "No autorizado" }, { status: 403 });
  const data = await request.json();
  const subject = String(data.subject ?? "").trim();
  const content = String(data.content ?? "").trim();
  const previewText = String(data.previewText ?? "").trim() || null;
  const buttonLabel = String(data.buttonLabel ?? "").trim() || null;
  const buttonUrl = String(data.buttonUrl ?? "").trim() || null;
  if (subject.length < 3 || content.length < 10) return NextResponse.json({ message: "Completa un asunto y un mensaje válido" }, { status: 400 });
  if ((buttonLabel && !buttonUrl) || (!buttonLabel && buttonUrl)) return NextResponse.json({ message: "El botón necesita texto y enlace" }, { status: 400 });
  if (buttonUrl && !/^https?:\/\//i.test(buttonUrl)) return NextResponse.json({ message: "El enlace debe comenzar con http:// o https://" }, { status: 400 });

  const campaign = await prisma.newsletterCampaign.create({ data: { subject, previewText, content, buttonLabel, buttonUrl, status: "SENDING" } });
  try {
    const delivery = await sendNewsletterCampaign({ subject, previewText, content, buttonLabel, buttonUrl });
    const saved = await prisma.newsletterCampaign.update({ where: { id: campaign.id }, data: { status: delivery.completed ? "SENT" : "FAILED", recipientCount: delivery.sent, sentAt: delivery.completed ? new Date() : null, errorMessage: delivery.completed ? null : delivery.reason } });
    return NextResponse.json({ campaign: saved, delivery }, { status: delivery.completed ? 201 : 422 });
  } catch (error) {
    await prisma.newsletterCampaign.update({ where: { id: campaign.id }, data: { status: "FAILED", errorMessage: error instanceof Error ? error.message : "unknown_error" } });
    return NextResponse.json({ message: "La campaña no pudo enviarse" }, { status: 500 });
  }
}
