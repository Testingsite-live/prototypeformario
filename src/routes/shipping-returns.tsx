import { createFileRoute, Link } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { ContentPage, Prose } from "@/components/templates/ContentPage";

export const Route = createFileRoute("/shipping-returns")({
  head: () => seo("Shipping and Returns", "How shipping, made to order timing, personalized items, and damaged deliveries are handled for orders across the US."),
  component: ShippingReturns,
});

function ShippingReturns() {
  return (
    <ContentPage eyebrow="Policies" title="Shipping and returns.">
      <Prose>
        <h2>Shipping</h2>
        <p>
          We ship within the United States. Shipping cost and estimated timing are confirmed with you before payment, based on the size of your
          piece and your location.
        </p>
        <h2>Made to order</h2>
        <p>Because each piece is made for you, production time varies. We will share an expected timeline when we confirm your order.</p>
        <h2>Personalized items</h2>
        <p>
          Engraved pieces are made to your approved design, so they are generally not returnable unless damaged or not as approved. Contact us right
          away if something arrives damaged.
        </p>
        <h2>Damaged items</h2>
        <p>Send photos within a few days of delivery and we will work with you on a fix.</p>
        <p className="pt-6">
          Questions? <Link to="/contact" className="link-underlined text-walnut">Contact the studio</Link>.
        </p>
      </Prose>
    </ContentPage>
  );
}
