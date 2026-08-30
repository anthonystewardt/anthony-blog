import prisma from "@/lib/db";
import { Resend } from "resend";

const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]!));
const chunks = <T,>(items: T[], size: number) => Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, (index + 1) * size));

async function getMailSettings() {
  return prisma.platformSettings.upsert({ where: { id: "main" }, create: { id: "main" }, update: {} });
}

const senderAddress = (configured: string) => process.env.RESEND_FROM_EMAIL ?? configured;

export async function sendConfirmationEmail(email: string, token: string) {
  if (!process.env.RESEND_API_KEY) return { sent: false, reason: "missing_api_key" };
  const settings = await getMailSettings();
  const url = `${settings.baseUrl.replace(/\/$/, "")}/api/subscribers/confirm?token=${encodeURIComponent(token)}`;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const result = await resend.emails.send({
    from: `${settings.senderName} <${senderAddress(settings.senderEmail)}>`, to: email, replyTo: settings.replyToEmail ?? undefined,
    subject: `Confirma tu suscripción a ${settings.academyName}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:32px;color:#18181b"><p style="color:#7c3aed;font-weight:700">${escapeHtml(settings.academyName)}</p><h1>Confirma tu suscripción</h1><p>Recibirás nuevas clases, tutoriales y apuntes cuando sean publicados.</p><a href="${url}" style="display:inline-block;background:#7c3aed;color:white;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:700">Confirmar suscripción</a><p style="margin-top:24px;color:#71717a;font-size:12px">Si no solicitaste esta suscripción, ignora este mensaje.</p></div>`,
  });
  return { sent: !result.error, reason: result.error?.message };
}

export async function sendWelcomeEmail(email: string, unsubscribeToken: string) {
  if (!process.env.RESEND_API_KEY) return { sent: false, reason: "missing_api_key" };
  const settings = await getMailSettings();
  const baseUrl = settings.baseUrl.replace(/\/$/, "");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const result = await resend.emails.send({
    from: `${settings.senderName} <${senderAddress(settings.senderEmail)}>`,
    to: email,
    replyTo: settings.replyToEmail ?? undefined,
    subject: `¡Bienvenido a ${settings.academyName}!`,
    html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:32px;color:#18181b"><p style="color:#7c3aed;font-weight:700">${escapeHtml(settings.academyName)}</p><h1>Ya eres parte de la comunidad 🎉</h1><p style="font-size:16px;line-height:1.7;color:#52525b">Tu suscripción quedó confirmada. Desde ahora recibirás nuevas clases, tutoriales y apuntes cuando sean publicados.</p><a href="${baseUrl}/blog" style="display:inline-block;margin-top:12px;background:#7c3aed;color:white;padding:13px 22px;border-radius:10px;text-decoration:none;font-weight:700">Explorar la academia</a><p style="margin-top:36px;font-size:11px;color:#a1a1aa">Puedes <a href="${baseUrl}/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}" style="color:#71717a">cancelar tu suscripción</a> cuando quieras.</p></div>`,
  });
  return { sent: !result.error, reason: result.error?.message };
}

export async function sendUnsubscribeConfirmationEmail(email: string) {
  if (!process.env.RESEND_API_KEY) return { sent: false, reason: "missing_api_key" };
  const settings = await getMailSettings();
  const baseUrl = settings.baseUrl.replace(/\/$/, "");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const result = await resend.emails.send({
    from: `${settings.senderName} <${senderAddress(settings.senderEmail)}>`,
    to: email,
    replyTo: settings.replyToEmail ?? undefined,
    subject: `Confirmación de salida de ${settings.academyName}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:32px;color:#18181b"><p style="color:#7c3aed;font-weight:700">${escapeHtml(settings.academyName)}</p><h1>Tu suscripción fue cancelada</h1><p style="font-size:16px;line-height:1.7;color:#52525b">Confirmamos que ya no recibirás nuevas clases, campañas ni actualizaciones de contenido de nuestra plataforma.</p><p style="font-size:16px;line-height:1.7;color:#52525b">Gracias por haber formado parte de la comunidad. Si cambias de opinión, siempre podrás volver.</p><a href="${baseUrl}/blog" style="display:inline-block;margin-top:12px;background:#7c3aed;color:white;padding:13px 22px;border-radius:10px;text-decoration:none;font-weight:700">Visitar la academia</a></div>`,
  });
  return { sent: !result.error, reason: result.error?.message };
}

export async function notifyNewPublication(post: { id: string; title: string; slug: string; resumen: string; type: string }) {
  if (!process.env.RESEND_API_KEY) return { completed: false, sent: 0, reason: "missing_api_key" };
  const settings = await getMailSettings();
  if (!settings.notifyOnPublish) return { completed: false, sent: 0, reason: "disabled" };
  const subscribers = await prisma.subscriber.findMany({ where: { active: true, confirmedAt: { not: null } }, select: { email: true, unsubscribeToken: true } });
  const resend = new Resend(process.env.RESEND_API_KEY);
  const articleUrl = `${settings.baseUrl.replace(/\/$/, "")}/blog/${post.slug}`;
  const payloads = subscribers.map(subscriber => {
    const unsubscribeUrl = `${settings.baseUrl.replace(/\/$/, "")}/unsubscribe?token=${encodeURIComponent(subscriber.unsubscribeToken)}`;
    return { from: `${settings.senderName} <${senderAddress(settings.senderEmail)}>`, to: subscriber.email, replyTo: settings.replyToEmail ?? undefined, subject: `Nuevo ${post.type.toLowerCase()}: ${post.title}`, html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:32px;color:#18181b"><p style="color:#7c3aed;font-weight:700">${escapeHtml(settings.academyName)}</p><p style="font-size:12px;text-transform:uppercase;color:#71717a">Nuevo contenido</p><h1>${escapeHtml(post.title)}</h1><p style="font-size:16px;line-height:1.6;color:#52525b">${escapeHtml(post.resumen)}</p><a href="${articleUrl}" style="display:inline-block;background:#7c3aed;color:white;padding:13px 22px;border-radius:10px;text-decoration:none;font-weight:700">Ver nueva lección</a><p style="margin-top:32px;font-size:11px;color:#a1a1aa">Recibes este correo porque confirmaste tu suscripción. <a href="${unsubscribeUrl}" style="color:#71717a">Cancelar suscripción</a></p></div>` };
  });
  for (const batch of chunks(payloads, 100)) {
    if (!batch.length) continue;
    const result = await resend.batch.send(batch);
    if (result.error) return { completed: false, sent: 0, reason: result.error.message };
  }
  return { completed: true, sent: subscribers.length };
}

export async function sendNewsletterCampaign(campaign: { subject: string; previewText?: string | null; content: string; buttonLabel?: string | null; buttonUrl?: string | null }) {
  if (!process.env.RESEND_API_KEY) return { completed: false, sent: 0, reason: "missing_api_key" };
  const settings = await getMailSettings();
  const subscribers = await prisma.subscriber.findMany({ where: { active: true, confirmedAt: { not: null } }, select: { email: true, unsubscribeToken: true } });
  if (!subscribers.length) return { completed: false, sent: 0, reason: "no_recipients" };
  const resend = new Resend(process.env.RESEND_API_KEY);
  const paragraphs = campaign.content.split(/\n{2,}/).map(paragraph => `<p style="font-size:16px;line-height:1.7;color:#52525b">${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`).join("");
  const button = campaign.buttonLabel && campaign.buttonUrl ? `<a href="${escapeHtml(campaign.buttonUrl)}" style="display:inline-block;margin-top:12px;background:#7c3aed;color:white;padding:13px 22px;border-radius:10px;text-decoration:none;font-weight:700">${escapeHtml(campaign.buttonLabel)}</a>` : "";
  let sent = 0;
  for (const batch of chunks(subscribers, 100)) {
    const payloads = batch.map(subscriber => {
      const unsubscribeUrl = `${settings.baseUrl.replace(/\/$/, "")}/unsubscribe?token=${encodeURIComponent(subscriber.unsubscribeToken)}`;
      return { from: `${settings.senderName} <${senderAddress(settings.senderEmail)}>`, to: subscriber.email, replyTo: settings.replyToEmail ?? undefined, subject: campaign.subject, html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:32px;color:#18181b"><div style="display:none;max-height:0;overflow:hidden">${escapeHtml(campaign.previewText ?? "")}</div><p style="color:#7c3aed;font-weight:700">${escapeHtml(settings.academyName)}</p>${paragraphs}${button}<p style="margin-top:36px;font-size:11px;color:#a1a1aa">Recibes este correo porque confirmaste tu suscripción. <a href="${unsubscribeUrl}" style="color:#71717a">Cancelar suscripción</a></p></div>` };
    });
    const result = await resend.batch.send(payloads);
    if (result.error) return { completed: false, sent, reason: result.error.message };
    sent += batch.length;
  }
  return { completed: true, sent };
}
