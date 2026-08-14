"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// Full-screen image viewer for the shop tour.
//
// Kom asked for the gumon.io behaviour (2026-08-15), so the mechanics are lifted from
// `gumon-company-website/components/ImageLightbox.tsx`: a portal to <body>, scroll lock
// while open, Escape to close, arrow keys and a touch swipe to move between shots, and a
// counter so you know how far through you are. The styling is rewritten in Tailwind
// because that site's version leans on a CSS-variable design system this repo does not
// have — copying its stylesheet would have imported a second theme.
//
// The swipe threshold is 44px, same as theirs: below that a swipe is indistinguishable
// from a tap that drifted, and treating those as page turns makes the viewer feel twitchy.

export type LightboxShot = {
  src: string;
  alt: string;
  caption?: string;
};

type Props = {
  shots: LightboxShot[];
  /** Index to open at, or null when closed. */
  openAt: number | null;
  onClose: () => void;
};

export default function Lightbox({ shots, openAt, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [i, setI] = useState(0);
  const [touchX, setTouchX] = useState<number | null>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (openAt !== null) setI(openAt);
  }, [openAt]);

  const isOpen = openAt !== null;
  const count = shots.length;

  const next = useCallback(() => setI((c) => (c + 1) % count), [count]);
  const prev = useCallback(() => setI((c) => (c - 1 + count) % count), [count]);

  useEffect(() => {
    if (!isOpen) return;

    // Remember what the page had rather than assuming "" — the consent banner also
    // locks scrolling, and restoring a blank would silently unlock it underneath us.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (count > 1 && e.key === "ArrowRight") next();
      if (count > 1 && e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, count, next, prev, onClose]);

  if (!mounted || !isOpen) return null;

  const shot = shots[i] ?? shots[0];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={shot.alt}
      onClick={onClose}
      className="fixed inset-0 z-[140] grid place-items-center bg-[#04160f]/92 p-2 backdrop-blur-xl"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close image viewer"
        className="absolute right-4 top-4 z-10 grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
      >
        <X className="h-5 w-5" aria-hidden />
      </button>

      {count > 1 && (
        <span className="absolute left-4 top-4 z-10 inline-flex min-h-12 items-center rounded-full border border-white/20 bg-white/10 px-4 text-sm font-semibold tracking-wider text-white">
          {i + 1} / {count}
        </span>
      )}

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous photograph"
            className="absolute left-3 top-1/2 z-10 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 md:left-6"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next photograph"
            className="absolute right-3 top-1/2 z-10 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 md:right-6"
          >
            <ChevronRight className="h-6 w-6" aria-hidden />
          </button>
        </>
      )}

      <figure
        className="m-0 grid max-h-full justify-items-center gap-4"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => setTouchX(e.changedTouches[0]?.clientX ?? null)}
        onTouchEnd={(e) => {
          if (touchX === null || count <= 1) return;
          const dx = (e.changedTouches[0]?.clientX ?? touchX) - touchX;
          if (Math.abs(dx) >= 44) (dx < 0 ? next : prev)();
          setTouchX(null);
        }}
      >
        {/* Plain <img>, not next/image: the viewer sizes itself to the viewport rather
            than to a known box, and `images.unoptimized` is on anyway, so next/image
            would add a wrapper and no benefit. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shot.src}
          alt={shot.alt}
          className="max-h-[82vh] w-auto max-w-[96vw] rounded-2xl object-contain shadow-2xl"
        />
        {shot.caption && (
          <figcaption className="max-w-[92vw] rounded-full border border-white/15 bg-white/10 px-5 py-3 text-center text-sm leading-relaxed text-white/90">
            {shot.caption}
          </figcaption>
        )}
      </figure>
    </div>,
    document.body
  );
}
