import { useRef, useState, type FormEvent } from "react";
import { CONTACT_SUBJECTS } from "@/data/site";
import { maxLen, required, submitForm, summaryText, validateEmail } from "@/lib/forms";
import { useValidatedForm, type Errors } from "@/hooks/use-validated-form";
import { DeliveryNotice, ErrorSummary, Field, SubmitButton, SuccessNotice } from "../FormField";

type V = { name: string; email: string; subject: string; message: string };
const LABELS: Record<string, string> = { name: "Name", email: "Email", subject: "Subject", message: "Message" };
const P = "contact";
const INITIAL: V = { name: "", email: "", subject: CONTACT_SUBJECTS[0] ?? "", message: "" };

function validate(v: V): Errors<V> {
  return {
    name: required(v.name, "Enter your name."),
    email: validateEmail(v.email),
    message: required(v.message, "Write a short message.") || maxLen(v.message, 1000, "Your message"),
  };
}

export function ContactForm() {
  const f = useValidatedForm<V>(INITIAL, validate);
  const [summaryErrors, setSummaryErrors] = useState<[string, string][]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { status: "sent" | "not-connected" | "error"; message?: string | undefined; summary: string }>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setResult(null);
    const errs = f.validateAll() as [string, string][];
    setSummaryErrors(errs);
    if (errs.length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    const v = f.values;
    const summary = summaryText("Message", [["Name", v.name], ["Email", v.email], ["Subject", v.subject], ["Message", v.message]]);
    setLoading(true);
    const res = await submitForm("contact", v);
    setLoading(false);
    setResult({ status: res.status, message: res.status === "error" ? res.message : undefined, summary });
    if (res.status === "sent") f.reset();
  };

  if (result?.status === "sent") return <SuccessNotice>Thank you. Your message was sent. We will reply by email.</SuccessNotice>;

  return (
    <form noValidate onSubmit={onSubmit} aria-label="Contact form">
      <ErrorSummary ref={summaryRef} errors={summaryErrors} labels={LABELS} idPrefix={P} />
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={`${P}-name`} label="Name" required error={f.errors.name}>
          {(a) => <input {...a} className="field-input" autoComplete="name" value={f.values.name} onChange={(e) => f.set("name", e.target.value)} onBlur={() => f.blur("name")} />}
        </Field>
        <Field id={`${P}-email`} label="Email" required error={f.errors.email}>
          {(a) => <input {...a} type="email" autoComplete="email" className="field-input" value={f.values.email} onChange={(e) => f.set("email", e.target.value)} onBlur={() => f.blur("email")} />}
        </Field>
        <Field id={`${P}-subject`} label="Subject" className="sm:col-span-2">
          {(a) => (
            <select {...a} className="field-input" value={f.values.subject} onChange={(e) => f.set("subject", e.target.value)}>
              {CONTACT_SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          )}
        </Field>
        <Field id={`${P}-message`} label="Message" required error={f.errors.message} hint={`${f.values.message.length} / 1000 characters`} className="sm:col-span-2">
          {(a) => <textarea {...a} rows={6} maxLength={1000} className="field-input" value={f.values.message} onChange={(e) => f.set("message", e.target.value)} onBlur={() => f.blur("message")} />}
        </Field>
      </div>
      <div className="mt-8 space-y-6">
        <SubmitButton loading={loading}>Send Message</SubmitButton>
        <div aria-live="polite">
          {result ? (
            <DeliveryNotice state={result.status} errorMessage={result.message} summary={result.summary} subject={f.values.subject} />
          ) : null}
        </div>
      </div>
    </form>
  );
}
