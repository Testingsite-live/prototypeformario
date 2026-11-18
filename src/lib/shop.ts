import { COLLECTIONS, ENGRAVING_OPTIONS, PRODUCTS, type CollectionSlug, type Product } from "@/data/site";

export type SortKey = "featured" | "price-asc" | "price-desc";
export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price low to high" },
  { value: "price-desc", label: "Price high to low" },
];

export function isSortKey(v: unknown): v is SortKey {
  return v === "featured" || v === "price-asc" || v === "price-desc";
}
export function isCollectionSlug(v: unknown): v is CollectionSlug {
  return COLLECTIONS.some((c) => c.slug === v);
}

export function getCollection(slug: string) {
  return COLLECTIONS.find((c) => c.slug === slug);
}
export function getProduct(category: string, slug: string) {
  return PRODUCTS.find((p) => p.category === category && p.slug === slug);
}
export function featuredProducts() {
  return PRODUCTS.filter((p) => p.featured).sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));
}
export function relatedProducts(product: Product, count = 3) {
  const same = PRODUCTS.filter((p) => p.category === product.category && p.slug !== product.slug);
  const others = PRODUCTS.filter((p) => p.category !== product.category);
  return [...same, ...others].slice(0, count);
}

export function sortProducts(list: Product[], sort: SortKey) {
  const copy = [...list];
  if (sort === "price-asc") copy.sort((a, b) => a.basePrice - b.basePrice);
  if (sort === "price-desc") copy.sort((a, b) => b.basePrice - a.basePrice);
  return copy;
}

export interface Selection {
  size?: string | undefined;
  wood?: string | undefined;
  variant?: string | undefined;
  engraving?: string | undefined;
}

/** Unit price for a product with the chosen options (modifiers live in src/data/site.ts). */
export function unitPrice(product: Product, sel: Selection) {
  const add = (opts: { label: string; priceAdd: number }[] | undefined, label?: string) =>
    opts?.find((o) => o.label === label)?.priceAdd ?? 0;
  return (
    product.basePrice +
    add(product.sizes, sel.size) +
    add(product.woods, sel.wood) +
    add(product.variant?.choices, sel.variant) +
    add(ENGRAVING_OPTIONS, sel.engraving)
  );
}

export function engravingRequiresText(engraving?: string) {
  return engraving === "Name or monogram" || engraving === "Custom message";
}

export function formatPrice(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function productPath(p: Product) {
  return { to: "/shop/$category/$slug" as const, params: { category: p.category, slug: p.slug } };
}
