import { forwardRef, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Copy, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { mailtoHref } from "@/lib/forms";
import { cn } from "@/lib/utils";

export interface FieldAria {
  id: string;
  "aria-invalid"?: boolean | undefined;
  "aria-describedby"?: string | undefined;
  "aria-required"?: boolean | undefined;
}

export function Field({
  id,
  label,
  error,
  hint,
  required,
  optional,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  hint?: ReactNode | undefined;
  required?: boolean | undefined;
  optional?: boolean | undefined;
  className?: string | undefined;
  children: (aria: FieldAria) => ReactNode;
}) {
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-[15px] font-medium text-foreground">
        {label}
        {required && <span className="ml-1 text-ember" aria-hidden="true">*</span>}
        {optional && <span className="ml-2 text-sm font-normal text-muted-foreground">(optional)</span>}
      </label>
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy, "aria-required": required || undefined })}
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

export function FieldError({ id, children }: { id?: string | undefined; children: ReactNode }) {
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-error">
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

export const ErrorSummary = forwardRef<HTMLDivElement, { errors: [string, string][]; labels: Record<string, string>; idPrefix: string }>(
  function ErrorSummary({ errors, labels, idPrefix }, ref) {
    if (!errors.length) return <div ref={ref} tabIndex={-1} />;
    return (
      <div ref={ref} tabIndex={-1} role="alert" className="mb-8 border border-error/60 bg-error/5 p-5">
        <p className="flex items-center gap-2 font-semibold text-error">
          <AlertCircle className="size-5" aria-hidden="true" />
          Please fix {errors.length === 1 ? "1 field" : `${errors.length} fields`} before sending:
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-6 text-[15px]">
          {errors.map(([k, msg]) => (
            <li key={k}>
              <a href={`#${idPrefix}-${k}`} className="link-underlined">
                {labels[k] ?? k}: {msg}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  },
);

export function SubmitButton({ loading, children, className }: { loading: boolean; children: ReactNode; className?: string | undefined }) {
  return (
    <button type="submit" disabled={loading} className={cn("btn btn-primary", className)} aria-busy={loading}>
      {loading ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Sending...
        </>
      ) : (
        children
      )}
    </button>
  );
}

/** Truthful delivery status shown after a submit attempt. */
export function DeliveryNotice({
  state,
  summary,
  subject,
  errorMessage,
}: {
  state: "not-connected" | "error";
  summary: string;
  subject: string;
  errorMessage?: string | undefined;
}) {
  const [copied, setCopied] = useState<"" | "ok" | "fail">("");
  const mailto = mailtoHref(subject, summary);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied("ok");
    } catch {
      setCopied("fail");
    }
  };
  return (
    <div role="status" className="border border-error/50 bg-oat p-5">
      <p className="flex items-start gap-2 font-semibold text-error">
        <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        {state === "not-connected"
          ? "Online delivery is not connected yet, so this request has not been sent."
          : (errorMessage ?? "This request could not be sent.")}
      </p>
      <p className="mt-2 text-[15px] text-muted-foreground">
        Your details are still here. Copy them below to keep a record or send them another way.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={copy} className="btn btn-secondary !min-h-[44px]">
          <Copy className="size-4" aria-hidden="true" /> Copy request details
        </button>
        {mailto && (
          <a href={mailto} className="btn btn-secondary !min-h-[44px]">
            <Mail className="size-4" aria-hidden="true" /> Email this request
          </a>
        )}
      </div>
      <p aria-live="polite" className="mt-3 text-sm">
        {copied === "ok" && (
          <span className="inline-flex items-center gap-1.5 font-medium text-success">
            <CheckCircle2 className="size-4" aria-hidden="true" /> Request details copied to your clipboard.
          </span>
        )}
        {copied === "fail" && (
          <span className="inline-flex items-center gap-1.5 font-medium text-error">
            <AlertCircle className="size-4" aria-hidden="true" /> Copying is blocked in this browser. Select and copy the details manually.
          </span>
        )}
      </p>
      {copied === "fail" && (
        <textarea readOnly value={summary} className="field-input mt-2 min-h-40 font-mono text-sm" aria-label="Request details" />
      )}
    </div>
  );
}

export function SuccessNotice({ children }: { children: ReactNode }) {
  return (
    <div role="status" className="border border-success/50 bg-success/5 p-5">
      <p className="flex items-start gap-2 font-semibold text-success">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <span>{children}</span>
      </p>
    </div>
  );
}
