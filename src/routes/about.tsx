import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { COLLECTIONS, IMAGES } from "@/data/site";
import { seo } from "@/lib/seo";
import { PageIntro } from "@/components/templates/ContentPage";
import { Eyebrow, KerfLine } from "@/components/site/Kerf";
import { SmartImage } from "@/components/site/SmartImage";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/about")({
  head: () =>
    seo(
      "About the Studio",
      "A small home based woodworking studio in Dupont, Washington making cutting boards, boxes, and gifts by hand, with careful laser engraving.",
    ),
  component: About,
});

const HOW = [
  { title: "Chosen wood", body: "Hardwoods picked for grain and stability, mainly maple, walnut, and cherry." },
  { title: "Hand finishing", body: "Every edge softened by hand and every surface sanded through the grits." },
  { title: "Precise engraving", body: "Layout confirmed with you before the laser runs." },
];

function About() {
  return (
    <>
      <PageIntro eyebrow="The studio" title="A small workshop. One pair of hands at a time." />

      <section className="pb-16 md:pb-24">
        <div className="container-site grid items-center gap-12 md:grid-cols-[1.15fr_1fr] md:gap-20">
          <Reveal>
            <div className="aspect-[3/2] overflow-hidden rounded-sm">
              <SmartImage src={IMAGES.workbenchTools} alt="Workbench with hand planes, chisels, a marking gauge, wood shavings, and a stack of walnut and maple boards" width={1536} height={1024} eager />
            </div>
          </Reveal>
          <Reveal delayStep={1}>
            <p className="text-xl leading-relaxed text-foreground md:text-2xl md:leading-relaxed">
              This is a home based woodworking studio in Dupont, Washington. The work is slow on purpose. Boards are glued up, flattened, sanded
              through the grits, and finished by hand, and the laser is used the way a good pen is used: carefully, and only when it adds
              something.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-pad bg-oat">
        <div className="container-site">
          <Eyebrow>How we work</Eyebrow>
          <h2 className="text-h2 mb-12 text-walnut">Three things we don't rush.</h2>
          <ul className="grid gap-10 md:grid-cols-3 md:gap-8">
            {HOW.map((h, i) => (
              <Reveal as="li" key={h.title} delayStep={i}>
                <KerfLine label={`0${i + 1}`} className="mb-6" />
                <h3 className="text-h3 text-walnut">{h.title}</h3>
                <p className="mt-2 text-muted-foreground">{h.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site grid gap-12 md:grid-cols-[1fr_0.8fr] md:items-center md:gap-20">
          <div>
            <Eyebrow>What we make</Eyebrow>
            <h2 className="text-h2 text-walnut">Boards, boxes, and gifts.</h2>
            <p className="mt-6 text-lg text-muted-foreground">
              The studio makes{" "}
              <Link to="/shop/$category" params={{ category: "cutting-boards" }} className="link-underlined text-walnut">cutting boards</Link> for
              everyday cooking and serving,{" "}
              <Link to="/shop/$category" params={{ category: "designer-boxes" }} className="link-underlined text-walnut">designer boxes</Link> for
              keepsakes, tea, and jewelry, and{" "}
              <Link to="/shop/$category" params={{ category: "holiday-gifts" }} className="link-underlined text-walnut">holiday gifts</Link> that
              come out every December. Almost everything can be engraved.
            </p>
            <ul className="mt-8 space-y-3">
              {COLLECTIONS.map((c) => (
                <li key={c.slug}>
                  <Link to="/shop/$category" params={{ category: c.slug }} className="link-draw text-walnut">
                    {c.linkLabel} <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Reveal>
            <div className="aspect-[4/5] overflow-hidden rounded-sm">
              <SmartImage src={IMAGES.studioSanding} alt="Hands sanding the edge of a maple board, with fine dust in warm window light" width={880} height={1320} position="45% 55%" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad bg-walnut text-on-dark">
        <div className="container-site flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <h2 className="text-h2 max-w-xl">Have a piece in mind? Let's make it.</h2>
          <Link to="/custom-engraving" className="btn btn-primary">Start Your Custom Piece</Link>
        </div>
      </section>
    </>
  );
}
