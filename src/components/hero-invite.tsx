"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, type MouseEvent as ReactMouseEvent } from "react";
import { media, type MediaSlot } from "@/lib/media";
import { site } from "@/lib/site";

export type HeroInviteProps = {
  /** Optional override — defaults to site.jumah.time */
  nextJumah?: string;
};

const showcase: Array<{
  slot: MediaSlot;
  eyebrow: string;
  caption: string;
  href: string;
}> = [
  {
    slot: media.jumah,
    eyebrow: "Jumu'ah",
    caption: "Doors open every Friday",
    href: "/jumah",
  },
  {
    slot: media.pantry,
    eyebrow: "Halimah's Pantry",
    caption: "Neighbors fed with dignity",
    href: "/#outreach",
  },
  {
    slot: media.gathering,
    eyebrow: "Community",
    caption: "Warmth on Bessemer Ave.",
    href: "/#about",
  },
];

const mapsHref = `https://www.google.com/maps/search/?api=1&query=${site.mapsQuery}`;

/** Apple Keynote product-reveal hero — 3-layer depth + glass ops bar. */
export function HeroInvite({ nextJumah }: HeroInviteProps) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const calligraphyRotate = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 18]);
  const calligraphyScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12]);
  const calligraphyOpacity = useTransform(scrollYProgress, [0, 0.85], [0.22, 0.06]);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const onDark = Boolean(entry?.isIntersecting && (entry.intersectionRatio ?? 0) > 0.35);
        document.body.setAttribute("data-on-dark", onDark ? "true" : "false");
      },
      { threshold: [0.2, 0.35, 0.55] },
    );
    io.observe(node);
    document.body.setAttribute("data-on-dark", "true");
    return () => {
      io.disconnect();
      document.body.removeAttribute("data-on-dark");
    };
  }, []);

  const jumahTime = nextJumah?.trim() || site.jumah.time;

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
      style={{ backgroundColor: "#070b09" }}
      aria-label="Welcome"
    >
      {/* Layer 0 — Ambient architecture & calligraphy */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 55% at 18% 22%, rgba(201,164,74,0.18), transparent 58%),
              radial-gradient(ellipse 65% 50% at 82% 68%, rgba(22,68,52,0.42), transparent 55%),
              radial-gradient(ellipse 90% 70% at 50% 110%, rgba(7,11,9,0.95), transparent 50%),
              #070b09
            `,
          }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2"
          style={{
            width: "min(130vmin, 64rem)",
            height: "min(130vmin, 64rem)",
            x: "-50%",
            y: "-50%",
            rotate: calligraphyRotate,
            scale: calligraphyScale,
            opacity: calligraphyOpacity,
          }}
        >
          <div
            className="absolute inset-[-8%] rounded-full opacity-70 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(201,164,74,0.28) 0%, rgba(201,164,74,0.08) 38%, transparent 68%)",
            }}
          />
          <Image
            src="/arabic-calligraphy.svg"
            alt=""
            fill
            sizes="min(130vmin, 64rem)"
            className="object-contain opacity-90"
            priority
          />
        </motion.div>
      </div>

      {/* Layer 2 typography + Layer 1 showcase */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-10 px-5 pb-40 pt-28 md:px-8 md:pb-44 lg:flex-row lg:items-center lg:gap-14 lg:pt-32">
        <motion.div
          className="max-w-xl shrink-0 lg:max-w-[26rem] xl:max-w-xl"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-ivory/70 md:text-xs">
            Greensboro · Est. {site.established} · {site.address.street}
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.65rem,6.5vw,4.75rem)] font-semibold leading-[0.92] tracking-[-0.04em] bg-gradient-to-b from-white via-[#fff8e7] to-[#c9a44a]/70 bg-clip-text text-transparent">
            A masjid that feels warm before you arrive.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ivory/65 md:text-lg">
            English khutbah every Friday at {site.jumah.time}. Visitors welcome on Bessemer.
          </p>
        </motion.div>

        <motion.div
          className="w-full min-w-0 flex-1"
          initial={reduce ? false : { opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <ShowcaseDeck reduce={Boolean(reduce)} />
        </motion.div>
      </div>

      {/* Business Clarity Floating Glass Command Bar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-4 pb-5 md:px-8 md:pb-8">
        <motion.div
          className="pointer-events-auto mx-auto w-full max-w-7xl rounded-2xl border border-white/15 bg-white/[0.04] p-4 shadow-2xl backdrop-blur-2xl"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid gap-4 lg:grid-cols-[1.15fr_1.15fr_1fr_auto] lg:items-center">
            <Link
              href="/jumah"
              className="group flex items-start gap-3 rounded-xl border border-transparent px-2 py-1.5 transition-colors hover:border-white/10 hover:bg-white/[0.03]"
            >
              <span className="relative mt-1.5 flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gradient-to-br from-emerald-400 to-[#c9a44a] shadow-[0_0_12px_rgba(52,211,153,0.55)]" />
              </span>
              <span>
                <span className="block text-[10px] uppercase tracking-[0.22em] text-ivory/50">
                  Next Jumu&apos;ah
                </span>
                <span className="mt-1 block text-sm text-ivory group-hover:text-gold-soft">
                  Friday · {jumahTime}
                </span>
              </span>
            </Link>

            <div className="px-2 py-1.5">
              <p className="text-[10px] uppercase tracking-[0.22em] text-ivory/50">
                Location &amp; Directions
              </p>
              <p className="mt-1 text-sm text-ivory">{site.address.street}</p>
              <a
                href={mapsHref}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex text-xs font-medium text-gold-soft underline decoration-gold/40 underline-offset-4 hover:decoration-gold"
              >
                Get Directions
              </a>
            </div>

            <Link
              href="/#outreach"
              className="rounded-xl border border-transparent px-2 py-1.5 transition-colors hover:border-white/10 hover:bg-white/[0.03]"
            >
              <p className="text-[10px] uppercase tracking-[0.22em] text-ivory/50">
                Community Care
              </p>
              <p className="mt-1 text-sm text-ivory">
                {site.programs.pantry.name} · {site.programs.pantry.hoursShort}
              </p>
            </Link>

            <div className="flex flex-wrap items-center gap-2 px-1 lg:justify-end">
              <Link
                href="/donate"
                className="rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-pine-deep shadow-[0_0_28px_rgba(201,164,74,0.45)] transition-transform duration-300 hover:scale-[1.03]"
              >
                Donate
              </Link>
              <Link
                href="/jumah"
                className="rounded-full border border-gold/45 bg-gold/10 px-5 py-2.5 text-sm font-medium text-gold-soft shadow-[0_0_20px_rgba(201,164,74,0.18)] transition-colors hover:border-gold/70 hover:bg-gold/15"
              >
                Visit This Friday
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ShowcaseDeck({ reduce }: { reduce: boolean }) {
  const deckRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 160, damping: 22, mass: 0.4 });
  const springY = useSpring(my, { stiffness: 160, damping: 22, mass: 0.4 });
  const rotateX = useTransform(springY, [-0.5, 0.5], reduce ? [0, 0] : [10, -10]);
  const rotateY = useTransform(springX, [-0.5, 0.5], reduce ? [0, 0] : [-10, 10]);

  const onMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    mx.set(Math.max(-0.5, Math.min(0.5, px)));
    my.set(Math.max(-0.5, Math.min(0.5, py)));
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      ref={deckRef}
      className="[perspective:1200px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-3 md:gap-4"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {showcase.map((card, index) => (
          <ShowcaseCard
            key={card.eyebrow}
            card={card}
            index={index}
            glareX={springX}
            glareY={springY}
            reduce={reduce}
          />
        ))}
      </motion.div>
    </div>
  );
}

function ShowcaseCard({
  card,
  index,
  glareX,
  glareY,
  reduce,
}: {
  card: (typeof showcase)[number];
  index: number;
  glareX: MotionValue<number>;
  glareY: MotionValue<number>;
  reduce: boolean;
}) {
  const glarePosX = useTransform(glareX, [-0.5, 0.5], ["10%", "90%"]);
  const glarePosY = useTransform(glareY, [-0.5, 0.5], ["15%", "85%"]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glarePosX} ${glarePosY}, rgba(255,248,231,0.28) 0%, transparent 55%)`;

  return (
    <Link
      href={card.href}
      className="group relative block aspect-[4/5] min-h-[20rem] overflow-hidden rounded-2xl border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
      style={{
        transform: reduce
          ? undefined
          : `translateZ(${18 + index * 6}px) rotateZ(${(index - 1) * 1.4}deg)`,
        background:
          "linear-gradient(145deg, rgba(201,164,74,0.16), rgba(22,68,52,0.35) 45%, #0a1210)",
      }}
    >
      <Image
        src={card.slot.src}
        alt={card.slot.alt}
        fill
        sizes="(max-width: 640px) 100vw, 28vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        priority={index === 0}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[#070b09]/95 via-[#070b09]/25 to-transparent"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={{ backgroundImage: glare, opacity: reduce ? 0 : 1 }}
      />
      <div
        className="absolute inset-x-0 bottom-0 p-4"
        style={{ transform: "translateZ(30px)" }}
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-soft/90">
          {card.eyebrow}
        </p>
        <p className="mt-1.5 font-display text-xl leading-tight tracking-[-0.02em] text-ivory md:text-2xl">
          {card.caption}
        </p>
      </div>
    </Link>
  );
}
