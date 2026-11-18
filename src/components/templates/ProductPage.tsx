import { useId, useMemo, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, ChevronRight, Minus, Plus } from "lucide-react";
import { ENGRAVING_OPTIONS, IMAGES, PRODUCT_IMAGE, type Product } from "@/data/site";
import { engravingRequiresText, formatPrice, getCollection, relatedProducts, unitPrice } from "@/lib/shop";
import { MAX_QTY, useCart } from "@/lib/cart";
import { Accordion } from "@/components/site/Accordion";
import { FieldError } from "@/components/site/FormField";
import { KerfLine } from "@/components/site/Kerf";
import { ProductCard } from "@/components/site/ProductCard";
import { SmartImage } from "@/components/site/SmartImage";
import { cn } from "@/lib/utils";

interface Shot {
  src: string;
  alt: string;
  position: string;
  zoom?: number | undefined;
  width: number;
  height: number;
}

function OptionGroup({
  legend,
  options,
  value,
  onChange,
  name,
}: {
  legend: string;
  options: { label: string; priceAdd: number }[];
  value: string;
  onChange: (v: string) => void;
  name: string;
}) {
  return (
    <fieldset className="mt-7">
      <legend className="mb-3 text-[15px] font-medium">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o.label;
          return (
            <label
              key={o.label}
              className={cn(
                "inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-sm border px-4 text-[15px] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ember",
                active ? "border-walnut bg-walnut text-on-dark" : "border-border hover:border-walnut",
              )}
            >
              <input type="radio" name={name} value={o.label} checked={active} onChange={() => onChange(o.label)} className="sr-only" />
              {active && <CheckCircle2 className="size-4" aria-hidden="true" />}
              {o.label}
              {o.priceAdd > 0 && <span className={active ? "text-maple" : "text-muted-foreground"}>+{formatPrice(o.priceAdd)}</span>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function ProductPage({ product }: { product: Product }) {
  const id = useId();
  const collection = getCollection(product.category)!;
  const { add, count } = useCart();

  const shots: Shot[] = useMemo(
    () => [
      { src: product.image, alt: product.imageAlt, position: "50% 50%", ...PRODUCT_IMAGE },
      { src: product.image, alt: product.detailAlt, position: product.detailFocus, zoom: 1.9, ...PRODUCT_IMAGE },
      { src: IMAGES.engravingCloseup, alt: "Close-up of crisp laser engraving on maple, showing the depth and detail of the engraved lines", position: "50% 50%", width: 1536, height: 1024 },
    ],
    [product],
  );
  const [active, setActive] = useState(0);
  const shot = shots[active] ?? shots[0]!;

  const [size, setSize] = useState(product.sizes[0]?.label ?? "");
  const [wood, setWood] = useState(product.woods[0]?.label ?? "");
  const [variant, setVariant] = useState(product.variant?.choices[0]?.label ?? "");
  const [engraving, setEngraving] = useState(ENGRAVING_OPTIONS[0]?.label ?? "No engraving");
  const [engravingText, setEngravingText] = useState("");
  const [notes, setNotes] = useState("");
  const [qty, setQty] = useState(1);
  const [textError, setTextError] = useState("");
  const [added, setAdded] = useState<string>("");

  const price = unitPrice(product, { size, wood, variant, engraving });
  const needsText = engravingRequiresText(engraving);
  const showText = engraving !== "No engraving";

  const onThumbKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const next = (i + (e.key === "ArrowRight" ? 1 : -1) + shots.length) % shots.length;
      setActive(next);
      document.getElementById(`${id}-thumb-${next}`)?.focus();
    }
  };

  const onAdd = (e?: FormEvent) => {
    e?.preventDefault();
    if (needsText && !engravingText.trim()) {
      setTextError("Enter the text you would like engraved.");
      document.getElementById(`${id}-engraving-text`)?.focus();
      return;
    }
    setTextError("");
    add({
      slug: product.slug,
      category: product.category,
      name: product.name,
      size: size || undefined,
      wood: wood || undefined,
      variant: variant || undefined,
      engraving,
      engravingText: showText ? engravingText.trim() || undefined : undefined,
      notes: notes.trim() || undefined,
      qty,
    });
    setAdded(`${qty} × ${product.name} added to your cart.`);
  };

  const accordion = [
    {
      title: "Details and dimensions",
      content: (
        <ul className="list-disc space-y-1 pl-5">
          {product.details.map((d) => <li key={d}>{d}</li>)}
        </ul>
      ),
    },
    {
      title: "Engraving notes",
      content: (
        <p>
          Engraving placement, sizing, and text are confirmed with you before the laser runs. Natural wood grain varies from board to board, so
          every piece and every engraving is a little different.
        </p>
      ),
    },
    {
      title: "Care",
      content: (
        <p>
          Clean by hand with mild soap and warm water, wipe dry, and oil when the wood looks dry. Never soak or use a dishwasher.{" "}
          <Link to="/care" className="link-underlined text-walnut">Read the full care guide</Link>.
        </p>
      ),
    },
    {
      title: "Shipping",
      content: (
        <p>
          We ship within the United States. Shipping cost and timing are confirmed with you before payment.{" "}
          <Link to="/shipping-returns" className="link-underlined text-walnut">Shipping and returns</Link>.
        </p>
      ),
    },
  ];

  return (
    <>
      <div className="container-site pb-24 pt-28 md:pt-32">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li><Link to="/shop" className="link-draw">Shop</Link></li>
            <li aria-hidden="true"><ChevronRight className="size-3.5" /></li>
            <li><Link to="/shop/$category" params={{ category: collection.slug }} className="link-draw">{collection.name}</Link></li>
            <li aria-hidden="true"><ChevronRight className="size-3.5" /></li>
            <li aria-current="page" className="text-foreground">{product.name}</li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-oat">
              <SmartImage
                key={active}
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                position={shot.position}
                zoom={shot.zoom}
                eager
              />
            </div>
            <div role="group" aria-label="Product images" className="mt-3 grid grid-cols-3 gap-3">
              {shots.map((s, i) => (
                <button
                  key={i}
                  id={`${id}-thumb-${i}`}
                  type="button"
                  aria-label={`Show image ${i + 1} of ${shots.length}: ${s.alt}`}
                  aria-pressed={active === i}
                  tabIndex={active === i ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onThumbKey(e, i)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-sm border-2 bg-oat transition-colors",
                    active === i ? "border-ember" : "border-transparent hover:border-border",
                  )}
                >
                  <SmartImage src={s.src} alt="" width={s.width} height={s.height} position={s.position} zoom={s.zoom} />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="eyebrow mb-3">{collection.name}</p>
            <h1 className="text-h2 text-walnut">{product.name}</h1>
            <p className="mt-4 text-2xl font-semibold text-ember" aria-live="polite">
              {engraving === "No engraving" && price === product.basePrice ? `From ${formatPrice(price)}` : formatPrice(price)}
            </p>
            <p className="mt-5 text-lg text-muted-foreground">{product.description}</p>

            <form onSubmit={onAdd} noValidate className="mt-2">
              {product.woods.length > 0 && <OptionGroup legend="Wood" name={`${id}-wood`} options={product.woods} value={wood} onChange={setWood} />}
              {product.sizes.length > 0 && <OptionGroup legend="Size" name={`${id}-size`} options={product.sizes} value={size} onChange={setSize} />}
              {product.variant && (
                <OptionGroup legend={product.variant.label} name={`${id}-variant`} options={product.variant.choices} value={variant} onChange={setVariant} />
              )}
              <OptionGroup
                legend="Engraving"
                name={`${id}-engraving`}
                options={ENGRAVING_OPTIONS}
                value={engraving}
                onChange={(v) => {
                  setEngraving(v);
                  setTextError("");
                }}
              />

              {showText && (
                <div className="mt-6">
                  <label htmlFor={`${id}-engraving-text`} className="mb-2 block text-[15px] font-medium">
                    Engraving text
                    {needsText ? <span className="ml-1 text-ember" aria-hidden="true">*</span> : <span className="ml-2 text-sm font-normal text-muted-foreground">(optional)</span>}
                  </label>
                  <input
                    id={`${id}-engraving-text`}
                    type="text"
                    maxLength={60}
                    value={engravingText}
                    onChange={(e) => {
                      setEngravingText(e.target.value);
                      if (e.target.value.trim()) setTextError("");
                    }}
                    onBlur={() => needsText && !engravingText.trim() && setTextError("Enter the text you would like engraved.")}
                    aria-required={needsText || undefined}
                    aria-invalid={textError ? true : undefined}
                    aria-describedby={`${id}-et-hint${textError ? ` ${id}-et-error` : ""}`}
                    className="field-input"
                  />
                  <p id={`${id}-et-hint`} className="mt-1.5 text-sm text-muted-foreground">
                    {engraving === "Upload artwork later"
                      ? "Describe your artwork. We will ask for the file when we confirm your order."
                      : `${engravingText.length} / 60 characters. Placement is confirmed with you before engraving.`}
                  </p>
                  {textError && <FieldError id={`${id}-et-error`}>{textError}</FieldError>}
                </div>
              )}

              <div className="mt-6">
                <label htmlFor={`${id}-notes`} className="mb-2 block text-[15px] font-medium">
                  Notes <span className="ml-2 text-sm font-normal text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  id={`${id}-notes`}
                  rows={3}
                  maxLength={300}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  aria-describedby={`${id}-notes-hint`}
                  className="field-input"
                />
                <p id={`${id}-notes-hint`} className="mt-1.5 text-sm text-muted-foreground">{notes.length} / 300 characters</p>
              </div>

              <div className="mt-8 flex flex-wrap items-end gap-4">
                <div>
                  <span id={`${id}-qty-label`} className="mb-2 block text-[15px] font-medium">Quantity</span>
                  <QtyStepper value={qty} onChange={setQty} labelledBy={`${id}-qty-label`} />
                </div>
                <button type="submit" className="btn btn-primary flex-1 sm:flex-none">
                  Add to Cart
                </button>
              </div>

              <div aria-live="polite" className="mt-5 min-h-6">
                {added && (
                  <p className="flex flex-wrap items-center gap-2 font-medium text-success">
                    <CheckCircle2 className="size-5" aria-hidden="true" />
                    {added}
                    <Link to="/cart" className="link-underlined ml-1 text-walnut">View Cart ({count})</Link>
                  </p>
                )}
              </div>
            </form>

            <Accordion items={accordion} className="mt-8" />
          </div>
        </div>

        <section className="mt-24" aria-labelledby={`${id}-related`}>
          <KerfLine label="You may also like" />
          <h2 id={`${id}-related`} className="text-h2 mb-10 mt-6 text-walnut">You may also like</h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-8 lg:grid-cols-3">
            {relatedProducts(product).map((p, i) => (
              <li key={p.slug} className={i === 2 ? "hidden lg:block" : undefined}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Mobile sticky add-to-cart bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-border bg-paper px-5 py-3 lg:hidden">
        <div>
          <p className="text-sm leading-tight text-muted-foreground">{product.name}</p>
          <p className="font-semibold text-ember">{formatPrice(price * qty)}</p>
        </div>
        <button type="button" className="btn btn-primary !min-h-[44px]" onClick={() => onAdd()}>
          Add to Cart
        </button>
      </div>
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </>
  );
}

export function QtyStepper({
  value,
  onChange,
  labelledBy,
  label,
}: {
  value: number;
  onChange: (n: number) => void;
  labelledBy?: string | undefined;
  label?: string | undefined;
}) {
  return (
    <div role="group" aria-labelledby={labelledBy} aria-label={label} className="inline-flex items-center border border-border">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        aria-label="Decrease quantity"
        className="inline-flex size-12 items-center justify-center text-walnut transition-colors hover:bg-oat disabled:opacity-40"
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <output aria-live="polite" className="w-10 text-center font-semibold">{value}</output>
      <button
        type="button"
        onClick={() => onChange(Math.min(MAX_QTY, value + 1))}
        disabled={value >= MAX_QTY}
        aria-label="Increase quantity"
        className="inline-flex size-12 items-center justify-center text-walnut transition-colors hover:bg-oat disabled:opacity-40"
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
