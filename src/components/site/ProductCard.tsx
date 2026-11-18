import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PRODUCT_IMAGE, type Product } from "@/data/site";
import { formatPrice } from "@/lib/shop";
import { SwapImage } from "./SmartImage";
import { cn } from "@/lib/utils";

export function ProductCard({ product, compact = false, className }: { product: Product; compact?: boolean | undefined; className?: string | undefined }) {
  return (
    <article className={cn("group", className)}>
      <Link
        to="/shop/$category/$slug"
        params={{ category: product.category, slug: product.slug }}
        className="img-swap block"
        aria-label={`${product.name}, from ${formatPrice(product.basePrice)}`}
      >
        <SwapImage
          src={product.image}
          alt={product.imageAlt}
          detailAlt={product.detailAlt}
          width={PRODUCT_IMAGE.width}
          height={PRODUCT_IMAGE.height}
          detailFocus={product.detailFocus}
          className="aspect-[4/5]"
        />
      </Link>
      <div className={cn("pt-4", compact && "pt-3")}>
        <h3 className={cn("font-display text-foreground", compact ? "text-base leading-tight sm:text-lg" : "text-base leading-tight sm:text-xl")}>
          <Link to="/shop/$category/$slug" params={{ category: product.category, slug: product.slug }} className="link-draw">
            {product.name}
          </Link>
        </h3>
        {!compact && <p className="mt-1 hidden text-[15px] text-muted-foreground sm:block">{product.descriptor}</p>}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="font-semibold text-ember">From {formatPrice(product.basePrice)}</p>
          {!compact && (
            <Link
              to="/shop/$category/$slug"
              params={{ category: product.category, slug: product.slug }}
              className="link-draw hidden text-[15px] text-walnut sm:inline-flex"
              aria-hidden="true"
              tabIndex={-1}
            >
              View piece <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
