"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { site } from "@/lib/site";

type StoryChapter = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  alt: string;
};

const chapters: StoryChapter[] = [
  {
    id: "named",
    eyebrow: "Our beginning",
    title: "Named for a teacher of this community.",
    body: `${site.name} opened in ${site.established} as masjid and table — Islamic identity, welcome, and a public pledge of service in East Greensboro.`,
    image:
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1600&q=80",
    alt: "Soft light inside a prayer hall",
  },
  {
    id: "friday",
    eyebrow: "Congregation",
    title: "Friday fills the room first.",
    body: `Jumu'ah at ${site.jumah.time} with an English khutbah. Visitors are welcome — the door on Bessemer opens before the sermon does.`,
    image:
      "https://images.unsplash.com/photo-1585036156171-384574e87da0?auto=format&fit=crop&w=1600&q=80",
    alt: "Architectural arches of a mosque exterior",
  },
  {
    id: "table",
    eyebrow: "Service",
    title: "From a little, much.",
    body: "Halimah's Pantry, senior meals, and a garden for the neighborhood. Worship and care share the same address.",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80",
    alt: "Hands sharing food at a community table",
  },
  {
    id: "home",
    eyebrow: "Belonging",
    title: "A house that feels like home.",
    body: "East Greensboro finds prayer, friendship, and dignity here — one community ethic, carried forward every week.",
    image:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1600&q=80",
    alt: "Community gathering near a place of worship",
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

  // Wide, non-overlapping holds so a chapter is never stuck at 0 while its image is on screen
  return useTransform(
    progress,
    [start, start + fade, end - fade, end],
    reduce
      ? [1, 1, 1, 1]
      : [isFirst ? 1 : 0, 1, 1, isLast ? 1 : 0],
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
      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-8 shadow-2xl shadow-black/5 backdrop-blur-xl md:p-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.48em] text-white/40">
          {chapter.eyebrow}
        </p>
        <h2 className="mt-6 bg-gradient-to-b from-white to-white/40 bg-clip-text font-display text-[clamp(2.25rem,4vw,4.25rem)] font-bold leading-[0.92] tracking-[-0.045em] text-transparent">
          {chapter.title}
        </h2>
        <p className="mt-7 max-w-md text-base leading-relaxed tracking-[0.04em] text-white/50 md:text-lg">
          {chapter.body}
        </p>
        <p className="mt-9 text-[10px] uppercase tracking-[0.42em] text-white/30">
          {String(index + 1).padStart(2, "0")} — {String(total).padStart(2, "0")}
        </p>
      </div>
    </motion.article>
  );
}

function VisualFrame({
  chapter,
  priority,
}: {
  chapter: StoryChapter;
  priority?: boolean;
}) {
  return (
    <div
      className="relative z-10 h-[70vh] min-h-[28rem] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-white/5"
      style={{
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.35), 0 28px 70px rgba(0,0,0,0.5)",
      }}
    >
      {/* Fallback plate — visible even if the remote image fails */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-white/[0.07] via-white/[0.02] to-transparent"
      />

      <Image
        src={chapter.image}
        alt={chapter.alt}
        fill
        priority={priority}
        sizes="(max-width: 1023px) 92vw, 48vw"
        className="object-cover"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/15" />
    </div>
  );
}

/**
 * Sticky story — scrolling images LEFT, pinned narrative RIGHT.
 * Image frames use explicit h-[70vh] so next/image fill cannot collapse.
 */
export function OurStoryScroll() {
  const containerRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    document.body.dataset.onDark = "true";
    document.body.dataset.scene = "about";
    return () => {
      delete document.body.dataset.onDark;
      delete document.body.dataset.scene;
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative z-0 bg-black text-white"
      aria-label="Our story"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute left-1/2 top-[18%] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at center, rgba(201,164,74,0.14), transparent 68%)",
          }}
        />
      </div>

      {/* Desktop: images left · sticky copy right */}
      <div className="relative z-10 mx-auto hidden min-h-[400vh] max-w-7xl lg:grid lg:grid-cols-2 lg:gap-10 xl:gap-14">
        {/* LEFT — scrollable visual column (defines scroll height) */}
        <div className="relative z-10">
          {chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className="flex h-screen min-h-[100svh] items-center px-8 py-12 xl:px-12"
            >
              <div className="relative z-10 w-full max-w-xl">
                <VisualFrame chapter={chapter} priority={index === 0} />
                <p className="mt-5 text-[10px] uppercase tracking-[0.36em] text-white/35">
                  {chapter.eyebrow}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT — sticky narrative, crossfades with scroll progress */}
        <div className="relative z-20">
          <div className="sticky top-0 flex h-screen min-h-[100svh] items-center px-10 xl:px-16">
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
              {/* Layout anchor so absolute panels don't collapse the column */}
              <div className="invisible pointer-events-none select-none" aria-hidden>
                <div className="rounded-[1.75rem] border border-white/10 p-8 md:p-10">
                  <p className="text-[10px] uppercase tracking-[0.48em]">
                    {chapters[0].eyebrow}
                  </p>
                  <h2 className="mt-6 font-display text-[clamp(2.25rem,4vw,4.25rem)] font-bold leading-[0.92]">
                    {chapters[0].title}
                  </h2>
                  <p className="mt-7 max-w-md text-base md:text-lg">{chapters[0].body}</p>
                  <p className="mt-9 text-[10px] uppercase tracking-[0.42em]">01 — 04</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / tablet */}
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col gap-20 px-5 py-20 lg:hidden">
        {chapters.map((chapter, index) => (
          <article key={chapter.id} className="space-y-8">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-7 shadow-2xl shadow-black/5 backdrop-blur-xl">
              <p className="text-[10px] font-medium uppercase tracking-[0.42em] text-white/40">
                {chapter.eyebrow}
              </p>
              <h2 className="mt-5 bg-gradient-to-b from-white to-white/40 bg-clip-text font-display text-4xl font-bold leading-[0.94] tracking-[-0.04em] text-transparent sm:text-5xl">
                {chapter.title}
              </h2>
              <p className="mt-6 text-base leading-relaxed tracking-[0.03em] text-white/50">
                {chapter.body}
              </p>
            </div>
            <VisualFrame chapter={chapter} priority={index === 0} />
          </article>
        ))}
      </div>

      <div
        aria-hidden
        className="pointer-events-none fixed bottom-8 left-1/2 z-30 hidden h-px w-[min(14rem,40vw)] -translate-x-1/2 overflow-hidden rounded-full bg-white/10 lg:block"
      >
        <motion.div
          style={{ width: progressWidth }}
          className="h-full bg-gradient-to-r from-white/0 via-white/70 to-white/20"
        />
      </div>
    </section>
  );
}
