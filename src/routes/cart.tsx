import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { COLLECTIONS, PRODUCTS, PRODUCT_IMAGE } from "@/data/site";
import { optionLine, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/shop";
import { seo } from "@/lib/seo";
import { PageIntro } from "@/components/templates/ContentPage";
import { QtyStepper } from "@/components/templates/ProductPage";
import { SmartImage } from "@/components/site/SmartImage";

export const Route = createFileRoute("/cart")({
  head: () => ({
    ...seo("Your Cart", "Review your handmade pieces and engraving details before sending an order request."),
  }),
  component: Cart,
});

function Cart() {
  const { items, ready, subtotal, setQty, remove, priceOf } = useCart();

  if (!ready) {
    return <PageIntro title="Your cart" intro="Loading your cart…" />;
  }

  if (items.length === 0) {
    return (
      <>
        <PageIntro title="Your cart" intro="Your cart is empty for now. Every piece is made to order, so take your time finding the right one." />
        <section className="container-site pb-24">
          <div className="flex flex-wrap gap-4">
            {COLLECTIONS.map((c, i) => (
              <Link key={c.slug} to="/shop/$category" params={{ category: c.slug }} className={i === 0 ? "btn btn-primary" : "btn btn-secondary"}>
                {c.linkLabel}
              </Link>
            ))}
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageIntro title="Your cart" />
      <section className="container-site grid gap-12 pb-24 lg:grid-cols-[1.5fr_1fr] lg:gap-16" aria-label="Cart contents">
        <ul className="border-t border-border">
          {items.map((i) => {
            const p = PRODUCTS.find((x) => x.slug === i.slug)!;
            const unit = priceOf(i);
            return (
              <li key={i.id} className="grid grid-cols-[88px_1fr] gap-5 border-b border-border py-6 sm:grid-cols-[120px_1fr]">
                <Link to="/shop/$category/$slug" params={{ category: p.category, slug: p.slug }} className="block aspect-[4/5] overflow-hidden rounded-sm bg-oat">
                  <SmartImage src={p.image} alt="" width={PRODUCT_IMAGE.width} height={PRODUCT_IMAGE.height} />
                </Link>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl text-walnut">
                        <Link to="/shop/$category/$slug" params={{ category: p.category, slug: p.slug }} className="link-draw">{i.name}</Link>
                      </h2>
                      <p className="mt-1 text-[15px] text-muted-foreground">{optionLine(i)}</p>
                      {i.engravingText && <p className="mt-1 text-[15px]">Engraving: “{i.engravingText}”</p>}
                      {i.notes && <p className="mt-1 text-[15px] text-muted-foreground">Notes: {i.notes}</p>}
                    </div>
                    <p className="font-semibold text-ember">{formatPrice(unit * i.qty)}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <QtyStepper value={i.qty} onChange={(n) => setQty(i.id, n)} label={`Quantity for ${i.name}`} />
                    <button
                      type="button"
                      onClick={() => remove(i.id)}
                      className="inline-flex min-h-[44px] items-center gap-2 text-[15px] text-muted-foreground transition-colors hover:text-error"
                      aria-label={`Remove ${i.name} from cart`}
                    >
                      <Trash2 className="size-4" aria-hidden="true" /> Remove
                    </button>
                    {i.qty > 1 && <span className="text-sm text-muted-foreground">{formatPrice(unit)} each</span>}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="h-fit bg-oat lg:sticky lg:top-28" aria-label="Order summary">
          <div className="end-grain-thin" aria-hidden="true" />
          <div className="p-7">
            <h2 className="text-h3 text-walnut">Summary</h2>
            <dl className="mt-6 flex items-baseline justify-between border-b border-border pb-5">
              <dt>Subtotal</dt>
              <dd className="text-2xl font-semibold text-ember">{formatPrice(subtotal)}</dd>
            </dl>
            <p className="mt-5 text-[15px] text-muted-foreground">Shipping and the final total are confirmed with you before payment.</p>
            <Link to="/checkout" className="btn btn-primary mt-7 w-full">Continue to Order Request</Link>
            <Link to="/shop" className="link-draw mt-5 text-walnut">Keep shopping</Link>
          </div>
        </aside>
      </section>
    </>
  );
}
