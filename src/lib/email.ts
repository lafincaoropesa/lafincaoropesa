import { Resend } from "resend";
import { SITE } from "../config/site";
import { getDictionary } from "../i18n/ui";
import type { Locale } from "../config/site";
import type { WaitlistInput, StayRequestInput } from "./validation";

function getResend(): Resend {
  // En dev, Astro/Vite charge .env dans import.meta.env (pas dans process.env brut).
  // En production sur Vercel, la variable d'environnement arrive via process.env.
  const apiKey = import.meta.env.RESEND_API_KEY ?? process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY manquante. Voir DEPLOIEMENT.md pour configurer la variable d'environnement sur Vercel.",
    );
  }
  return new Resend(apiKey);
}

const FROM_ADDRESS = "La Finca Oropesa <no-responder@lafincaoropesa.com>";

function confirmationCopy(locale: Locale) {
  const t = getDictionary(locale);
  return {
    es: {
      subject: "Hemos recibido tu solicitud — La Finca Oropesa",
      greeting: "Gracias.",
      body: "Hemos recibido tu mensaje. Te responderemos en cuanto podamos.",
      signature: "La Finca Oropesa",
    },
    fr: {
      subject: "Nous avons bien reçu ta demande — La Finca Oropesa",
      greeting: "Merci.",
      body: "Nous avons bien reçu ton message. Nous te répondrons dès que possible.",
      signature: "La Finca Oropesa",
    },
    en: {
      subject: "We've received your request — La Finca Oropesa",
      greeting: "Thank you.",
      body: "We've received your message. We'll get back to you as soon as we can.",
      signature: "La Finca Oropesa",
    },
  }[locale] ?? {
    subject: t.forms.waitlist.title,
    greeting: "",
    body: "",
    signature: "La Finca Oropesa",
  };
}

function confirmationHtml(locale: Locale): string {
  const copy = confirmationCopy(locale);
  return `<!doctype html>
<html lang="${locale}">
  <body style="margin:0;background-color:#F2EFE6;font-family:Georgia,serif;color:#2E3524;">
    <table role="presentation" width="100%" style="max-width:480px;margin:0 auto;padding:48px 24px;">
      <tr><td>
        <p style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#5C6440;margin:0 0 24px;">La Finca Oropesa</p>
        <p style="font-size:22px;margin:0 0 16px;">${copy.greeting}</p>
        <p style="font-size:15px;line-height:1.6;margin:0 0 32px;">${copy.body}</p>
        <p style="font-size:13px;color:#5C6440;margin:0;">${copy.signature}</p>
      </td></tr>
    </table>
  </body>
</html>`;
}

export async function sendWaitlistEmails(input: WaitlistInput): Promise<void> {
  const resend = getResend();
  const locale = (["es", "fr", "en"].includes(input.locale) ? input.locale : "es") as Locale;

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: SITE.contact.email,
    replyTo: input.email,
    subject: `Lista de espera · ${input.firstName} ${input.lastName}`,
    text: [
      `Nueva inscripción a la lista de espera`,
      `Nombre: ${input.firstName} ${input.lastName}`,
      `Email: ${input.email}`,
      `Periodo de estancia: ${input.stayPeriod || "—"}`,
      `Idioma: ${input.locale}`,
    ].join("\n"),
  });

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: input.email,
    subject: confirmationCopy(locale).subject,
    html: confirmationHtml(locale),
  });
}

export async function sendStayRequestEmails(input: StayRequestInput): Promise<void> {
  const resend = getResend();
  const locale = (["es", "fr", "en"].includes(input.locale) ? input.locale : "es") as Locale;

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: SITE.contact.email,
    replyTo: input.email,
    subject: `Solicitud de información · ${input.name}`,
    text: [
      `Nueva solicitud de información`,
      `Nombre: ${input.name}`,
      `Email: ${input.email}`,
      `Teléfono: ${input.phone || "—"}`,
      `Fechas: ${input.dates}`,
      `Personas: ${input.guests}`,
      `Idioma: ${input.locale}`,
      ``,
      `Mensaje:`,
      input.message,
    ].join("\n"),
  });

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: input.email,
    subject: confirmationCopy(locale).subject,
    html: confirmationHtml(locale),
  });
}
