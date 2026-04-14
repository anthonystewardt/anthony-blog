import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const OWNER_EMAIL = process.env.RESENT_EMAIL_OWNER ?? "anthonystewardt1996@gmail.com";
const FROM = "Anthony Portfolio <onboarding@resend.dev>";

/* ── Types ─────────────────────────────────────── */
interface ContactPayload {
  type: "booking" | "contact";
  // booking fields
  meetingType?: string;
  meetingDuration?: string;
  date?: string;
  time?: string;
  // shared
  name: string;
  email: string;
  message: string;
}

/* ── HTML email templates ────────────────────────  */
function bookingEmailHtml(data: ContactPayload) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e0a3c,#0f172a);border-radius:16px 16px 0 0;padding:36px 40px;border:1px solid #27272a;">
              <p style="margin:0 0 8px;font-size:12px;color:#a78bfa;letter-spacing:3px;text-transform:uppercase;font-weight:700;">Nueva solicitud de reunión</p>
              <h1 style="margin:0;font-size:28px;font-weight:800;color:#f4f4f5;line-height:1.2;">
                📅 ${data.meetingType}
              </h1>
              <p style="margin:10px 0 0;font-size:14px;color:#71717a;">Solicitado desde tu portfolio personal</p>
            </td>
          </tr>

          <!-- Meeting details -->
          <tr>
            <td style="background:#18181b;padding:32px 40px;border-left:1px solid #27272a;border-right:1px solid #27272a;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding:0 8px 0 0;">
                    <div style="background:#09090b;border:1px solid #27272a;border-radius:12px;padding:16px 20px;">
                      <p style="margin:0 0 4px;font-size:10px;color:#71717a;letter-spacing:2px;text-transform:uppercase;font-weight:600;">📆 Fecha</p>
                      <p style="margin:0;font-size:15px;color:#f4f4f5;font-weight:700;">${data.date}</p>
                    </div>
                  </td>
                  <td width="50%" style="padding:0 0 0 8px;">
                    <div style="background:#09090b;border:1px solid #27272a;border-radius:12px;padding:16px 20px;">
                      <p style="margin:0 0 4px;font-size:10px;color:#71717a;letter-spacing:2px;text-transform:uppercase;font-weight:600;">⏰ Hora</p>
                      <p style="margin:0;font-size:15px;color:#f4f4f5;font-weight:700;">${data.time} (GMT-5 Lima)</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top:12px;">
                    <div style="background:#09090b;border:1px solid #27272a;border-radius:12px;padding:16px 20px;">
                      <p style="margin:0 0 4px;font-size:10px;color:#71717a;letter-spacing:2px;text-transform:uppercase;font-weight:600;">⏱ Duración</p>
                      <p style="margin:0;font-size:15px;color:#f4f4f5;font-weight:700;">${data.meetingDuration}</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contact info -->
          <tr>
            <td style="background:#18181b;padding:0 40px 32px;border-left:1px solid #27272a;border-right:1px solid #27272a;">
              <p style="margin:0 0 16px;font-size:12px;color:#a78bfa;letter-spacing:2px;text-transform:uppercase;font-weight:700;">Datos del cliente</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding:0 8px 12px 0;">
                    <p style="margin:0 0 3px;font-size:11px;color:#71717a;font-weight:600;">👤 Nombre</p>
                    <p style="margin:0;font-size:14px;color:#f4f4f5;font-weight:600;">${data.name}</p>
                  </td>
                  <td width="50%" style="padding:0 0 12px 8px;">
                    <p style="margin:0 0 3px;font-size:11px;color:#71717a;font-weight:600;">📧 Email</p>
                    <a href="mailto:${data.email}" style="margin:0;font-size:14px;color:#a78bfa;font-weight:600;text-decoration:none;">${data.email}</a>
                  </td>
                </tr>
              </table>
              ${data.message ? `
              <div style="background:#09090b;border:1px solid #27272a;border-radius:12px;padding:16px 20px;margin-top:4px;">
                <p style="margin:0 0 6px;font-size:11px;color:#71717a;font-weight:600;">💬 Mensaje</p>
                <p style="margin:0;font-size:14px;color:#a1a1aa;line-height:1.6;">${data.message.replace(/\n/g, "<br/>")}</p>
              </div>` : ""}
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="background:#18181b;padding:0 40px 32px;border-left:1px solid #27272a;border-right:1px solid #27272a;">
              <a href="mailto:${data.email}?subject=Confirmación de reunión — ${data.meetingType}"
                style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;font-weight:700;font-size:14px;padding:14px 28px;border-radius:10px;text-decoration:none;">
                ✉️ Responder a ${data.name}
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#09090b;border:1px solid #27272a;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#52525b;">Enviado desde tu portfolio · Anthony Sanchez</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function confirmationEmailHtml(data: ContactPayload) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e0a3c,#0f172a);border-radius:16px 16px 0 0;padding:36px 40px;border:1px solid #27272a;text-align:center;">
              <div style="font-size:48px;margin-bottom:12px;">✅</div>
              <h1 style="margin:0;font-size:26px;font-weight:800;color:#f4f4f5;">¡Solicitud recibida!</h1>
              <p style="margin:10px 0 0;font-size:14px;color:#a1a1aa;">Te confirmaré la reunión en menos de 24 horas.</p>
            </td>
          </tr>

          <!-- Details -->
          <tr>
            <td style="background:#18181b;padding:32px 40px;border-left:1px solid #27272a;border-right:1px solid #27272a;">
              <p style="margin:0 0 16px;font-size:13px;color:#f4f4f5;">Hola <strong>${data.name}</strong>,</p>
              <p style="margin:0 0 20px;font-size:13px;color:#a1a1aa;line-height:1.6;">
                Recibí tu solicitud para una <strong style="color:#f4f4f5;">${data.meetingType}</strong>. Aquí está el resumen de tu solicitud:
              </p>
              <div style="background:#09090b;border:1px solid #3f3f46;border-left:3px solid #7c3aed;border-radius:8px;padding:20px;">
                <table width="100%">
                  <tr>
                    <td style="padding:4px 0;font-size:13px;color:#71717a;">📅 Fecha solicitada</td>
                    <td style="padding:4px 0;font-size:13px;color:#f4f4f5;text-align:right;font-weight:600;">${data.date}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;font-size:13px;color:#71717a;">⏰ Hora</td>
                    <td style="padding:4px 0;font-size:13px;color:#f4f4f5;text-align:right;font-weight:600;">${data.time} (Lima, GMT-5)</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;font-size:13px;color:#71717a;">⏱ Duración</td>
                    <td style="padding:4px 0;font-size:13px;color:#f4f4f5;text-align:right;font-weight:600;">${data.meetingDuration}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;font-size:13px;color:#71717a;">💻 Modalidad</td>
                    <td style="padding:4px 0;font-size:13px;color:#f4f4f5;text-align:right;font-weight:600;">Google Meet / Zoom</td>
                  </tr>
                </table>
              </div>
              <p style="margin:20px 0 0;font-size:13px;color:#a1a1aa;line-height:1.6;">
                Recibirás el link de la videollamada junto con la confirmación. Si tienes alguna duda,
                responde este correo o escríbeme directo por Instagram.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#09090b;border:1px solid #27272a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;color:#f4f4f5;font-weight:700;">Anthony Sanchez</p>
              <p style="margin:0;font-size:12px;color:#52525b;">Desarrollador Full Stack · Lima, Perú</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ── POST handler ────────────────────────────────  */
export async function POST(req: Request) {
  try {
    const body: ContactPayload = await req.json();
    const { name, email, message, meetingType, meetingDuration, date, time } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Nombre y email son requeridos." }, { status: 400 });
    }

    const subject = body.type === "booking"
      ? `📅 Nueva reunión: ${meetingType} — ${date} ${time}`
      : `✉️ Nuevo mensaje de contacto — ${name}`;

    // 1️⃣  Notify owner
    await resend.emails.send({
      from: FROM,
      to: OWNER_EMAIL,
      subject,
      html: bookingEmailHtml(body),
    });

    // 2️⃣  Confirmation to the person who booked
    if (body.type === "booking") {
      await resend.emails.send({
        from: FROM,
        to: email,
        subject: `✅ Solicitud de reunión recibida — Anthony Sanchez`,
        html: confirmationEmailHtml(body),
      });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("[contact/route] error:", error);
    return NextResponse.json({ error: "Error al enviar el email." }, { status: 500 });
  }
}
