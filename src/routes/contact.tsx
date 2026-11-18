import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Truck } from "lucide-react";
import { BRAND } from "@/data/site";
import { seo } from "@/lib/seo";
import { PageIntro } from "@/components/templates/ContentPage";
import { ContactForm } from "@/components/site/forms/ContactForm";

export const Route = createFileRoute("/contact")({
  head: () =>
    seo(
      "Contact and Custom Inquiries",
      "Questions, custom ideas, and bulk orders are welcome. Contact the woodworking studio in Dupont, Washington.",
    ),
  component: Contact,
});

function Contact() {
  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="Tell us what you are making."
        intro="Questions, custom ideas, and bulk orders are all welcome. Share a few details and we will reply to you by email."
      />
      <section className="container-site grid gap-12 pb-24 md:grid-cols-[1.4fr_0.6fr] md:gap-16">
        <ContactForm />
        <aside className="h-fit border-t-2 border-walnut bg-oat p-7" aria-label="Studio details">
          <ul className="space-y-5">
            <li className="flex items-start gap-3">
              <MapPin className="mt-1 size-5 text-maple-2" aria-hidden="true" />
              <span>Handmade in {BRAND.location}</span>
            </li>
            <li className="flex items-start gap-3">
              <Truck className="mt-1 size-5 text-maple-2" aria-hidden="true" />
              <span>Ships across the US</span>
            </li>
            {BRAND.email && (
              <li>
                <a href={`mailto:${BRAND.email}`} className="link-underlined">{BRAND.email}</a>
              </li>
            )}
            {BRAND.phone && (
              <li>
                <a href={`tel:${BRAND.phone.replace(/[^\d+]/g, "")}`} className="link-underlined">{BRAND.phone}</a>
              </li>
            )}
          </ul>
        </aside>
      </section>
    </>
  );
}
