import { BRAND } from "@/data/site";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const ZIP_RE = /^\d{5}(-\d{4})?$/;

export function validateEmail(v: string) {
  if (!v.trim()) return "Enter your email address.";
  if (!EMAIL_RE.test(v.trim())) return "Enter a valid email address, like name@example.com";
  return "";
}
export function validateZip(v: string) {
  if (!v.trim()) return "Enter a 5 digit ZIP code";
  if (!ZIP_RE.test(v.trim())) return "Enter a 5 digit ZIP code (or ZIP+4, like 98327-1234)";
  return "";
}
export function required(v: string, message: string) {
  return v.trim() ? "" : message;
}
export function maxLen(v: string, n: number, label: string) {
  return v.length > n ? `${label} must be ${n} characters or fewer.` : "";
}

export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export function validateFile(file: File | null) {
  if (!file) return "";
  const okType = file.type.startsWith("image/") || file.type === "application/pdf";
  if (!okType) return "Choose an image or PDF file.";
  if (file.size > MAX_FILE_BYTES) return "Choose a file smaller than 5 MB.";
  return "";
}

export type SubmitResult =
  | { status: "sent" }
  | { status: "not-connected" }
  | { status: "error"; message: string };

/** Endpoint comes from a public build variable. Empty means delivery is not connected. */
export function getFormEndpoint(): string {
  return (import.meta.env["VITE_FORM_ENDPOINT"] as string | undefined)?.trim() ?? "";
}

/**
 * Sends a form to the configured endpoint. Reports "sent" only after a successful response.
 * Without an endpoint it never pretends to send.
 */
export async function submitForm(
  formName: string,
  data: Record<string, unknown>,
  endpoint: string = getFormEndpoint(),
): Promise<SubmitResult> {
  if (!endpoint) return { status: "not-connected" };
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ form: formName, ...data }),
    });
    if (!res.ok) return { status: "error", message: `The request could not be delivered (status ${res.status}).` };
    return { status: "sent" };
  } catch {
    return { status: "error", message: "The request could not be delivered. Check your connection and try again." };
  }
}

export function summaryText(title: string, rows: [string, string | number | undefined | null][]) {
  const lines = rows.filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "").map(([k, v]) => `${k}: ${v}`);
  return [`${title} — ${BRAND.name}`, "", ...lines].join("\n");
}

export function mailtoHref(subject: string, body: string) {
  if (!BRAND.email) return "";
  return `mailto:${BRAND.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
