"use client";

import {
  useRef,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { HeartHandshake, Leaf, Users } from "lucide-react";
import { site } from "@/lib/site";

type GalleryCard = {
  id: string;
  title: string;
  caption: string;
  src: string;
  alt: string;
  offset: string;
};

const gallery: GalleryCard[] = [
  {
    id: "prayer",
    title: "The prayer hall",
    caption: "Light before the adhan",
    src: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80",
    alt: "Interior of a mosque prayer hall with soft natural light",
    offset: "md:translate-y-6",
  },
  {
    id: "gather",
    title: "Friday gathering",
    caption: "Neighbors become family",
    src: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80",
    alt: "Community gathering outside a place of worship",
    offset: "md:-translate-y-4",
  },
  {
    id: "table",
    title: "The open table",
    caption: "Halimah's Pantry & meals",
    src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
    alt: "Hands sharing food at a community table",
    offset: "md:translate-y-10",
  },
];

function TiltGlassCard({
  card,
  reduce,
}: {
  card: GalleryCard;
  reduce: boolean | null;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springX = useSpring(rawX, { stiffness: 220, damping: 22, mass: 0.55 });
  const springY = useSpring(rawY, { stiffness: 220, damping: 22, mass: 0.55 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [11, -11]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-14, 14]);
  const glareX = useTransform(springX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(springY, [-0.5, 0.5], [0, 100]);
  const glareBackground = useMotionTemplate`radial-gradient(420px circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.22), transparent 55%)`;

  const onMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (reduce || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    rawX.set((event.clientX - rect.left) / rect.width - 0.5);
    rawY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const onLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: reduce ? 0 : rotateX,
        rotateY: reduce ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`group relative ${card.offset}`}
    >
      <div
        className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-black/40 backdrop-blur-xl transition-shadow duration-500 ease-out group-hover:shadow-black/55"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.35), 0 28px 60px rgba(0,0,0,0.45)",
          transform: "translateZ(0)",
        }}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem]">
          <Image
            src={card.src}
            alt={card.alt}
            fill
            sizes="(max-width: 768px) 85vw, 28vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
          <motion.div
            aria-hidden
            style={{ background: glareBackground }}
            className="pointer-events-none absolute inset-0 mix-blend-soft-light opacity-80"
          />
          <div
            className="absolute inset-x-0 bottom-0 p-5"
            style={{ transform: "translateZ(28px)" }}
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.38em] text-white/45">
              {card.caption}
            </p>
            <h3 className="mt-2 font-display text-2xl tracking-[-0.03em] text-white/95">
              {card.title}
            </h3>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SoftStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-gold text-pine-deep shadow-2xl shadow-black/20">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-white/40">{label}</p>
        <p className="font-display text-lg leading-tight tracking-[-0.02em] text-white/90">
          {value}
        </p>
      </div>
    </div>
  );
}

/**
 * Premium home hero — layered parallax calligraphy + mouse-tilt glass cards.
 */
export function WarmArrivalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Background moves slowest; foreground text moves farther (faster relative parallax).
  const calligraphyY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["-8%", "14%"],
  );
  const calligraphyScale = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [1, 1] : [1.05, 1.18],
  );
  const textY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["12%", "-18%"],
  );
  const cardsY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["8%", "-10%"],
  );
  const fadeIn = useTransform(
    scrollYProgress,
    [0.05, 0.22, 0.78, 0.95],
    reduce ? [1, 1, 1, 1] : [0.35, 1, 1, 0.55],
  );

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative isolate min-h-[140svh] overflow-hidden px-5 py-28 md:px-10 md:py-36"
      style={{ perspective: "1400px" }}
    >
      {/* Atmosphere base */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[#070604]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 28%, rgba(201,164,74,0.12), transparent 52%), radial-gradient(ellipse at 80% 80%, rgba(255,255,255,0.04), transparent 40%)",
        }}
      />

      {/* Layer 1 — slow calligraphy watermark */}
      <motion.div
        aria-hidden
        style={{ y: calligraphyY, scale: calligraphyScale }}
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-10"
      >
        <div className="relative h-[min(140vmin,64rem)] w-[min(140vmin,64rem)]">
          <div
            className="absolute inset-[18%] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle at center, rgba(201,164,74,0.28), transparent 70%)",
            }}
          />
          <Image
            src="/arabic-calligraphy.svg"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 140vw, 90vw"
            className="object-contain"
          />
        </div>
      </motion.div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-16 md:gap-24">
        {/* Layer 2 — faster foreground copy */}
        <motion.div
          style={{ y: textY, opacity: fadeIn }}
          className="relative mx-auto max-w-4xl text-center md:mx-0 md:max-w-3xl md:text-left"
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.48em] text-gold-soft/80 md:tracking-[0.56em]">
            Greensboro · Est. {site.established}
          </p>

          <h1 className="mt-8 bg-gradient-to-b from-white via-white to-white/35 bg-clip-text font-display text-[clamp(2.75rem,9vw,6.75rem)] font-bold leading-[0.88] tracking-[-0.055em] text-transparent">
            A masjid that feels warm before you arrive.
          </h1>

          <p className="mt-8 max-w-md text-base leading-relaxed tracking-[0.04em] text-white/45 md:mt-10 md:text-lg md:tracking-[0.06em]">
            Scroll, and the light fills — the way Friday fills this room.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <a
              href="#jumah"
              className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-pine-deep shadow-2xl shadow-black/30 transition-transform duration-500 ease-out hover:scale-[1.02]"
            >
              Friday · {site.jumah.time}
            </a>
            <a
              href="#outreach"
              className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-white/80 backdrop-blur-xl transition-colors duration-500 ease-out hover:border-white/20 hover:bg-white/[0.06]"
            >
              Halimah&apos;s Pantry
            </a>
          </div>

          <p className="mt-8 text-sm tracking-wide text-white/35">{site.address.full}</p>

          <div className="mt-12 grid max-w-xl gap-3 sm:grid-cols-3 sm:max-w-none">
            <SoftStat icon={<Users size={16} />} label="Masjid" value="Open to visitors" />
            <SoftStat
              icon={<HeartHandshake size={16} />}
              label="Pantry"
              value="Food, clothing, care"
            />
            <SoftStat icon={<Leaf size={16} />} label="Seniors" value="Meals, five days a week" />
          </div>
        </motion.div>

        {/* Layer 3 — interactive 3D glass image cards */}
        <motion.div
          style={{ y: cardsY, opacity: fadeIn }}
          className="relative"
        >
          <div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
            style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
          >
            {gallery.map((card) => (
              <TiltGlassCard key={card.id} card={card} reduce={reduce} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
