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
};

const gallery: GalleryCard[] = [
  {
    id: "prayer",
    title: "The prayer hall",
    caption: "Light before the adhan",
    src: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80",
    alt: "Interior of a mosque prayer hall with soft natural light",
  },
  {
    id: "gather",
    title: "Friday gathering",
    caption: "Neighbors become family",
    src: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80",
    alt: "Community gathering outside a place of worship",
  },
  {
    id: "table",
    title: "The open table",
    caption: "Halimah's Pantry & meals",
    src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
    alt: "Hands sharing food at a community table",
  },
];

const springConfig = { stiffness: 150, damping: 18, mass: 0.4 };

function TiltGlassCard({
  card,
  reduce,
}: {
  card: GalleryCard;
  reduce: boolean | null;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Cursor normalized to [-0.5, 0.5] → rotate capped at ±15°
  const rotateX = useTransform(springY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-15, 15]);

  const glareX = useTransform(springX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(springY, [-0.5, 0.5], [0, 100]);
  const glareBackground = useMotionTemplate`radial-gradient(520px circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.28), transparent 52%)`;

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (reduce || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: reduce ? 0 : rotateX,
        rotateY: reduce ? 0 : rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      }}
      className="relative will-change-transform"
    >
      <div
        className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-black/5 backdrop-blur-xl"
        style={{
          transformStyle: "preserve-3d",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.4), 0 32px 80px rgba(0,0,0,0.55)",
        }}
      >
        <div
          className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem]"
          style={{ transform: "translateZ(24px)", transformStyle: "preserve-3d" }}
        >
          <Image
            src={card.src}
            alt={card.alt}
            fill
            sizes="(max-width: 768px) 85vw, 28vw"
            className="object-cover"
            style={{ transform: "translateZ(0)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <motion.div
            aria-hidden
            style={{ background: glareBackground }}
            className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          />
          <div
            className="absolute inset-x-0 bottom-0 p-6"
            style={{ transform: "translateZ(48px)" }}
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.42em] text-white/45">
              {card.caption}
            </p>
            <h3 className="mt-2 font-display text-2xl tracking-[-0.03em] text-white">
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
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 shadow-2xl shadow-black/5 backdrop-blur-xl">
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

export function WarmArrivalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Background calligraphy — independent, slower parallax track
  const calligraphyY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["-18%", "22%"],
  );

  // Foreground text — faster / opposite travel for depth
  const textY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["14%", "-22%"],
  );

  const cardsY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["10%", "-14%"],
  );

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-[140svh] overflow-hidden bg-black px-5 py-28 md:px-10 md:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 28%, rgba(201,164,74,0.12), transparent 52%), radial-gradient(ellipse at 80% 80%, rgba(255,255,255,0.04), transparent 40%)",
        }}
      />

      {/* Parallax calligraphy — absolute, behind content, scroll-tied */}
      <motion.div
        aria-hidden
        style={{ y: calligraphyY }}
        className="pointer-events-none absolute inset-0 z-[-1] flex items-center justify-center opacity-10"
      >
        <div className="relative h-[min(150vmin,70rem)] w-[min(150vmin,70rem)]">
          <div
            className="absolute inset-[16%] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle at center, rgba(201,164,74,0.3), transparent 70%)",
            }}
          />
          <Image
            src="/arabic-calligraphy.svg"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 150vw, 100vw"
            className="object-contain"
          />
        </div>
      </motion.div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-16 md:gap-24">
        <motion.div
          style={{ y: textY }}
          className="relative mx-auto max-w-4xl text-center md:mx-0 md:max-w-3xl md:text-left"
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.48em] text-white/40 md:tracking-[0.56em]">
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
              href="/jumah"
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

        {/* 3D card stage — perspective REQUIRED on the parent of tilting cards */}
        <motion.div style={{ y: cardsY }} className="relative">
          <div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
            style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
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
