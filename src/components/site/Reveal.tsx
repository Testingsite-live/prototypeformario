import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Fades content up once when it enters the viewport. Content is visible by default
 * (server render and no-JS); the hidden state is only applied after mount.
 */
export function Reveal({
  children,
  className,
  delayStep = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string | undefined;
  delayStep?: number | undefined;
  as?: ElementType | undefined;
}) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<"idle" | "pending" | "shown">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) return; // already visible: leave as is
    setState("pending");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState("shown");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const step = Math.min(delayStep, 3);
  return (
    <Tag
      ref={ref}
      className={cn(state === "pending" && "reveal-pending", state === "shown" && "reveal-shown", className)}
      style={state === "shown" && step ? { transitionDelay: `${step * 80}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
