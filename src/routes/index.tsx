import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { BRAND, COLLECTIONS, FAQS, GIFTING, IMAGES, PROCESS_STEPS, DEFAULT_DESCRIPTION } from "@/data/site";
import { featuredProducts } from "@/lib/shop";
import { seo } from "@/lib/seo";
import { HeroVideo } from "@/components/site/HeroVideo";
import { Eyebrow, KerfLine } from "@/components/site/Kerf";
import { Reveal } from "@/components/site/Reveal";
import { SmartImage, SwapImage } from "@/components/site/SmartImage";
import { ProductCard } from "@/components/site/ProductCard";
import { EngravingPreview } from "@/components/site/EngravingPreview";
import { Accordion } from "@/components/site/Accordion";
import { cn } from "@/lib/utils";

const localBusiness = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: BRAND.name,
  description: DEFAULT_DESCRIPTION,
  address: { "@type": "PostalAddress", addressLocality: BRAND.locality, addressRegion: BRAND.region, addressCountry: "US" },
  ...(BRAND.url ? { url: BRAND.url } : {}),
};

export const Route = createFileRoute("/")({
  head: () => ({
    ...seo(undefined, DEFAULT_DESCRIPTION),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(localBusiness) }],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* 1. Hero */}
      <HeroVideo>
        <div className="container-site pb-16 pt-28 text-on-dark md:pb-0 md:pt-20">
          <div className="max-w-[640px]">
            <p className="eyebrow-on-dark mb-5">Handmade in {BRAND.location}</p>
            <h1 className="text-h1">Wood worth giving. Shaped by hand. Finished with your name.</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-on-dark/90">
              Custom cutting boards, designer boxes, and holiday gifts, made one at a time and personalized with precision laser engraving.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/shop" className="btn btn-primary">Shop the Collection</Link>
              <Link to="/custom-engraving" className="btn btn-on-dark">Start Your Custom Piece</Link>
            </div>
            <p className="mt-8 text-[15px] tracking-wide text-on-dark/80">Made to order. Engraved to your design. Shipped across the US.</p>
          </div>
        </div>
      </HeroVideo>

      {/* 2. Studio statement */}
      <section className="section-pad">
        <div className="container-site grid items-center gap-12 md:grid-cols-[1fr_0.9fr] md:gap-20">
          <Reveal className="order-2 md:order-1">
            <Eyebrow>The studio</Eyebrow>
            <h2 className="text-h2 text-walnut">A small workshop with a very particular eye for grain.</h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Every board and box here starts as a rough hardwood blank on a home workbench in Dupont. It gets cut, glued, flattened, sanded, and
              finished by hand. Then, if you want it, a laser adds your name, your date, or a message with crisp, clean detail. The result is a
              piece that looks like it belongs to one person, because it does.
            </p>
            <Link to="/about" className="link-draw mt-8 text-walnut">
              Meet the studio <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Reveal>
          <Reveal className="order-1 md:order-2" delayStep={1}>
            <div className="aspect-[4/5] overflow-hidden rounded-sm md:aspect-[3/4]">
              <SmartImage src={IMAGES.studioSanding} alt="Hands sanding the edge of a maple cutting board on a workbench in warm window light" width={880} height={1320} position="45% 55%" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. Collections */}
      <section className="section-pad bg-oat">
        <div className="container-site">
          <KerfLine label="01 / Collections" />
          <h2 className="text-h2 mb-12 mt-8 max-w-2xl text-walnut">Three ways to give something made.</h2>
          <div className="grid gap-6 md:grid-cols-2 md:grid-rows-2">
            {COLLECTIONS.map((c, i) => (
              <Reveal key={c.slug} delayStep={i} className={cn(i === 0 && "md:row-span-2")}>
                <Link to="/shop/$category" params={{ category: c.slug }} className="img-swap group flex h-full flex-col">
                  <SwapImage
                    src={c.image}
                    alt={c.imageAlt}
                    width={c.imageWidth}
                    height={c.imageHeight}
                    detailFocus={c.detailFocus}
                    className={cn("w-full", i === 0 ? "aspect-[4/5] md:aspect-auto md:flex-1" : "aspect-[16/10]")}
                  />
                  <div className="flex items-end justify-between gap-6 pt-5">
                    <div>
                      <h3 className="text-h3 text-walnut">{c.name}</h3>
                      <p className="mt-1 max-w-md text-[16px] text-muted-foreground">{c.tileCopy}</p>
                    </div>
                    <span className="link-draw shrink-0 text-[15px] text-walnut">
                      {c.linkLabel} <ArrowRight className="size-4" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured */}
      <section className="section-pad">
        <div className="container-site">
          <div className="mb-10 flex items-end justify-between gap-6">
            <h2 className="text-h2 text-walnut">Start with a favorite.</h2>
            <Link to="/shop" className="link-draw hidden shrink-0 text-walnut sm:inline-flex">
              See every piece <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="scroll-snap-row -mx-5 flex gap-5 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-4 md:gap-8 md:overflow-visible md:px-0">
            {featuredProducts().map((p, i) => (
              <Reveal as="li" key={p.slug} delayStep={i} className="w-[72%] shrink-0 sm:w-[44%] md:w-auto">
                <ProductCard product={p} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Process */}
      <section className="section-pad border-y border-border bg-oat">
        <div className="container-site">
          <KerfLine label="02 / Process" />
          <h2 className="text-h2 mb-12 mt-8 text-walnut">From blank to yours.</h2>
          <ol className="grid border-t border-border md:grid-cols-4 md:border-t-0">
            {PROCESS_STEPS.map((s, i) => (
              <Reveal
                as="li"
                key={s.title}
                delayStep={i}
                className="flex gap-6 border-b border-border py-7 md:flex-col md:gap-4 md:border-b-0 md:border-l md:px-7 md:py-2 md:first:border-l-0 md:first:pl-0"
              >
                <span className="font-display text-5xl leading-none text-maple-2 md:text-7xl" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-h3 text-walnut">
                    <span className="sr-only">Step {i + 1}: </span>
                    {s.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <Link to="/custom-engraving" className="btn btn-secondary mt-12">Start Your Custom Piece</Link>
        </div>
      </section>

      {/* 6. Live engraving preview */}
      <section className="section-pad bg-walnut text-on-dark" aria-labelledby="try-it">
        <div className="container-site">
          <Eyebrow onDark>Try it</Eyebrow>
          <h2 id="try-it" className="text-h2 mb-12 max-w-2xl">See your name on the grain.</h2>
          <EngravingPreview />
        </div>
      </section>

      {/* 7. Gifting occasions */}
      <section className="section-pad">
        <div className="container-site">
          <Eyebrow>Gifting</Eyebrow>
          <h2 className="text-h2 mb-10 max-w-2xl text-walnut">A piece for the moments that matter.</h2>
          <ul>
            {GIFTING.map((g, i) => (
              <Reveal as="li" key={g.title} delayStep={i}>
                <KerfLine label={`0${i + 1}`} />
                <Link
                  to={g.to}
                  search={"search" in g ? g.search : undefined}
                  className="group flex items-center justify-between gap-6 py-7 md:py-9"
                >
                  <div>
                    <h3 className="font-display text-[clamp(1.6rem,3.4vw,2.75rem)] leading-tight text-walnut transition-colors group-hover:text-ember">
                      {g.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground">{g.body}</p>
                  </div>
                  <ArrowUpRight
                    className="size-7 shrink-0 text-maple-2 transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-ember"
                    aria-hidden="true"
                  />
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 8. Care teaser */}
      <section className="section-pad bg-oat">
        <div className="container-site grid items-center gap-12 md:grid-cols-[0.85fr_1fr] md:gap-20">
          <Reveal>
            <div className="aspect-[4/5] overflow-hidden rounded-sm">
              <SmartImage src={IMAGES.careOil} alt="Walnut cutting board half conditioned with mineral oil beside an unlabeled glass bottle and a cloth" width={880} height={1320} position="40% 60%" />
            </div>
          </Reveal>
          <Reveal delayStep={1}>
            <Eyebrow>Care and materials</Eyebrow>
            <h2 className="text-h2 text-walnut">Made to be used, built to be kept.</h2>
            <p className="mt-6 text-lg text-muted-foreground">
              A good board gets better with care. We include simple instructions with every order, and our care guide covers cleaning, oiling,
              and storage.
            </p>
            <Link to="/care" className="link-draw mt-8 text-walnut">
              Read the Care Guide <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 9. FAQ */}
      <section className="section-pad">
        <div className="container-site grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
          <div>
            <Eyebrow>Questions</Eyebrow>
            <h2 className="text-h2 text-walnut">Good to know before you order.</h2>
            <Link to="/faq" className="link-draw mt-8 text-walnut">
              See all questions <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <Accordion items={FAQS.slice(0, 4).map((f) => ({ title: f.q, content: <p>{f.a}</p> }))} single />
        </div>
      </section>

      {/* 10. Final CTA */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <SmartImage src={IMAGES.grainMacro} alt="" width={1536} height={1024} position="60% 50%" />
          <div className="absolute inset-0 bg-paper/55" aria-hidden="true" />
        </div>
        <div className="container-site section-pad">
          <Reveal className="max-w-2xl bg-paper/95 p-8 md:p-14">
            <h2 className="text-h2 text-walnut">Have something specific in mind?</h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Tell us what you are picturing. We will confirm what is possible, the wood, and the engraving layout before anything is made.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/custom-engraving" className="btn btn-primary">Start Your Custom Piece</Link>
              <Link to="/shop" className="btn btn-secondary">Shop the Collection</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
