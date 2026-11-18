import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/site/Kerf";

/** Shared header block for inner pages: label, H1, intro. Leaves room for the fixed header. */
export function PageIntro({
  eyebrow,
  title,
  intro,
  className,
  children,
}: {
  eyebrow?: string | undefined;
  title: string;
  intro?: ReactNode | undefined;
  className?: string | undefined;
  children?: ReactNode | undefined;
}) {
  return (
    <header className={cn("container-site pb-10 pt-32 md:pb-14 md:pt-40", className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h1 className="text-h1 max-w-4xl text-walnut">{title}</h1>
      {intro && <div className="mt-6 max-w-2xl text-lg text-muted-foreground">{intro}</div>}
      {children}
    </header>
  );
}

/** Template for text pages: intro block plus a readable body column. */
export function ContentPage({
  eyebrow,
  title,
  intro,
  children,
  wide = false,
}: {
  eyebrow?: string | undefined;
  title: string;
  intro?: ReactNode | undefined;
  children: ReactNode;
  wide?: boolean | undefined;
}) {
  return (
    <>
      <PageIntro eyebrow={eyebrow} title={title} intro={intro} />
      <div className={cn("container-site pb-24", !wide && "[&>*]:max-w-3xl")}>{children}</div>
    </>
  );
}

export function Prose({ children, className }: { children: ReactNode; className?: string | undefined }) {
  return (
    <div
      className={cn(
        "space-y-5 text-[17px] leading-[1.7] text-foreground md:text-lg [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-walnut md:[&_h2]:text-3xl [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_ul]:space-y-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
