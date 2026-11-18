import { cn } from "@/lib/utils";

/** Signature divider: fine line, small maple circle at the left, uppercase label at the right. */
export function KerfLine({ label, className, onDark = false }: { label?: string | undefined; className?: string | undefined; onDark?: boolean | undefined }) {
  return (
    <div className={cn("flex items-center gap-4", className)} role="presentation">
      <span className="size-1.5 shrink-0 rounded-full bg-maple" aria-hidden="true" />
      <span className={cn("h-px flex-1", onDark ? "bg-maple/40" : "bg-border")} aria-hidden="true" />
      {label && <span className={onDark ? "eyebrow-on-dark" : "eyebrow"}>{label}</span>}
    </div>
  );
}

export function Eyebrow({ children, onDark = false, className }: { children: React.ReactNode; onDark?: boolean | undefined; className?: string | undefined }) {
  return <p className={cn(onDark ? "eyebrow-on-dark" : "eyebrow", "mb-4", className)}>{children}</p>;
}
