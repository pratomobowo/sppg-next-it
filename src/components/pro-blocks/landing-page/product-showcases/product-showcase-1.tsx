"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SHOWCASE_TABS = [
  { value: "dashboard", label: "Dashboard" },
  { value: "analytics", label: "Analytics" },
  { value: "data-tables", label: "Data Tables" },
  { value: "ecommerce", label: "E-Commerce" },
] as const;

// How long each slide stays visible before auto-advancing.
const DURATION = 5000;
// How long the slide animation itself takes.
const TRANSITION_MS = 600;

// Track laid out so each forward step pushes the current slide to the right
// while the next slide enters from the left. Order: [clone(first), ...reversed].
// The leading clone lets us loop from the last tab back to the first seamlessly.
const TRACK = [SHOWCASE_TABS[0], ...[...SHOWCASE_TABS].reverse()];
// Starting position shows the first slide (right-most real slide in the track).
const START = TRACK.length - 1;

export function ProductShowcase1() {
  const [pos, setPos] = useState(START);
  const [noTransition, setNoTransition] = useState(false);

  // Active tab derived from the current track position.
  const activeIndex = (SHOWCASE_TABS.length - pos) % SHOWCASE_TABS.length;
  const activeValue = SHOWCASE_TABS[activeIndex].value;

  // Auto-advance, then seamlessly wrap once we reach the clone slide.
  useEffect(() => {
    if (pos === 0) {
      const snap = setTimeout(() => {
        setNoTransition(true);
        setPos(START);
      }, TRANSITION_MS);
      return () => clearTimeout(snap);
    }
    const timer = setTimeout(() => setPos((p) => p - 1), DURATION);
    return () => clearTimeout(timer);
  }, [pos]);

  // Re-enable the transition after the instant wrap jump.
  useEffect(() => {
    if (!noTransition) return;
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setNoTransition(false)),
    );
    return () => cancelAnimationFrame(raf);
  }, [noTransition]);

  const handleSelect = (value: string) => {
    const index = SHOWCASE_TABS.findIndex((tab) => tab.value === value);
    if (index >= 0) setPos(SHOWCASE_TABS.length - index);
  };

  return (
    <section className="bg-background" aria-label="Product showcase">
      <div className="mx-auto max-w-7xl border-x">
        <Tabs value={activeValue} onValueChange={handleSelect} className="gap-0">
          <TabsList className="grid !h-auto w-full grid-cols-2 gap-0 rounded-none border-y bg-transparent p-0 sm:grid-cols-4">
            {SHOWCASE_TABS.map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="relative -mb-px h-auto overflow-hidden rounded-none border-t-0 border-r-0 border-b-2 border-b-transparent border-l border-l-border px-2 py-3 text-sm font-semibold shadow-none after:hidden first:border-l-0 [&:nth-child(3)]:border-l-0 [&:nth-child(-n+2)]:border-b-border data-[state=active]:bg-muted/50 data-[state=active]:shadow-none sm:py-4 sm:text-base sm:[&:nth-child(3)]:border-l sm:[&:nth-child(-n+2)]:border-b-transparent"
              >
                {label}
                {value === activeValue ? (
                  <span
                    key={pos}
                    className="bg-foreground absolute bottom-0 left-0 h-0.5"
                    style={{
                      animation: `showcase-progress ${DURATION}ms linear forwards`,
                    }}
                    aria-hidden
                  />
                ) : null}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="container-padding-x border-b py-10 sm:py-16 lg:py-24">
            <div className="bg-muted/40 relative aspect-video w-full overflow-hidden rounded-xl border">
              <div
                className="flex h-full"
                style={{
                  width: `${TRACK.length * 100}%`,
                  transform: `translateX(-${(pos * 100) / TRACK.length}%)`,
                  transition: noTransition
                    ? "none"
                    : `transform ${TRANSITION_MS}ms ease-in-out`,
                }}
              >
                {TRACK.map(({ value, label }, i) => (
                  <div
                    key={`${value}-${i}`}
                    className="relative h-full"
                    style={{ width: `${100 / TRACK.length}%` }}
                  >
                    <Image
                      src={`/showcase/preview-${value}.png`}
                      alt={`${label} preview`}
                      fill
                      sizes="(max-width: 1280px) 100vw, 1280px"
                      className="object-cover object-top"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </section>
  );
}
