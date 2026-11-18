import { useId, useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  title: string;
  content: ReactNode;
}

/** Accessible accordion: buttons with aria-expanded/aria-controls and a smooth height transition. */
export function Accordion({
  items,
  single = false,
  defaultOpen = [],
  headingLevel = 3,
  className,
}: {
  items: AccordionItem[];
  single?: boolean | undefined;
  defaultOpen?: number[] | undefined;
  headingLevel?: 2 | 3 | 4 | undefined;
  className?: string | undefined;
}) {
  const base = useId();
  const [open, setOpen] = useState<number[]>(defaultOpen);
  const H = `h${headingLevel}` as "h2" | "h3" | "h4";

  const toggle = (i: number) =>
    setOpen((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : single ? [i] : [...prev, i]));

  return (
    <div className={cn("border-t border-border", className)}>
      {items.map((item, i) => {
        const isOpen = open.includes(i);
        const btnId = `${base}-btn-${i}`;
        const panelId = `${base}-panel-${i}`;
        return (
          <div key={item.title} className="border-b border-border">
            <H className="m-0 font-sans text-base font-normal tracking-normal">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className="flex min-h-[56px] w-full items-center justify-between gap-6 py-4 text-left font-display text-lg leading-snug text-foreground transition-colors hover:text-ember md:text-xl"
              >
                <span>{item.title}</span>
                <Plus
                  aria-hidden="true"
                  className={cn("size-5 shrink-0 text-maple-2 transition-transform duration-200", isOpen && "rotate-45")}
                />
              </button>
            </H>
            <div id={panelId} role="region" aria-labelledby={btnId} className="collapse-panel" data-open={isOpen} hidden={false}>
              <div>
                <div className={cn("pb-6 pr-10 text-muted-foreground", !isOpen && "invisible")}>{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
