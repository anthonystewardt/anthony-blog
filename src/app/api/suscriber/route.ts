import { sendConfirmationEmail } from "@/lib/newsletter";
import { authOptions } from "@/lib/options";
import prisma from "@/lib/db";
import { randomUUID } from "node:crypto";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") return NextResponse.json({ message: "No autorizado" }, { status: 403 });
  return NextResponse.json(await prisma.subscriber.findMany({ select: { id: true, email: true, active: true, confirmedAt: true, createdAt: true }, orderBy: { createdAt: "desc" } }));
}

export async function POST(req: Request) {
  const data = await req.json();
  const email = String(data.email ?? "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ message: "Correo no válido" }, { status: 400 });
  if (data.consent !== true) return NextResponse.json({ message: "Debes aceptar recibir novedades" }, { status: 400 });
  const existing = await prisma.subscriber.findUnique({ where: { email } });
  if (existing?.active && existing.confirmedAt) return NextResponse.json({ message: "Este correo ya forma parte de la comunidad", status: "active", emailSent: false });
  const subscriber = existing
    ? existing.confirmedAt
      ? await prisma.subscriber.update({ where: { email }, data: { active: false, confirmedAt: null, confirmationToken: randomUUID() } })
      : existing
    : await prisma.subscriber.create({ data: { email } });
  const delivery = await sendConfirmationEmail(email, subscriber.confirmationToken);
  if (!delivery.sent) return NextResponse.json({ message: deliveryMessage(delivery.reason), status: "pending", emailSent: false }, { status: 503 });
  return NextResponse.json({ message: existing ? "Ya había una suscripción pendiente. Reenviamos el enlace de confirmación." : "Revisa tu correo para confirmar la suscripción", status: "pending", emailSent: true }, { status: existing ? 200 : 201 });
}

function deliveryMessage(reason?: string) {
  if (reason === "missing_api_key") return "El correo no pudo enviarse porque Resend todavía no está configurado.";
  if (reason?.toLowerCase().includes("domain") || reason?.toLowerCase().includes("testing")) return "Resend rechazó el envío. Verifica el dominio remitente o usa el correo autorizado por tu cuenta de prueba.";
  return "La suscripción quedó pendiente, pero Resend no pudo entregar el correo. Revisa el remitente configurado.";
}
