import { useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface Props {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string | undefined;
  position?: string | undefined;
  eager?: boolean | undefined;
  zoom?: number | undefined;
  style?: CSSProperties | undefined;
}

/** Image with explicit size, cover fit, lazy loading, and a branded grain fallback if it fails. */
export function SmartImage({ src, alt, width, height, className, position = "50% 50%", eager, zoom, style }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return <div className={cn("grain-fallback", className)} role={alt ? "img" : undefined} aria-label={alt || undefined} />;
  }
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? "eager" : "lazy"}
      decoding={eager ? "sync" : "async"}
      // @ts-expect-error fetchpriority is valid HTML; React 19 accepts the lowercase attribute
      fetchpriority={eager ? "high" : undefined}
      onError={() => setFailed(true)}
      className={cn("h-full w-full object-cover", className)}
      style={{
        objectPosition: position,
        ...(zoom ? { transform: `scale(${zoom})`, transformOrigin: position } : null),
        ...style,
      }}
    />
  );
}

/** Two-layer image: primary photo crossfades to a close detail crop on hover/focus. */
export function SwapImage({
  src,
  alt,
  detailAlt,
  width,
  height,
  position,
  detailFocus,
  className,
  eager,
}: {
  src: string;
  alt: string;
  detailAlt?: string | undefined;
  width: number;
  height: number;
  position?: string | undefined;
  detailFocus: string;
  className?: string | undefined;
  eager?: boolean | undefined;
}) {
  return (
    <div className={cn("img-swap relative overflow-hidden rounded-sm bg-oat", className)}>
      <div className="img-primary absolute inset-0">
        <SmartImage src={src} alt={alt} width={width} height={height} position={position} eager={eager} />
      </div>
      <div className="img-alt absolute inset-0" aria-hidden="true">
        <SmartImage src={src} alt={detailAlt ?? ""} width={width} height={height} position={detailFocus} zoom={1.9} />
      </div>
    </div>
  );
}
