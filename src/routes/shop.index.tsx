import { createFileRoute } from "@tanstack/react-router";
import { CollectionPage } from "@/components/templates/CollectionPage";
import { isCollectionSlug, isSortKey, type SortKey } from "@/lib/shop";
import type { CollectionSlug } from "@/data/site";
import { seo } from "@/lib/seo";

interface ShopSearch {
  collection?: CollectionSlug | undefined;
  sort?: SortKey | undefined;
}

export const Route = createFileRoute("/shop/")({
  validateSearch: (s: Record<string, unknown>): ShopSearch => ({
    collection: isCollectionSlug(s["collection"]) ? s["collection"] : undefined,
    sort: isSortKey(s["sort"]) && s["sort"] !== "featured" ? s["sort"] : undefined,
  }),
  head: () =>
    seo(
      "Shop Handmade Wood Gifts",
      "Shop handmade cutting boards, designer boxes, and holiday gifts, each made to order and personalized with laser engraving in Dupont, Washington.",
    ),
  component: Shop,
});

function Shop() {
  const { collection, sort } = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <CollectionPage
      filter={collection}
      sort={sort ?? "featured"}
      onSort={(s) => navigate({ search: (prev) => ({ ...prev, sort: s === "featured" ? undefined : s }), replace: true, resetScroll: false })}
      onFilter={(c) => navigate({ search: (prev) => ({ ...prev, collection: c }), replace: true, resetScroll: false })}
    />
  );
}
