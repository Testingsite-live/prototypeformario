import { createFileRoute, notFound } from "@tanstack/react-router";
import { CollectionPage } from "@/components/templates/CollectionPage";
import { getCollection, isSortKey, type SortKey } from "@/lib/shop";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/shop/$category/")({
  validateSearch: (s: Record<string, unknown>): { sort?: SortKey | undefined } => ({
    sort: isSortKey(s["sort"]) && s["sort"] !== "featured" ? s["sort"] : undefined,
  }),
  loader: ({ params }) => {
    const collection = getCollection(params.category);
    if (!collection) throw notFound();
    return { slug: collection.slug, metaTitle: collection.metaTitle, metaDescription: collection.metaDescription };
  },
  head: ({ loaderData }) =>
    loaderData
      ? seo(loaderData.metaTitle, loaderData.metaDescription)
      : { meta: [{ title: "Page not found" }, { name: "robots", content: "noindex" }] },
  component: Collection,
});

function Collection() {
  const { slug } = Route.useLoaderData();
  const { sort } = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <CollectionPage
      collection={slug}
      sort={sort ?? "featured"}
      onSort={(s) => navigate({ search: { sort: s === "featured" ? undefined : s }, replace: true, resetScroll: false })}
    />
  );
}
