import prisma from "@/lib/db";
import { sendWelcomeEmail } from "@/lib/newsletter";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  if (!token) return NextResponse.redirect(new URL("/blog?subscription=invalid", request.url));
  const subscriber = await prisma.subscriber.findUnique({ where: { confirmationToken: token } });
  if (!subscriber) return NextResponse.redirect(new URL("/blog?subscription=invalid", request.url));
  if (subscriber.active && subscriber.confirmedAt) return NextResponse.redirect(new URL("/blog?subscription=already-confirmed", request.url));

  const confirmed = await prisma.subscriber.update({
    where: { id: subscriber.id },
    data: { active: true, confirmedAt: new Date(), confirmationToken: randomUUID() },
  });
  const welcome = await sendWelcomeEmail(confirmed.email, confirmed.unsubscribeToken);
  return NextResponse.redirect(new URL(`/blog?subscription=confirmed&welcome=${welcome.sent ? "sent" : "failed"}`, request.url));
}
