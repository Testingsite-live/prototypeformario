import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { INQUIRY_TYPES } from "@/data/site";
import { maxLen, required, submitForm, summaryText, validateEmail, validateFile } from "@/lib/forms";
import { useValidatedForm, type Errors } from "@/hooks/use-validated-form";
import { DeliveryNotice, ErrorSummary, Field, FieldError, SubmitButton, SuccessNotice } from "../FormField";

type V = { name: string; email: string; type: string; idea: string; quantity: string; neededBy: string };
const LABELS: Record<string, string> = {
  name: "Name",
  email: "Email",
  type: "What would you like made?",
  idea: "Engraving text or idea",
  quantity: "Quantity",
  file: "Reference file",
};
const P = "inq";

function validate(v: V): Errors<V> {
  const q = Number(v.quantity);
  return {
    name: required(v.name, "Enter your name."),
    email: validateEmail(v.email),
    type: required(v.type, "Choose what you would like made."),
    idea: required(v.idea, "Describe the engraving text or idea.") || maxLen(v.idea, 500, "Your idea"),
    quantity: !v.quantity || !Number.isInteger(q) || q < 1 ? "Enter a quantity of 1 or more." : "",
  };
}

export function InquiryForm({ prefill }: { prefill?: string | undefined }) {
  const initial = useRef<V>({ name: "", email: "", type: "", idea: prefill ?? "", quantity: "1", neededBy: "" }).current;
  const f = useValidatedForm<V>(initial, validate);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [summaryErrors, setSummaryErrors] = useState<[string, string][]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { status: "sent" | "not-connected" | "error"; message?: string | undefined; summary: string }>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const { set } = f;
  useEffect(() => {
    if (prefill) set("idea", prefill);
  }, [prefill, set]);

  const onFile = useCallback((fl: File | null) => {
    setFile(fl);
    setFileError(validateFile(fl));
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setResult(null);
    const errs = f.validateAll() as [string, string][];
    const fe = validateFile(file);
    setFileError(fe);
    const all = fe ? [...errs, ["file", fe] as [string, string]] : errs;
    setSummaryErrors(all);
    if (all.length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    const v = f.values;
    const summary = summaryText("Custom Piece Inquiry", [
      ["Name", v.name],
      ["Email", v.email],
      ["Piece", v.type],
      ["Engraving text or idea", v.idea],
      ["Quantity", v.quantity],
      ["Needed by", v.neededBy],
      ["Reference file", file ? `${file.name} (attach separately)` : ""],
    ]);
    setLoading(true);
    const res = await submitForm("custom-inquiry", { ...v, referenceFileName: file?.name ?? "" });
    setLoading(false);
    setResult({ status: res.status, message: res.status === "error" ? res.message : undefined, summary });
    if (res.status === "sent") f.reset();
  };

  if (result?.status === "sent") {
    return (
      <div className="space-y-4">
        <SuccessNotice>Thank you. Your custom inquiry was sent. We will reply by email.</SuccessNotice>
        <Link to="/shop" className="link-draw text-walnut">Back to shop</Link>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} aria-labelledby="inquiry-title">
      <ErrorSummary ref={summaryRef} errors={summaryErrors} labels={LABELS} idPrefix={P} />
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={`${P}-name`} label="Name" required error={f.errors.name}>
          {(a) => <input {...a} className="field-input" autoComplete="name" value={f.values.name} onChange={(e) => f.set("name", e.target.value)} onBlur={() => f.blur("name")} />}
        </Field>
        <Field id={`${P}-email`} label="Email" required error={f.errors.email}>
          {(a) => <input {...a} type="email" className="field-input" autoComplete="email" value={f.values.email} onChange={(e) => f.set("email", e.target.value)} onBlur={() => f.blur("email")} />}
        </Field>
        <Field id={`${P}-type`} label="What would you like made?" required error={f.errors.type} className="sm:col-span-2">
          {(a) => (
            <select {...a} className="field-input" value={f.values.type} onChange={(e) => f.set("type", e.target.value)} onBlur={() => f.blur("type")}>
              <option value="">Choose one</option>
              {INQUIRY_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          )}
        </Field>
        <Field id={`${P}-idea`} label="Engraving text or idea" required error={f.errors.idea} hint={`${f.values.idea.length} / 500 characters`} className="sm:col-span-2">
          {(a) => <textarea {...a} rows={5} maxLength={500} className="field-input" value={f.values.idea} onChange={(e) => f.set("idea", e.target.value)} onBlur={() => f.blur("idea")} />}
        </Field>
        <Field id={`${P}-quantity`} label="Quantity" error={f.errors.quantity}>
          {(a) => <input {...a} type="number" min={1} inputMode="numeric" className="field-input" value={f.values.quantity} onChange={(e) => f.set("quantity", e.target.value)} onBlur={() => f.blur("quantity")} />}
        </Field>
        <Field id={`${P}-neededBy`} label="Needed by" optional>
          {(a) => <input {...a} type="date" className="field-input" value={f.values.neededBy} onChange={(e) => f.set("neededBy", e.target.value)} />}
        </Field>
        <div className="sm:col-span-2">
          <label htmlFor={`${P}-file`} className="mb-2 block text-[15px] font-medium">
            Reference file <span className="ml-2 text-sm font-normal text-muted-foreground">(optional)</span>
          </label>
          <input
            id={`${P}-file`}
            type="file"
            accept="image/*,application/pdf"
            aria-describedby={`${P}-file-hint${fileError ? ` ${P}-file-error` : ""}`}
            aria-invalid={fileError ? true : undefined}
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            className="block w-full text-[15px] file:mr-4 file:min-h-[44px] file:cursor-pointer file:rounded-sm file:border file:border-walnut file:bg-transparent file:px-4 file:font-medium file:text-walnut hover:file:bg-walnut hover:file:text-paper"
          />
          <p id={`${P}-file-hint`} className="mt-1.5 text-sm text-muted-foreground">
            Images or PDF, up to 5 MB. A clean, high contrast file works best.
          </p>
          {fileError && <FieldError id={`${P}-file-error`}>{fileError}</FieldError>}
        </div>
      </div>
      <div className="mt-8 space-y-6">
        <SubmitButton loading={loading}>Send My Custom Inquiry</SubmitButton>
        <div aria-live="polite">
          {result && result.status !== "sent" ? (
            <DeliveryNotice state={result.status} errorMessage={result.message} summary={result.summary} subject="Custom Piece Inquiry" />
          ) : null}
        </div>
      </div>
    </form>
  );
}
