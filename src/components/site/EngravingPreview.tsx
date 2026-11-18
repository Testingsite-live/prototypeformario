import { useId, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STYLES = [
  { id: "script", label: "Script", className: "font-script text-[clamp(2rem,5vw,3.4rem)] normal-case tracking-normal" },
  { id: "serif", label: "Serif", className: "font-display text-[clamp(1.6rem,4vw,2.6rem)] tracking-wide" },
  { id: "block", label: "Block", className: "font-sans font-semibold uppercase text-[clamp(1.1rem,2.8vw,1.75rem)] tracking-[0.22em]" },
] as const;

export const ENGRAVING_PLACEHOLDER = "The Hendersons, est. 2026";
const MAX = 24;

/** Live engraving preview: type text, pick a style, see it on a CSS-rendered board. */
export function EngravingPreview({ showCta = true, onUse }: { showCta?: boolean | undefined; onUse?: ((text: string) => void) | undefined }) {
  const id = useId();
  const [text, setText] = useState("");
  const [style, setStyle] = useState<(typeof STYLES)[number]["id"]>("script");
  const active = STYLES.find((s) => s.id === style)!;
  const shown = text.trim() || ENGRAVING_PLACEHOLDER;

  return (
    <div className="grid items-center gap-10 md:grid-cols-[1fr_1.15fr] md:gap-14">
      <div className="order-2 md:order-1">
        <label htmlFor={`${id}-text`} className="mb-2 block text-[15px] font-medium text-on-dark">
          Your engraving text
        </label>
        <input
          id={`${id}-text`}
          type="text"
          maxLength={MAX}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={ENGRAVING_PLACEHOLDER}
          aria-describedby={`${id}-count ${id}-help`}
          className="w-full min-h-[52px] rounded-sm border border-maple/50 bg-walnut-2 px-4 text-lg text-on-dark placeholder:text-maple/60 focus-visible:outline-ember"
        />
        <p id={`${id}-count`} className="mt-2 text-sm text-maple" aria-live="polite">
          {text.length} / {MAX} characters
        </p>

        <fieldset className="mt-6">
          <legend className="mb-3 text-[15px] font-medium text-on-dark">Lettering style</legend>
          <div className="flex flex-wrap gap-3" role="radiogroup">
            {STYLES.map((s) => (
              <label
                key={s.id}
                className={cn(
                  "inline-flex min-h-[44px] cursor-pointer items-center rounded-sm border px-5 text-[15px] font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ember",
                  style === s.id ? "border-maple bg-maple text-walnut" : "border-maple/50 text-on-dark hover:border-maple",
                )}
              >
                <input
                  type="radio"
                  name={`${id}-style`}
                  value={s.id}
                  checked={style === s.id}
                  onChange={() => setStyle(s.id)}
                  className="sr-only"
                />
                {s.label}
              </label>
            ))}
          </div>
        </fieldset>

        <p id={`${id}-help`} className="mt-6 text-[15px] leading-relaxed text-maple">
          This preview is a rough guide. Final placement and sizing are confirmed with you before engraving.
        </p>

        {showCta && (
          <div className="mt-8">
            {onUse ? (
              <button type="button" className="btn btn-primary" onClick={() => onUse(text.trim())}>
                Use This in a Custom Order <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            ) : (
              <Link to="/custom-engraving" search={text.trim() ? { text: text.trim() } : {}} hash="inquiry" className="btn btn-primary">
                Use This in a Custom Order <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="order-1 md:order-2" aria-live="polite">
        <div className="board-wood relative mx-auto flex aspect-[16/10] w-full max-w-[560px] items-center justify-center overflow-hidden rounded-[18px] p-8 shadow-[inset_0_0_0_6px_oklch(0.659_0.076_70/0.5)]">
          <span className="pointer-events-none absolute inset-4 rounded-[12px] border border-walnut/15" aria-hidden="true" />
          <p className={cn("engraved max-w-full break-words text-center leading-tight", active.className)}>
            <span className="sr-only">Preview: </span>
            {shown}
          </p>
        </div>
      </div>
    </div>
  );
}
