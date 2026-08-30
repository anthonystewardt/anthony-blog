import prisma from "@/lib/db";
import { sendUnsubscribeConfirmationEmail } from "@/lib/newsletter";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  const destination = new URL("/unsubscribe", request.url);
  if (token) destination.searchParams.set("token", token);
  return NextResponse.redirect(destination);
}

export async function POST(request: Request) {
  const data = await request.json();
  const token = String(data.token ?? "");
  if (!token) return NextResponse.json({ message: "Enlace de cancelación no válido" }, { status: 400 });
  const subscriber = await prisma.subscriber.findUnique({ where: { unsubscribeToken: token } });
  if (!subscriber) return NextResponse.json({ message: "El enlace de cancelación no es válido o ya expiró" }, { status: 404 });
  if (!subscriber.active) return NextResponse.json({ message: "Esta suscripción ya estaba cancelada", status: "inactive", emailSent: false });

  await prisma.subscriber.update({ where: { id: subscriber.id }, data: { active: false } });
  const confirmation = await sendUnsubscribeConfirmationEmail(subscriber.email);
  return NextResponse.json({
    message: confirmation.sent ? "Suscripción cancelada y confirmación enviada" : "La suscripción fue cancelada, aunque no pudimos enviar la confirmación por correo",
    status: "unsubscribed",
    emailSent: confirmation.sent,
  });
}
