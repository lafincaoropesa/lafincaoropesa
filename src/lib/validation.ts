export interface FieldErrors {
  [field: string]: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function isBlank(value: FormDataEntryValue | null): boolean {
  return typeof value !== "string" || value.trim().length === 0;
}

export interface WaitlistInput {
  firstName: string;
  lastName: string;
  email: string;
  stayPeriod: string;
  locale: string;
}

export function validateWaitlist(data: FormData): { values: WaitlistInput; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const firstName = String(data.get("firstName") ?? "").trim();
  const lastName = String(data.get("lastName") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const stayPeriod = String(data.get("stayPeriod") ?? "").trim();
  const locale = String(data.get("locale") ?? "es").trim();

  if (isBlank(data.get("firstName"))) errors.firstName = "required";
  if (isBlank(data.get("lastName"))) errors.lastName = "required";
  if (isBlank(data.get("email")) || !isValidEmail(email)) errors.email = "invalid";

  return { values: { firstName, lastName, email, stayPeriod, locale }, errors };
}

export interface StayRequestInput {
  name: string;
  email: string;
  phone: string;
  dates: string;
  guests: string;
  message: string;
  locale: string;
}

export function validateStayRequest(data: FormData): { values: StayRequestInput; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const name = String(data.get("name") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const phone = String(data.get("phone") ?? "").trim();
  const dates = String(data.get("dates") ?? "").trim();
  const guests = String(data.get("guests") ?? "").trim();
  const message = String(data.get("message") ?? "").trim();
  const locale = String(data.get("locale") ?? "es").trim();

  if (isBlank(data.get("name"))) errors.name = "required";
  if (isBlank(data.get("email")) || !isValidEmail(email)) errors.email = "invalid";
  if (isBlank(data.get("dates"))) errors.dates = "required";
  if (isBlank(data.get("guests"))) errors.guests = "required";
  if (isBlank(data.get("message"))) errors.message = "required";

  return { values: { name, email, phone, dates, guests, message, locale }, errors };
}
