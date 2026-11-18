import { createFileRoute, Link } from "@tanstack/react-router";
import { CARE_SECTIONS, IMAGES } from "@/data/site";
import { seo } from "@/lib/seo";
import { PageIntro } from "@/components/templates/ContentPage";
import { Accordion } from "@/components/site/Accordion";
import { SmartImage } from "@/components/site/SmartImage";

export const Route = createFileRoute("/care")({
  head: () =>
    seo(
      "Care Guide for Wooden Boards and Boxes",
      "How to clean, oil, and store handmade wooden cutting boards, boxes, and engraved gifts so they look good for years.",
    ),
  component: Care,
});

function Care() {
  return (
    <>
      <PageIntro
        eyebrow="Care guide"
        title="Care for your wood."
        intro="A little care keeps wood looking good for years. These are general guidelines for wooden kitchen and gift pieces."
      />
      <section className="container-site grid gap-12 pb-24 md:grid-cols-[1.3fr_0.7fr] md:gap-20">
        <div>
          <Accordion items={CARE_SECTIONS.map((c) => ({ title: c.title, content: <p>{c.body}</p> }))} defaultOpen={[0]} headingLevel={2} />
          <p className="mt-8 border-l-2 border-maple pl-4 text-muted-foreground">If your piece arrives with a care card, follow it first.</p>
          <p className="mt-10 text-lg">
            Questions about a piece? <Link to="/contact" className="link-underlined text-walnut">Contact the studio</Link>
          </p>
        </div>
        <div className="order-first md:order-none">
          <div className="aspect-[4/5] overflow-hidden rounded-sm md:sticky md:top-28">
            <SmartImage src={IMAGES.careOil} alt="Walnut cutting board half conditioned with mineral oil beside a glass bottle and a soft cloth" width={880} height={1320} position="40% 60%" eager />
          </div>
        </div>
      </section>
    </>
  );
}
