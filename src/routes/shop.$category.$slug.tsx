import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProductPage } from "@/components/templates/ProductPage";
import { getProduct } from "@/lib/shop";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/shop/$category/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.category, params.slug);
    if (!product) throw notFound();
    return { category: product.category, slug: product.slug, name: product.name, description: product.description };
  },
  head: ({ loaderData }) =>
    loaderData
      ? seo(loaderData.name, `${loaderData.description} Handmade to order with optional laser engraving.`)
      : { meta: [{ title: "Page not found" }, { name: "robots", content: "noindex" }] },
  component: ProductRoute,
});

function ProductRoute() {
  const { category, slug } = Route.useLoaderData();
  const product = getProduct(category, slug)!;
  // key resets option state when moving between products
  return <ProductPage key={product.slug} product={product} />;
}
