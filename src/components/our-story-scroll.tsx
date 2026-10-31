"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { media } from "@/lib/media";
import { site } from "@/lib/site";

type StoryChapter = {
  id: string;
  number: string;
  scrubber: string;
  eyebrow: string;
  title: string;
  body: string;
  caption: string;
  image: string;
  alt: string;
};

const chapters: StoryChapter[] = [
  {
    id: "named",
    number: "01",
    scrubber: "Our Beginning",
    eyebrow: "Our beginning",
    title: "Named for a teacher of this community.",
    body: `${site.name} opened in ${site.established} as masjid and table — Islamic identity, welcome, and a public pledge of service in East Greensboro.`,
    caption: "East Greensboro · Founded 2018",
    image: media.story.src,
    alt: media.story.alt,
  },
  {
    id: "friday",
    number: "02",
    scrubber: "Congregation",
    eyebrow: "Congregation",
    title: "Friday fills the room first.",
    body: `Jumu'ah at ${site.jumah.time} with an English khutbah. Visitors are welcome — the door on Bessemer opens before the sermon does.`,
    caption: "Jumu'ah · English khutbah",
    image: media.jumah.src,
    alt: media.jumah.alt,
  },
  {
    id: "table",
    number: "03",
    scrubber: "Service",
    eyebrow: "Service",
    title: "From a little, much.",
    body: "Halimah's Pantry and a garden for the neighborhood. Worship and care share the same address.",
    caption: "Halimah's Pantry · Open table",
    image: media.pantry.src,
    alt: media.pantry.alt,
  },
  {
    id: "home",
    number: "04",
    scrubber: "Belonging",
    eyebrow: "Belonging",
    title: "A house that feels like home.",
    body: "East Greensboro finds prayer, friendship, and dignity here — one community ethic, carried forward every week.",
    caption: "Community · Friendship · Dignity",
    image: media.gathering.src,
    alt: media.gathering.alt,
  },
];

function useChapterOpacity(
  progress: MotionValue<number>,
  index: number,
  total: number,
  reduce: boolean | null,
) {
  const start = index / total;
  const end = (index + 1) / total;
  const fade = Math.max((end - start) * 0.22, 0.04);
  const isFirst = index === 0;
  const isLast = index === total - 1;

  return useTransform(
    progress,
    [start, start + fade, end - fade, end],
    reduce ? [1, 1, 1, 1] : [isFirst ? 1 : 0, 1, 1, isLast ? 1 : 0],
  );
}

function ChapterScrubber({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <nav aria-label="Story chapters" className="flex flex-wrap items-center gap-2 md:gap-2.5">
      {chapters.map((chapter, index) => {
        const active = index === activeIndex;
        return (
          <button
            key={chapter.id}
            type="button"
            onClick={() => onSelect(index)}
            aria-current={active ? "true" : undefined}
            className={`group inline-flex items-center gap-2.5 rounded-full border px-3.5 py-2 text-left transition-all duration-300 ${
              active
                ? "border-gold/45 bg-pine text-ivory shadow-md shadow-pine/15"
                : "border-pine/15 bg-white/70 text-pine/70 backdrop-blur-md hover:border-gold/35 hover:bg-white hover:text-pine"
            }`}
          >
            <span
              className={`font-display text-sm font-semibold tracking-[-0.02em] ${
                active ? "text-gold-soft" : "text-gold"
              }`}
            >
              {chapter.number}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.28em]">
              {chapter.scrubber}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function VisualFrame({
  chapter,
  priority,
  className = "",
}: {
  chapter: StoryChapter;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative z-10 w-full rounded-[2rem] border border-white/15 bg-white/[0.04] p-2.5 shadow-lg shadow-pine/10 backdrop-blur-sm ${className}`}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.55rem] bg-ivory-deep md:aspect-[5/6] md:min-h-[22rem] lg:aspect-auto lg:h-[min(68vh,36rem)]">
        <Image
          src={chapter.image}
          alt={chapter.alt}
          fill
          priority={priority}
          sizes="(max-width: 1023px) 92vw, 48vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-pine-deep/55 via-transparent to-pine/10"
        />
        <div className="absolute bottom-4 left-4 right-4 z-10 sm:bottom-5 sm:left-5">
          <span className="inline-flex max-w-[90%] items-center rounded-full border border-white/25 bg-pine-deep/70 px-3.5 py-2 text-[10px] uppercase tracking-[0.32em] text-ivory/90 shadow-lg backdrop-blur-md">
            {chapter.caption}
          </span>
        </div>
      </div>
    </div>
  );
}

function NarrativeCard({
  chapter,
  index,
  total,
}: {
  chapter: StoryChapter;
  index: number;
  total: number;
}) {
  return (
    <div className="rounded-[1.75rem] border border-pine/10 bg-white/85 p-8 shadow-sm backdrop-blur-sm md:p-10">
      <p className="text-[10px] font-medium uppercase tracking-[0.48em] text-gold">
        {chapter.eyebrow}
      </p>
      <h2 className="mt-6 font-display text-[clamp(2.25rem,4vw,4.25rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-pine">
        {chapter.title}
      </h2>
      <p className="mt-7 max-w-md text-base leading-relaxed text-ink-soft md:text-lg">
        {chapter.body}
      </p>
      <p className="mt-9 text-[10px] uppercase tracking-[0.42em] text-ink-soft/70">
        {String(index + 1).padStart(2, "0")} — {String(total).padStart(2, "0")}
      </p>
    </div>
  );
}

function ChapterPanel({
  chapter,
  index,
  total,
  progress,
  reduce,
}: {
  chapter: StoryChapter;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduce: boolean | null;
}) {
  const opacity = useChapterOpacity(progress, index, total, reduce);
  const y = useTransform(opacity, [0, 1], reduce ? [0, 0] : [24, 0]);

  return (
    <motion.article
      style={{ opacity, y }}
      className="absolute inset-x-0 top-1/2 z-10 w-full -translate-y-1/2"
    >
      <NarrativeCard chapter={chapter} index={index} total={total} />
    </motion.article>
  );
}

function StackedVisual({
  chapter,
  index,
  total,
  progress,
  reduce,
  isBase,
}: {
  chapter: StoryChapter;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduce: boolean | null;
  isBase: boolean;
}) {
  const opacity = useChapterOpacity(progress, index, total, reduce);
  const scale = useTransform(opacity, [0, 1], reduce ? [1, 1] : [0.96, 1]);

  return (
    <motion.div
      style={{ opacity, scale }}
      className={isBase ? "relative" : "absolute inset-0"}
    >
      <VisualFrame chapter={chapter} priority={index === 0} />
    </motion.div>
  );
}

/** Sticky story — scrubber + glass-bezel images left, pinned narrative right. Warm palette. */
export function OurStoryScroll() {
  const containerRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!isDesktop) return;
    const next = Math.min(
      chapters.length - 1,
      Math.max(0, Math.floor(value * chapters.length)),
    );
    setActiveIndex((prev) => (prev === next ? prev : next));
  });

  useEffect(() => {
    if (isDesktop) return;
    const nodes = chapters
      .map((chapter) => document.getElementById(`story-${chapter.id}`))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const id = visible.target.id.replace("story-", "");
        const index = chapters.findIndex((chapter) => chapter.id === id);
        if (index >= 0) setActiveIndex(index);
      },
      { rootMargin: "-30% 0px -45% 0px", threshold: [0.2, 0.45, 0.7] },
    );

    nodes.forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, [isDesktop]);

  const jumpToChapter = (index: number) => {
    setActiveIndex(index);

    if (!isDesktop) {
      const el = document.getElementById(`story-${chapters[index].id}`);
      if (el) {
        el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }
      return;
    }

    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    const travel = Math.max(el.offsetHeight - window.innerHeight, 0);
    const y = absoluteTop + (travel * (index + 0.02)) / chapters.length;
    window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section
      ref={containerRef}
      className="relative z-0 bg-ivory text-ink"
      aria-label="Our story"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute left-1/2 top-[18%] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at center, rgba(201,164,74,0.16), transparent 68%)",
          }}
        />
      </div>

      {/* Desktop: sticky dual-column stage — both sides always populated */}
      <div className="relative z-10 mx-auto hidden min-h-[400vh] max-w-7xl lg:block">
        <div className="sticky top-0 z-30 flex h-screen min-h-[100svh] flex-col px-8 py-8 xl:px-12">
          <div className="mb-6 flex shrink-0 items-center justify-between gap-6">
            <ChapterScrubber activeIndex={activeIndex} onSelect={jumpToChapter} />
            <p className="hidden text-[10px] uppercase tracking-[0.36em] text-ink-soft/60 xl:block">
              Scroll or select a chapter
            </p>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-2 items-center gap-10 xl:gap-14">
            <div className="relative z-10 flex items-center">
              <div className="relative w-full max-w-xl">
                {chapters.map((chapter, index) => (
                  <StackedVisual
                    key={chapter.id}
                    chapter={chapter}
                    index={index}
                    total={chapters.length}
                    progress={scrollYProgress}
                    reduce={reduce}
                    isBase={index === 0}
                  />
                ))}
              </div>
            </div>

            <div className="relative z-20 flex items-center">
              <div className="relative w-full max-w-xl">
                {chapters.map((chapter, index) => (
                  <ChapterPanel
                    key={chapter.id}
                    chapter={chapter}
                    index={index}
                    total={chapters.length}
                    progress={scrollYProgress}
                    reduce={reduce}
                  />
                ))}
                <div className="invisible pointer-events-none select-none" aria-hidden>
                  <NarrativeCard
                    chapter={chapters[0]}
                    index={0}
                    total={chapters.length}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / tablet: image + narrative both visible per chapter */}
      <div className="relative z-10 mx-auto max-w-3xl px-5 py-12 lg:hidden">
        <div className="sticky top-[4.75rem] z-20 -mx-1 mb-10 rounded-full border border-pine/10 bg-ivory/90 p-2 shadow-sm backdrop-blur-md">
          <ChapterScrubber activeIndex={activeIndex} onSelect={jumpToChapter} />
        </div>

        <div className="flex flex-col gap-16">
          {chapters.map((chapter, index) => (
            <article
              key={chapter.id}
              id={`story-${chapter.id}`}
              className="scroll-mt-36 space-y-7"
            >
              <VisualFrame chapter={chapter} priority={index === 0} />
              <NarrativeCard chapter={chapter} index={index} total={chapters.length} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
