"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

const PlayerInner = dynamic(() => import("./PlayerInner"), {
  ssr: false,
  loading: () => (
    <div aria-hidden className="flex h-full w-full items-center justify-center bg-surface">
      <span className="tracking-widest text-muted">LOADING DEMO</span>
    </div>
  ),
});

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia(REDUCED_MOTION).matches;
}

export default function DemoPlayer() {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false
  );

  return (
    <div>
      <div
        className="relative w-full overflow-hidden border-2 border-line bg-surface"
        style={{ aspectRatio: "1280 / 800" }}
      >
        <PlayerInner reducedMotion={reducedMotion} />
      </div>
      <p className="mx-auto mt-5 max-w-3xl text-center text-muted">
        Simulated alert for CVE-2026-98432. The tracker shows it as pending for linux-generic
        on 24.04 at the time of this build; the released step shown here has not happened yet.
      </p>
    </div>
  );
}
