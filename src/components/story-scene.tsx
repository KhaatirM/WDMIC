"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  BookOpen,
  HeartHandshake,
  MoonStar,
  Sparkles,
  Users,
} from "lucide-react";
import { site } from "@/lib/site";

type RevealCard = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  icon: typeof Sparkles;
  /** [appear, peak-in, peak-out, disappear] along scrollYProgress */
  range: [number, number, number, number];
  placement: string;
};

const cards: RevealCard[] = [
  {
    id: "welcome",
    eyebrow: "Masjid",
    title: "Warm before you arrive",
    body: "A house of worship that opens first with light — then with people.",
    icon: MoonStar,
    range: [0, 0.08, 0.2, 0.3],
    placement:
      "left-[3%] top-[10%] md:left-[5%] md:top-[14%] w-[min(17rem,72vw)]",
  },
  {
    id: "jumah",
    eyebrow: "Jumu'ah",
    title: site.jumah.time,
    body: "English khutbah. Visitors welcome every Friday.",
    icon: Users,
    range: [0.22, 0.32, 0.44, 0.54],
    placement:
      "right-[3%] top-[8%] md:right-[5%] md:top-[12%] w-[min(16rem,72vw)]",
  },
  {
    id: "pantry",
    eyebrow: "Service",
    title: "Halimah's Pantry",
    body: "Food, clothing, and care for East Greensboro — from a little, much.",
    icon: HeartHandshake,
    range: [0.48, 0.58, 0.7, 0.8],
    placement:
      "left-[4%] bottom-[8%] md:left-[6%] md:bottom-[10%] w-[min(17rem,72vw)]",
  },
  {
    id: "journal",
    eyebrow: "Journal",
    title: "Community writing",
    body: "Notes from the office, the garden, and the Friday table.",
    icon: BookOpen,
    range: [0.68, 0.78, 0.88, 0.96],
    placement:
      "right-[3%] bottom-[6%] md:right-[5%] md:bottom-[10%] w-[min(16rem,72vw)]",
  },
];

function useCardMotion(
  progress: MotionValue<number>,
  range: [number, number, number, number],
  reduce: boolean | null,
) {
  const [a, b, c, d] = range;
  const startsVisible = a <= 0;
  const opacity = useTransform(
    progress,
    [a, b, c, d],
    reduce ? [1, 1, 1, 1] : startsVisible ? [1, 1, 1, 0] : [0, 1, 1, 0],
  );
  const y = useTransform(
    progress,
    [a, b, c, d],
    reduce ? [0, 0, 0, 0] : startsVisible ? [0, 0, 0, -48] : [56, 0, 0, -48],
  );
  const scale = useTransform(
    progress,
    [a, b, c, d],
    reduce ? [1, 1, 1, 1] : startsVisible ? [1, 1, 1, 0.96] : [0.92, 1, 1, 0.96],
  );
  return { opacity, y, scale };
}

function FloatingCard({
  card,
  progress,
  reduce,
}: {
  card: RevealCard;
  progress: MotionValue<number>;
  reduce: boolean | null;
}) {
  const { opacity, y, scale } = useCardMotion(progress, card.range, reduce);
  const Icon = card.icon;

  return (
    <motion.article
      style={{ opacity, y, scale }}
      className={`pointer-events-none absolute z-10 ${card.placement}`}
      aria-hidden
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.03] p-8 shadow-2xl shadow-black/40 backdrop-blur-xl transition-colors duration-500 ease-out md:p-9">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(circle at 20% 0%, rgba(255,255,255,0.06), transparent 55%)",
          }}
        />
        <div className="relative flex items-start gap-6">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/5 bg-white/[0.04] shadow-2xl shadow-black/20 backdrop-blur-xl">
            <Icon className="h-4 w-4 text-white/70" strokeWidth={1.5} aria-hidden />
          </div>
          <div className="min-w-0 pt-0.5">
            <p className="text-[10px] font-medium uppercase tracking-[0.42em] text-white/35">
              {card.eyebrow}
            </p>
            <h3 className="mt-3.5 font-display text-2xl leading-[0.95] tracking-[-0.03em] text-white/90">
              {card.title}
            </h3>
            <p className="mt-3.5 text-sm leading-relaxed tracking-wide text-white/45">
              {card.body}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function AmbientOrb({
  progress,
  reduce,
  className,
  range,
  drift,
}: {
  progress: MotionValue<number>;
  reduce: boolean | null;
  className: string;
  range: [number, number, number, number];
  drift: [number, number];
}) {
  const [a, b, c, d] = range;
  const opacity = useTransform(
    progress,
    [a, b, c, d],
    reduce ? [0.35, 0.35, 0.35, 0.35] : [0, 0.55, 0.55, 0],
  );
  const y = useTransform(
    progress,
    [a, b, c, d],
    reduce ? [0, 0, 0, 0] : [drift[0], 0, 0, drift[1]],
  );
  const scale = useTransform(
    progress,
    [a, b, c, d],
    reduce ? [1, 1, 1, 1] : [0.85, 1, 1, 1.05],
  );

  return (
    <motion.div
      aria-hidden
      style={{ opacity, y, scale }}
      className={`pointer-events-none absolute rounded-full border border-white/5 bg-white/[0.03] shadow-2xl shadow-black/30 backdrop-blur-xl ${className}`}
    />
  );
}

/**
 * Sticky product-reveal stage — pinned center typography with
 * scroll-scrubbed UI cards fading around it (Awwwards / Apple cadence).
 */
export function StoryScene() {
  const containerRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.75, 0.9, 1],
    reduce ? [1, 1, 1, 1] : [1, 1, 0.55, 0.2],
  );
  const titleY = useTransform(
    scrollYProgress,
    [0, 0.85, 1],
    reduce ? [0, 0, 0] : [0, 0, -24],
  );
  const titleScale = useTransform(
    scrollYProgress,
    [0, 0.85, 1],
    reduce ? [1, 1, 1] : [1, 1, 0.97],
  );

  const subOpacity = useTransform(
    scrollYProgress,
    [0, 0.7, 0.88, 1],
    reduce ? [1, 1, 1, 1] : [1, 1, 0.4, 0],
  );
  const subY = useTransform(
    scrollYProgress,
    [0, 0.7, 0.88, 1],
    reduce ? [0, 0, 0, 0] : [0, 0, -12, -20],
  );

  const glowOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.7, 1],
    reduce ? [0.55, 0.55, 0.55, 0.55] : [0.45, 0.7, 0.55, 0.25],
  );
  const glowScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduce ? [1, 1, 1] : [1, 1.06, 0.95],
  );

  const calligraphyOpacity = useTransform(
    scrollYProgress,
    [0, 0.4, 0.85, 1],
    reduce ? [0.22, 0.22, 0.22, 0.22] : [0.14, 0.2, 0.22, 0.16],
  );
  const calligraphyScale = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [1, 1] : [0.9, 1.1],
  );

  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      className="relative z-[2] h-[340vh] w-full bg-black"
      aria-label="Product reveal"
    >
      <div className="sticky top-0 flex h-svh w-full items-center justify-center overflow-hidden px-8 md:px-16">
        {/* Pitch-black base + centered radial glow */}
        <div className="absolute inset-0 bg-black" />
        <motion.div
          aria-hidden
          style={{ opacity: glowOpacity, scale: glowScale }}
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[min(72vw,42rem)] w-[min(72vw,42rem)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        >
          <motion.div
            className="h-full w-full rounded-full"
            animate={
              reduce
                ? undefined
                : {
                    opacity: [0.72, 1, 0.72],
                    scale: [0.94, 1.06, 0.94],
                  }
            }
            transition={{
              duration: 9,
              ease: "easeInOut",
              repeat: Infinity,
            }}
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 32%, transparent 68%)",
            }}
          />
        </motion.div>

        {/* Arabic calligraphy watermark — scroll-scrubbed scale + fade */}
        <motion.div
          aria-hidden
          style={{ opacity: calligraphyOpacity, scale: calligraphyScale }}
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
        >
          <div className="relative h-[min(92vmin,52rem)] w-[min(92vmin,52rem)] md:h-[min(96vmin,58rem)] md:w-[min(96vmin,58rem)]">
            {/* Soft gold bloom behind the calligraphy */}
            <div
              className="absolute inset-[14%] rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(201,164,74,0.22) 0%, rgba(42,36,24,0.1) 48%, transparent 72%)",
              }}
            />
            {/*
              SVG uses a dark gray → gold ink gradient (never pure white).
              Layer opacity is capped at ~0.15 via useTransform for watermark feel.
            */}
            <img
              src="/arabic-calligraphy.svg"
              alt=""
              draggable={false}
              className="relative h-full w-full select-none object-contain drop-shadow-[0_0_48px_rgba(201,164,74,0.12)]"
            />
          </div>
        </motion.div>

        {/* Soft vignette for depth */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.72) 100%)",
          }}
        />

        {/* Ambient UI orbs */}
        <AmbientOrb
          progress={scrollYProgress}
          reduce={reduce}
          className="left-[8%] top-[20%] z-[1] h-24 w-24 md:left-[10%] md:top-[22%] md:h-32 md:w-32"
          range={[0.05, 0.18, 0.35, 0.48]}
          drift={[40, -30]}
        />
        <AmbientOrb
          progress={scrollYProgress}
          reduce={reduce}
          className="right-[9%] top-[22%] z-[1] h-16 w-16 md:right-[12%] md:top-[24%] md:h-24 md:w-24"
          range={[0.28, 0.4, 0.55, 0.68]}
          drift={[30, -40]}
        />
        <AmbientOrb
          progress={scrollYProgress}
          reduce={reduce}
          className="bottom-[16%] left-[14%] z-[1] h-20 w-20 md:bottom-[18%] md:left-[16%] md:h-28 md:w-28"
          range={[0.52, 0.64, 0.78, 0.9]}
          drift={[50, -20]}
        />

        {/* Floating reveal cards */}
        {cards.map((card) => (
          <FloatingCard
            key={card.id}
            card={card}
            progress={scrollYProgress}
            reduce={reduce}
          />
        ))}

        {/* Pinned center typography */}
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-10 py-16 text-center md:px-16 md:py-24">
          <motion.p
            style={{ opacity: subOpacity, y: subY }}
            className="mb-10 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.48em] text-white/40 md:mb-12 md:tracking-[0.56em]"
          >
            <Sparkles className="h-3 w-3 text-white/50" strokeWidth={1.5} aria-hidden />
            {site.shortName} · Est. {site.established}
          </motion.p>

          <motion.h2
            style={{ opacity: titleOpacity, y: titleY, scale: titleScale }}
            className="bg-gradient-to-b from-white to-white/40 bg-clip-text font-display text-[clamp(3.25rem,11vw,8.5rem)] font-bold leading-[0.86] tracking-[-0.055em] text-transparent"
          >
            Faith that
            <br />
            feels like home.
          </motion.h2>

          <motion.p
            style={{ opacity: subOpacity, y: subY }}
            className="mt-12 max-w-sm text-sm leading-relaxed tracking-[0.08em] text-white/40 md:mt-14 md:max-w-md md:text-base md:tracking-[0.12em]"
          >
            Scroll — and the room fills with light, service, and the Friday table.
          </motion.p>
        </div>

        {/* Scroll progress hairline */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-12 left-1/2 z-10 h-px w-[min(12rem,40vw)] -translate-x-1/2 overflow-hidden rounded-full bg-white/10 md:bottom-16"
        >
          <motion.div
            style={{ width: progressWidth }}
            className="h-full bg-gradient-to-r from-white/0 via-white/70 to-white/20"
          />
        </div>
      </div>
    </section>
  );
}
