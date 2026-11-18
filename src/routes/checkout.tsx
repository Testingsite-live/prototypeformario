import { useRef, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { US_STATES } from "@/data/site";
import { optionLine, useCart, type CartItem } from "@/lib/cart";
import { formatPrice } from "@/lib/shop";
import { maxLen, required, submitForm, summaryText, validateEmail, validateZip } from "@/lib/forms";
import { seo } from "@/lib/seo";
import { useValidatedForm, type Errors } from "@/hooks/use-validated-form";
import { PageIntro } from "@/components/templates/ContentPage";
import { DeliveryNotice, ErrorSummary, Field, FieldError, SubmitButton, SuccessNotice } from "@/components/site/FormField";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    ...seo("Send Your Order Request", "Send an order request with your engraving details. We confirm details, shipping, and the total before arranging payment."),
  }),
  component: Checkout,
});

type V = {
  name: string;
  email: string;
  phone: string;
  street: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
  neededBy: string;
  notes: string;
  consent: boolean;
};
const INITIAL: V = { name: "", email: "", phone: "", street: "", apt: "", city: "", state: "", zip: "", neededBy: "", notes: "", consent: false };
const LABELS: Record<string, string> = {
  name: "Full name",
  email: "Email",
  street: "Street address",
  city: "City",
  state: "State",
  zip: "ZIP code",
  notes: "Notes",
  consent: "Consent",
};
const P = "co";

function validate(v: V): Errors<V> {
  return {
    name: required(v.name, "Enter your full name."),
    email: validateEmail(v.email),
    street: required(v.street, "Enter your street address."),
    city: required(v.city, "Enter your city."),
    state: required(v.state, "Choose your state."),
    zip: validateZip(v.zip),
    notes: maxLen(v.notes, 500, "Notes"),
    consent: v.consent ? "" : "Please agree to be contacted about this order request.",
  };
}

function itemsText(items: CartItem[], priceOf: (i: CartItem) => number) {
  return items
    .map((i) => `- ${i.qty} × ${i.name} (${optionLine(i)})${i.engravingText ? ` — Engraving: "${i.engravingText}"` : ""}${i.notes ? ` — Notes: ${i.notes}` : ""} — ${formatPrice(priceOf(i) * i.qty)}`)
    .join("\n");
}

function Checkout() {
  const { items, ready, subtotal, priceOf, clear } = useCart();
  const f = useValidatedForm<V>(INITIAL, validate);
  const [summaryErrors, setSummaryErrors] = useState<[string, string][]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { status: "not-connected" | "error"; message?: string | undefined; summary: string }>(null);
  const [sent, setSent] = useState<null | { summary: string; email: string }>(null);
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
    const address = [v.street, v.apt, `${v.city}, ${v.state} ${v.zip}`].filter(Boolean).join(", ");
    const summary = summaryText("Order Request", [
      ["Name", v.name],
      ["Email", v.email],
      ["Phone", v.phone],
      ["Ship to", address],
      ["Needed by", v.neededBy],
      ["Notes", v.notes],
      ["Pieces", `\n${itemsText(items, priceOf)}`],
      ["Subtotal (before shipping)", formatPrice(subtotal)],
    ]);
    setLoading(true);
    const res = await submitForm("order-request", {
      ...v,
      items: items.map((i) => ({ ...i, unitPrice: priceOf(i) })),
      subtotal,
    });
    setLoading(false);
    if (res.status === "sent") {
      setSent({ summary, email: v.email });
      clear();
      window.scrollTo({ top: 0 });
      return;
    }
    setResult({ status: res.status, message: res.status === "error" ? res.message : undefined, summary });
  };

  if (sent) {
    return (
      <>
        <PageIntro title="Your order request was sent." intro={`Thank you. We will review your request and reply to ${sent.email} to confirm the engraving details, shipping, and total before arranging payment.`} />
        <section className="container-site max-w-3xl pb-24">
          <SuccessNotice>No payment has been taken. Here is a copy of what you sent.</SuccessNotice>
          <pre className="mt-6 whitespace-pre-wrap border border-border bg-oat p-6 font-sans text-[15px]">{sent.summary}</pre>
          <Link to="/shop" className="btn btn-secondary mt-8">Back to shop</Link>
        </section>
      </>
    );
  }

  const intro =
    "We will review your request, confirm the engraving details, shipping, and total, and then arrange payment with you. No payment is taken on this page.";

  if (ready && items.length === 0) {
    return (
      <>
        <PageIntro title="Send your order request." intro={intro} />
        <section className="container-site pb-24">
          <p className="text-lg">Your cart is empty. Add a piece first, then come back to send your order request.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/shop" className="btn btn-primary">Shop the Collection</Link>
            <Link to="/custom-engraving" className="btn btn-secondary">Start Your Custom Piece</Link>
          </div>
        </section>
      </>
    );
  }

  const text = (name: keyof V, label: string, opts: { required?: boolean | undefined; optional?: boolean | undefined; type?: string | undefined; autoComplete?: string | undefined; className?: string | undefined; inputMode?: "numeric" | "tel" | undefined } = {}) => (
    <Field id={`${P}-${name}`} label={label} required={opts.required} optional={opts.optional} error={f.errors[name]} className={opts.className}>
      {(a) => (
        <input
          {...a}
          type={opts.type ?? "text"}
          inputMode={opts.inputMode}
          autoComplete={opts.autoComplete}
          className="field-input"
          value={f.values[name] as string}
          onChange={(e) => f.set(name, e.target.value as never)}
          onBlur={() => f.blur(name)}
        />
      )}
    </Field>
  );

  return (
    <>
      <PageIntro title="Send your order request." intro={intro} />
      <section className="container-site grid gap-12 pb-24 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <form noValidate onSubmit={onSubmit} aria-label="Order request">
          <ErrorSummary ref={summaryRef} errors={summaryErrors} labels={LABELS} idPrefix={P} />
          <fieldset className="grid gap-6 sm:grid-cols-2">
            <legend className="text-h3 mb-6 text-walnut">Your details</legend>
            {text("name", "Full name", { required: true, autoComplete: "name", className: "sm:col-span-2" })}
            {text("email", "Email", { required: true, type: "email", autoComplete: "email" })}
            {text("phone", "Phone", { optional: true, type: "tel", autoComplete: "tel", inputMode: "tel" })}
          </fieldset>
          <fieldset className="mt-12 grid gap-6 sm:grid-cols-6">
            <legend className="text-h3 mb-6 text-walnut">Shipping address</legend>
            {text("street", "Street address", { required: true, autoComplete: "address-line1", className: "sm:col-span-6" })}
            {text("apt", "Apartment, suite, or unit", { optional: true, autoComplete: "address-line2", className: "sm:col-span-6" })}
            {text("city", "City", { required: true, autoComplete: "address-level2", className: "sm:col-span-3" })}
            <Field id={`${P}-state`} label="State" required error={f.errors.state} className="sm:col-span-1">
              {(a) => (
                <select {...a} className="field-input" autoComplete="address-level1" value={f.values.state} onChange={(e) => f.set("state", e.target.value)} onBlur={() => f.blur("state")}>
                  <option value="">--</option>
                  {US_STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              )}
            </Field>
            {text("zip", "ZIP code", { required: true, autoComplete: "postal-code", inputMode: "numeric", className: "sm:col-span-2" })}
          </fieldset>
          <fieldset className="mt-12 grid gap-6">
            <legend className="text-h3 mb-6 text-walnut">Timing and notes</legend>
            {text("neededBy", "Needed by date", { optional: true, type: "date", className: "sm:max-w-xs" })}
            <Field id={`${P}-notes`} label="Notes about your order" optional error={f.errors.notes} hint={`${f.values.notes.length} / 500 characters`}>
              {(a) => <textarea {...a} rows={4} maxLength={500} className="field-input" value={f.values.notes} onChange={(e) => f.set("notes", e.target.value)} onBlur={() => f.blur("notes")} />}
            </Field>
            <div>
              <label htmlFor={`${P}-consent`} className="flex min-h-[44px] cursor-pointer items-start gap-3">
                <input
                  id={`${P}-consent`}
                  type="checkbox"
                  checked={f.values.consent}
                  onChange={(e) => f.set("consent", e.target.checked)}
                  aria-invalid={f.errors.consent ? true : undefined}
                  aria-describedby={f.errors.consent ? `${P}-consent-error` : undefined}
                  aria-required
                  className="mt-1 size-5 shrink-0 accent-ember"
                />
                <span>
                  I agree to be contacted about this order request <span className="text-ember" aria-hidden="true">*</span>
                </span>
              </label>
              {f.errors.consent && <FieldError id={`${P}-consent-error`}>{f.errors.consent}</FieldError>}
            </div>
          </fieldset>
          <div className="mt-10 space-y-6">
            <SubmitButton loading={loading} className="w-full sm:w-auto">Send Order Request</SubmitButton>
            <div aria-live="polite">
              {result && <DeliveryNotice state={result.status} errorMessage={result.message} summary={result.summary} subject="Order Request" />}
            </div>
          </div>
        </form>

        <aside className="order-first h-fit bg-oat lg:order-none lg:sticky lg:top-28" aria-label="Order summary">
          <div className="end-grain-thin" aria-hidden="true" />
          <div className="p-7">
            <h2 className="text-h3 text-walnut">Your pieces</h2>
            {!ready ? (
              <p className="mt-4 text-muted-foreground">Loading your cart…</p>
            ) : (
              <ul className="mt-5 divide-y divide-border border-y border-border">
                {items.map((i) => (
                  <li key={i.id} className="py-4 text-[15px]">
                    <div className="flex justify-between gap-4">
                      <span className="font-medium">{i.qty} × {i.name}</span>
                      <span className="font-semibold">{formatPrice(priceOf(i) * i.qty)}</span>
                    </div>
                    <p className="mt-1 text-muted-foreground">{optionLine(i)}</p>
                    {i.engravingText && <p className="mt-1">Engraving: “{i.engravingText}”</p>}
                  </li>
                ))}
              </ul>
            )}
            <dl className="mt-5 flex items-baseline justify-between">
              <dt>Subtotal</dt>
              <dd className="text-xl font-semibold text-ember">{formatPrice(subtotal)}</dd>
            </dl>
            <p className="mt-4 text-sm text-muted-foreground">Shipping and the final total are confirmed with you before payment.</p>
            <Link to="/cart" className="link-draw mt-5 text-[15px] text-walnut">Edit cart</Link>
          </div>
        </aside>
      </section>
    </>
  );
}
