"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { media } from "@/lib/media";
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
    image: media.story.src,
    alt: media.story.alt,
  },
  {
    id: "friday",
    eyebrow: "Congregation",
    title: "Friday fills the room first.",
    body: `Jumu'ah at ${site.jumah.time} with an English khutbah. Visitors are welcome — the door on Bessemer opens before the sermon does.`,
    image: media.jumah.src,
    alt: media.jumah.alt,
  },
  {
    id: "table",
    eyebrow: "Service",
    title: "From a little, much.",
    body: "Halimah's Pantry, senior meals, and a garden for the neighborhood. Worship and care share the same address.",
    image: media.pantry.src,
    alt: media.pantry.alt,
  },
  {
    id: "home",
    eyebrow: "Belonging",
    title: "A house that feels like home.",
    body: "East Greensboro finds prayer, friendship, and dignity here — one community ethic, carried forward every week.",
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
      <div className="rounded-[1.75rem] border border-pine/10 bg-white/80 p-8 shadow-sm backdrop-blur-sm md:p-10">
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
    <div className="relative z-10 h-[70vh] min-h-[28rem] w-full overflow-hidden rounded-2xl bg-ivory-deep shadow-lg shadow-pine/10">
      <Image
        src={chapter.image}
        alt={chapter.alt}
        fill
        priority={priority}
        sizes="(max-width: 1023px) 92vw, 48vw"
        className="object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-pine-deep/25 via-transparent to-transparent" />
    </div>
  );
}

/** Sticky story — scrolling images left, pinned narrative right. Warm palette. */
export function OurStoryScroll() {
  const containerRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

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

      <div className="relative z-10 mx-auto hidden min-h-[400vh] max-w-7xl lg:grid lg:grid-cols-2 lg:gap-10 xl:gap-14">
        <div className="relative z-10">
          {chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className="flex h-screen min-h-[100svh] items-center px-8 py-12 xl:px-12"
            >
              <div className="relative z-10 w-full max-w-xl">
                <VisualFrame chapter={chapter} priority={index === 0} />
                <p className="mt-5 text-[10px] uppercase tracking-[0.36em] text-ink-soft">
                  {chapter.eyebrow}
                </p>
              </div>
            </div>
          ))}
        </div>

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
              <div className="invisible pointer-events-none select-none" aria-hidden>
                <div className="rounded-[1.75rem] border border-pine/10 p-8 md:p-10">
                  <p className="text-[10px] uppercase tracking-[0.48em]">
                    {chapters[0].eyebrow}
                  </p>
                  <h2 className="mt-6 font-display text-[clamp(2.25rem,4vw,4.25rem)] font-semibold leading-[0.92]">
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

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col gap-20 px-5 py-20 lg:hidden">
        {chapters.map((chapter, index) => (
          <article key={chapter.id} className="space-y-8">
            <div className="rounded-[1.75rem] border border-pine/10 bg-white/80 p-7 shadow-sm">
              <p className="text-[10px] font-medium uppercase tracking-[0.42em] text-gold">
                {chapter.eyebrow}
              </p>
              <h2 className="mt-5 font-display text-4xl font-semibold leading-[0.94] tracking-[-0.04em] text-pine sm:text-5xl">
                {chapter.title}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-ink-soft">{chapter.body}</p>
            </div>
            <VisualFrame chapter={chapter} priority={index === 0} />
          </article>
        ))}
      </div>

      <div
        aria-hidden
        className="pointer-events-none fixed bottom-8 left-1/2 z-30 hidden h-px w-[min(14rem,40vw)] -translate-x-1/2 overflow-hidden rounded-full bg-pine/15 lg:block"
      >
        <motion.div
          style={{ width: progressWidth }}
          className="h-full bg-gradient-to-r from-transparent via-gold to-gold/40"
        />
      </div>
    </section>
  );
}
