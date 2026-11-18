import { useId } from "react";
import { Link } from "@tanstack/react-router";
import { COLLECTIONS, PRODUCTS, type CollectionSlug } from "@/data/site";
import { SORT_OPTIONS, getCollection, sortProducts, type SortKey } from "@/lib/shop";
import { ProductCard } from "@/components/site/ProductCard";
import { KerfLine } from "@/components/site/Kerf";
import { Reveal } from "@/components/site/Reveal";
import { PageIntro } from "./ContentPage";
import { cn } from "@/lib/utils";

/** Shared template for /shop and each collection. Filtering and sorting run in the browser. */
export function CollectionPage({
  collection,
  filter,
  sort,
  onSort,
  onFilter,
}: {
  collection?: CollectionSlug | undefined;
  filter?: CollectionSlug | undefined;
  sort: SortKey;
  onSort: (s: SortKey) => void;
  onFilter?: ((c: CollectionSlug | undefined) => void) | undefined;
}) {
  const sortId = useId();
  const col = collection ? getCollection(collection) : undefined;
  const scope = collection ?? filter;
  const list = sortProducts(scope ? PRODUCTS.filter((p) => p.category === scope) : PRODUCTS, sort);

  return (
    <>
      <PageIntro
        eyebrow={col ? col.label : "The shop"}
        title={col ? col.title : "Every piece, made one at a time."}
        intro={
          col
            ? col.intro
            : "Cutting boards, designer boxes, and holiday gifts. Every piece is made to order, and almost all of them can be engraved with a name, a date, or a message."
        }
      />

      <section className="container-site pb-24" aria-label="Products">
        <div className="mb-10 flex flex-col gap-5 border-y border-border py-5 md:flex-row md:items-center md:justify-between">
          {onFilter ? (
            <div role="group" aria-label="Filter by collection" className="flex flex-wrap gap-2">
              {[{ slug: undefined, name: "All pieces" }, ...COLLECTIONS].map((c) => {
                const active = filter === c.slug;
                return (
                  <button
                    key={c.name}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onFilter(c.slug as CollectionSlug | undefined)}
                    className={cn(
                      "min-h-[44px] rounded-sm border px-4 text-[15px] font-medium transition-colors",
                      active ? "border-walnut bg-walnut text-on-dark" : "border-border text-walnut hover:border-walnut",
                    )}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          ) : (
            <nav aria-label="Other collections" className="flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
              <Link to="/shop" className="link-draw text-walnut">All pieces</Link>
              {COLLECTIONS.filter((c) => c.slug !== collection).map((c) => (
                <Link key={c.slug} to="/shop/$category" params={{ category: c.slug }} className="link-draw text-walnut">
                  {c.name}
                </Link>
              ))}
            </nav>
          )}
          <div className="flex items-center gap-3">
            <label htmlFor={sortId} className="eyebrow !mb-0 shrink-0">Sort</label>
            <select
              id={sortId}
              value={sort}
              onChange={(e) => onSort(e.target.value as SortKey)}
              className="field-input !w-auto min-w-48"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">{list.length} pieces shown</p>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-14 lg:grid-cols-3">
          {list.map((p, i) => (
            <Reveal as="li" key={p.slug} delayStep={i % 3}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </ul>

        <KerfLine label="Made to order" className="mt-20" />
        <div className="mt-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <p className="text-h3 max-w-xl text-walnut">Don't see exactly what you have in mind? We can make it.</p>
          <Link to="/custom-engraving" className="btn btn-secondary">Start Your Custom Piece</Link>
        </div>
      </section>
    </>
  );
}
