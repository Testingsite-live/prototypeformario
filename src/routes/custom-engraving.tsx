import { createFileRoute, Link } from "@tanstack/react-router";
import { IMAGES } from "@/data/site";
import { seo } from "@/lib/seo";
import { PageIntro } from "@/components/templates/ContentPage";
import { Eyebrow, KerfLine } from "@/components/site/Kerf";
import { SmartImage } from "@/components/site/SmartImage";
import { EngravingPreview } from "@/components/site/EngravingPreview";
import { InquiryForm } from "@/components/site/forms/InquiryForm";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/custom-engraving")({
  validateSearch: (s: Record<string, unknown>): { text?: string | undefined } => ({
    text: typeof s["text"] === "string" && s["text"].trim() ? s["text"].slice(0, 500) : undefined,
  }),
  head: () =>
    seo(
      "Custom Laser Engraving",
      "Personalize a cutting board, box, or gift with names, dates, messages, or simple artwork. Send a custom piece inquiry to the studio in Dupont, Washington.",
    ),
  component: CustomEngraving,
});

const ENGRAVE_LIST = [
  { title: "Names and monograms", body: "A family name, initials, or a monogram set in script, serif, or block lettering." },
  { title: "Dates and coordinates", body: "A wedding date, an anniversary, or the coordinates of a place that matters." },
  { title: "Short messages and signatures", body: "A few words, a handwritten signature, or a line from a family recipe." },
  { title: "Simple line artwork and logos", body: "A clean, high contrast file works best." },
];

function CustomEngraving() {
  const { text } = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <>
      <PageIntro
        eyebrow="Custom engraving"
        title="Your name, your date, your idea. Engraved with care."
        intro="Every piece in the shop can be personalized. If you have something specific in mind, like a family recipe, a wedding date, a logo for a client gift, or simple artwork, tell us and we will confirm how it can be done."
      >
        <a href="#inquiry" className="btn btn-primary mt-9">Start Your Custom Piece</a>
      </PageIntro>

      <section className="section-pad">
        <div className="container-site grid gap-12 md:grid-cols-[1fr_1fr] md:gap-20">
          <Reveal>
            <div className="aspect-[4/3] overflow-hidden rounded-sm md:aspect-[4/5]">
              <SmartImage src={IMAGES.engravingCloseup} alt="Close-up of a crisp laser engraved floral flourish on maple wood" width={1536} height={1024} position="40% 50%" />
            </div>
          </Reveal>
          <div>
            <Eyebrow>What we can engrave</Eyebrow>
            <h2 className="text-h2 mb-8 text-walnut">Clean lines, set into the grain.</h2>
            <ul>
              {ENGRAVE_LIST.map((e, i) => (
                <Reveal as="li" key={e.title} delayStep={i} className="border-t border-border py-5">
                  <h3 className="text-h3 text-walnut">{e.title}</h3>
                  <p className="mt-1 text-muted-foreground">{e.body}</p>
                </Reveal>
              ))}
            </ul>
            <p className="mt-6 border-l-2 border-maple pl-4 text-[16px] text-muted-foreground">
              Fine detail and very small text depend on the wood and the size of the piece. We will tell you what will look best before we start.
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad bg-walnut text-on-dark" aria-labelledby="preview-title">
        <div className="container-site">
          <Eyebrow onDark>Try it</Eyebrow>
          <h2 id="preview-title" className="text-h2 mb-12 max-w-2xl">See your name on the grain.</h2>
          <EngravingPreview
            onUse={(t) => {
              navigate({ search: t ? { text: t } : {}, replace: true, resetScroll: false });
              document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" });
              setTimeout(() => document.getElementById("inq-idea")?.focus({ preventScroll: true }), 400);
            }}
          />
        </div>
      </section>

      <section className="section-pad bg-oat">
        <div className="container-site grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center md:gap-20">
          <div>
            <Eyebrow>Business and bulk gifts</Eyebrow>
            <h2 className="text-h2 text-walnut">Gifts for clients, teams, and events.</h2>
          </div>
          <p className="text-lg text-muted-foreground">
            Ordering several pieces for clients, a team, or an event? Tell us the quantity and your idea, and we will put together a plan.
          </p>
        </div>
      </section>

      <section id="inquiry" className="section-pad scroll-mt-20" aria-labelledby="inquiry-title">
        <div className="container-site grid gap-12 md:grid-cols-[0.7fr_1.3fr] md:gap-20">
          <div>
            <KerfLine label="Inquiry" className="mb-8" />
            <h2 id="inquiry-title" className="text-h2 text-walnut">Custom Piece Inquiry</h2>
            <p className="mt-5 text-muted-foreground">
              Share what you would like made. We will reply by email to confirm the wood, the engraving layout, and the price before anything is
              made.
            </p>
            <p className="mt-5 text-[15px] text-muted-foreground">
              Prefer to start from a shop piece? <Link to="/shop" className="link-underlined text-walnut">Browse the collection</Link>.
            </p>
          </div>
          <InquiryForm prefill={text} />
        </div>
      </section>
    </>
  );
}
