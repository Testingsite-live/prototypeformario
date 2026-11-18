import { useEffect, useRef, useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { HERO } from "@/data/site";
import { SmartImage } from "./SmartImage";

/** Full-bleed hero: muted looping video when HERO.videoSrc is set, poster image otherwise. */
export function HeroVideo({ children }: { children: ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const hasVideo = Boolean(HERO.videoSrc);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !hasVideo) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean | undefined } }).connection?.saveData;
    if (reduce || saveData) return;
    v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [hasVideo]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section className="relative isolate flex h-[82svh] min-h-[560px] items-end overflow-hidden bg-walnut md:h-[88vh] md:min-h-[620px] md:items-center">
      <div className="absolute inset-0 -z-10">
        {hasVideo ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover object-[65%_60%] md:object-[60%_55%]"
            muted
            playsInline
            loop
            preload="metadata"
            poster={HERO.poster}
            aria-hidden="true"
          >
            {HERO.videoSrcWebm && <source src={HERO.videoSrcWebm} type="video/webm" />}
            <source src={HERO.videoSrc} type="video/mp4" />
          </video>
        ) : (
          <SmartImage
            src={HERO.poster}
            alt={HERO.posterAlt}
            width={HERO.posterWidth}
            height={HERO.posterHeight}
            position="65% 60%"
            eager
          />
        )}
        <div className="hero-overlay absolute inset-0" aria-hidden="true" />
      </div>

      {children}

      {hasVideo && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause background video" : "Play background video"}
          className="absolute bottom-5 right-5 inline-flex size-11 items-center justify-center rounded-full border border-paper/50 text-on-dark transition-colors hover:bg-paper hover:text-walnut"
        >
          {playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
        </button>
      )}
    </section>
  );
}
