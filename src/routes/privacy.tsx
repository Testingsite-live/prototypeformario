import { createFileRoute, Link } from "@tanstack/react-router";
import { BRAND } from "@/data/site";
import { seo } from "@/lib/seo";
import { ContentPage, Prose } from "@/components/templates/ContentPage";

export const Route = createFileRoute("/privacy")({
  head: () => seo("Privacy Policy", `How ${BRAND.name} collects and uses the information you share through its forms and order requests.`),
  component: Privacy,
});

function Privacy() {
  return (
    <ContentPage eyebrow="Privacy" title="Privacy policy." intro="A plain language summary of what we collect and how we use it.">
      <Prose>
        <h2>What we collect</h2>
        <p>When you use the forms on this site, we collect the information you choose to share:</p>
        <ul>
          <li>Your name, email address, and phone number (if you add one)</li>
          <li>Your shipping address, when you send an order request</li>
          <li>Order and engraving details, such as the pieces, woods, sizes, and engraving text you choose</li>
          <li>Any notes, ideas, or messages you write</li>
        </ul>
        <h2>How we use it</h2>
        <p>
          We use this information only to reply to your inquiries and to process your order requests, including confirming engraving details,
          shipping, and payment arrangements with you.
        </p>
        <h2>Your cart</h2>
        <p>
          Your cart is saved in your own browser so it is still there when you come back. It stays on your device until you send an order request.
        </p>
        <h2>What we don't do</h2>
        <p>We do not sell your personal information.</p>
        <h2>Changes and requests</h2>
        <p>
          To ask what information we hold about you, or to have it corrected or deleted, please{" "}
          <Link to="/contact" className="link-underlined text-walnut">contact the studio</Link>.
        </p>
      </Prose>
    </ContentPage>
  );
}
