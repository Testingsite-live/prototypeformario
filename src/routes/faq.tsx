import { createFileRoute, Link } from "@tanstack/react-router";
import { FAQS } from "@/data/site";
import { seo } from "@/lib/seo";
import { PageIntro } from "@/components/templates/ContentPage";
import { Accordion } from "@/components/site/Accordion";

export const Route = createFileRoute("/faq")({
  head: () =>
    seo(
      "FAQ",
      "Answers about custom engraving, woods, food safe boards, business orders, how order requests work, and shipping across the US.",
    ),
  component: Faq,
});

function Faq() {
  return (
    <>
      <PageIntro eyebrow="FAQ" title="Questions, answered." />
      <section className="container-site pb-24">
        <div className="max-w-3xl">
          <Accordion items={FAQS.map((f) => ({ title: f.q, content: <p>{f.a}</p> }))} single headingLevel={2} />
        </div>
        <div className="mt-16 flex max-w-3xl flex-col items-start gap-6 border-t border-border pt-10 md:flex-row md:items-center md:justify-between">
          <p className="text-h3 text-walnut">Still have a question?</p>
          <Link to="/contact" className="btn btn-primary">Contact the Studio</Link>
        </div>
      </section>
    </>
  );
}
