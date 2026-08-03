import type { APIRoute } from "astro";
import { validateWaitlist } from "../../lib/validation";
import { sendWaitlistEmails } from "../../lib/email";
import { isRateLimited, clientKeyFromRequest } from "../../lib/rateLimit";
import { pathTo } from "../../i18n/routes";
import { LOCALES, type Locale } from "../../config/site";

export const prerender = false;

function localeFrom(data: FormData): Locale {
  const raw = String(data.get("locale") ?? "");
  return (LOCALES as readonly string[]).includes(raw) ? (raw as Locale) : "es";
}

function confirmationRedirect(request: Request, locale: Locale, status: "success" | "error"): Response {
  const url = new URL(pathTo("confirmation", locale), request.url);
  url.searchParams.set("form", "waitlist");
  url.searchParams.set("status", status);
  return new Response(null, { status: 303, headers: { Location: url.toString() } });
}

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const wantsJson = (request.headers.get("accept") ?? "").includes("application/json");
  const locale = localeFrom(data);

  function respondError(status: number, errors?: Record<string, string>) {
    if (wantsJson) {
      return new Response(JSON.stringify({ ok: false, errors }), {
        status,
        headers: { "content-type": "application/json" },
      });
    }
    return confirmationRedirect(request, locale, "error");
  }

  function respondSuccess(): Response {
    if (wantsJson) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }
    return confirmationRedirect(request, locale, "success");
  }

  // Honeypot : champ invisible pour les humains, souvent rempli par les robots.
  if (!isBlankField(data.get("website"))) {
    return respondSuccess();
  }

  if (isRateLimited(clientKeyFromRequest(request))) {
    return respondError(429);
  }

  const { values, errors } = validateWaitlist(data);
  if (Object.keys(errors).length > 0) {
    return respondError(400, errors);
  }

  try {
    await sendWaitlistEmails(values);
  } catch (err) {
    console.error("waitlist email error", err);
    return respondError(502);
  }

  return respondSuccess();
};

function isBlankField(value: FormDataEntryValue | null): boolean {
  return typeof value !== "string" || value.trim().length === 0;
}
