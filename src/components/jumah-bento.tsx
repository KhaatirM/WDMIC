"use client";

import {
  useEffect,
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
  useSpring,
} from "framer-motion";
import {
  Car,
  Check,
  Clock3,
  DoorOpen,
  MapPin,
  Mic2,
  Video,
} from "lucide-react";
import { media } from "@/lib/media";
import { site } from "@/lib/site";

export type JumahBentoProps = {
  time: string;
  language: string;
  imam: string;
  khutbahTitle?: string | null;
  /** YouTube live-stream URL; defaults to site.jumah.streamUrl */
  streamUrl?: string | null;
  notes?: string | null;
  serviceLabel?: string | null;
};

const spring = { type: "spring" as const, stiffness: 260, damping: 22, mass: 0.55 };

const visitorChecklist = [
  "Doors open around 1:00 PM — arrive a few minutes early for seating",
  "English khutbah begins at 1:30 PM EST",
  "Modest dress appreciated; sisters' and brothers' spaces are marked inside",
  "Visitors are welcome — ask anyone in the lobby if you need a seat",
];

const arrivalTimeline = [
  { time: "1:00 PM", label: "Doors open", detail: "Bessemer entrance · seating available" },
  { time: "1:30 PM", label: "Khutbah", detail: "English sermon begins" },
  { time: "After", label: "Iqamah & Salah", detail: "Congregation prayer follows the khutbah" },
];

function GeometricAccent({ variant = "a" }: { variant?: "a" | "b" | "c" }) {
  if (variant === "b") {
    return (
      <svg
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-10 h-56 w-56 opacity-[0.14]"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="78" stroke="rgba(201,164,74,0.55)" strokeWidth="1" />
        <circle cx="100" cy="100" r="52" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <path
          d="M100 22 L178 100 L100 178 L22 100 Z"
          stroke="rgba(230,211,154,0.4)"
          strokeWidth="1"
        />
      </svg>
    );
  }
  if (variant === "c") {
    return (
      <svg
        aria-hidden
        className="pointer-events-none absolute -bottom-6 left-1/2 h-40 w-[120%] -translate-x-1/2 opacity-[0.12]"
        viewBox="0 0 400 120"
        fill="none"
      >
        <path
          d="M0 80 Q100 20 200 80 T400 80"
          stroke="rgba(201,164,74,0.7)"
          strokeWidth="1.25"
        />
        <path
          d="M0 95 Q100 45 200 95 T400 95"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1"
        />
      </svg>
    );
  }
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute -right-4 top-6 h-48 w-48 opacity-[0.12]"
      viewBox="0 0 180 180"
      fill="none"
    >
      <path
        d="M90 8 L162 49 V131 L90 172 L18 131 V49 Z"
        stroke="rgba(201,164,74,0.65)"
        strokeWidth="1.2"
      />
      <path
        d="M90 38 L132 62 V110 L90 134 L48 110 V62 Z"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1"
      />
    </svg>
  );
}

function FlashlightCard({
  children,
  className = "",
  accent = "a",
  photo,
}: {
  children: ReactNode;
  className?: string;
  accent?: "a" | "b" | "c" | "none";
  photo?: { src: string; alt: string; opacity?: number };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowOpacity = useSpring(0, { stiffness: 180, damping: 28 });

  const glow = useMotionTemplate`radial-gradient(420px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.16), rgba(201,164,74,0.12) 34%, transparent 64%)`;
  const edgeGlow = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.65), rgba(201,164,74,0.35) 30%, transparent 58%)`;

  const onMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  };

  const onEnter = () => {
    if (reduce) return;
    glowOpacity.set(1);
  };

  const onLeave = () => {
    glowOpacity.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`group relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] shadow-2xl shadow-black/40 backdrop-blur-2xl ${className}`}
    >
      {photo ? (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <Image
            src={photo.src}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            style={{ opacity: photo.opacity ?? 0.18 }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/70 to-black/85" />
        </div>
      ) : null}

      {accent !== "none" ? <GeometricAccent variant={accent} /> : null}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[2rem]"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.45), 0 28px 70px rgba(0,0,0,0.45)",
        }}
      />

      {!reduce ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: glow, opacity: glowOpacity }}
        />
      ) : null}

      {!reduce ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-90 mix-blend-screen"
          style={{ background: edgeGlow, opacity: glowOpacity }}
        />
      ) : null}

      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] font-medium uppercase tracking-[0.48em] text-white/40 md:tracking-[0.56em]">
      {children}
    </p>
  );
}

function IconWell({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] shadow-2xl shadow-black/20 backdrop-blur-xl">
      {children}
    </div>
  );
}

/**
 * Friday congregation — asymmetric Pro Spec glass bento with cursor-reactive lighting.
 */
export function JumahBento({
  time,
  language,
  imam,
  khutbahTitle,
  streamUrl,
  notes,
  serviceLabel,
}: JumahBentoProps) {
  const reduce = useReducedMotion();

  useEffect(() => {
    document.body.dataset.onDark = "true";
    document.body.dataset.scene = "jumah";
    document.body.style.backgroundColor = "#000";
    return () => {
      delete document.body.dataset.onDark;
      delete document.body.dataset.scene;
      document.body.style.backgroundColor = "";
    };
  }, []);

  const timeDisplay = time.replace(/\s*EST\s*$/i, "").trim();
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${site.mapsQuery}`;

  return (
    <div className="relative isolate overflow-hidden bg-black">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 28% 0%, rgba(201,164,74,0.12), transparent 42%), radial-gradient(ellipse at 88% 36%, rgba(255,255,255,0.04), transparent 36%), radial-gradient(ellipse at 50% 100%, rgba(13,59,46,0.35), transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-28 pt-4 md:px-10 md:pb-36">
        <div className="grid auto-rows-[minmax(12rem,auto)] grid-cols-1 gap-5 md:grid-cols-6 md:gap-6 lg:grid-cols-12 lg:gap-7">
          {/* Hero Time Cell */}
          <FlashlightCard
            className="min-h-[28rem] p-8 md:col-span-6 md:p-10 lg:col-span-7 lg:min-h-[34rem] lg:p-12"
            accent="a"
            photo={{ src: media.hero.src, alt: media.hero.alt, opacity: 0.14 }}
          >
            <div className="flex h-full flex-col justify-between gap-10">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Label>First Khutbah</Label>
                  {serviceLabel ? (
                    <p className="text-[10px] uppercase tracking-[0.42em] text-gold-soft/70">
                      {serviceLabel}
                    </p>
                  ) : null}
                </div>
                <p className="mt-8 font-display text-[clamp(4.5rem,14vw,9rem)] font-bold leading-[0.78] tracking-[-0.07em]">
                  <span className="bg-gradient-to-b from-white via-white to-white/30 bg-clip-text text-transparent">
                    {timeDisplay}
                  </span>
                </p>
                <p className="mt-4 text-[11px] uppercase tracking-[0.4em] text-white/35">
                  EST · {language}
                </p>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <Label>This Week&apos;s Khutbah</Label>
                  <h2 className="mt-4 max-w-xl bg-gradient-to-b from-white to-white/50 bg-clip-text font-display text-2xl font-bold leading-[1.05] tracking-[-0.035em] text-transparent md:text-3xl">
                    {khutbahTitle ?? "English khutbah · theme announced Friday"}
                  </h2>
                  <div className="mt-4 flex items-center gap-3 text-white/50">
                    <Mic2 className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden />
                    <p className="text-sm tracking-[0.04em]">{imam}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl md:p-6">
                <Label>What to Expect for First-Time Visitors</Label>
                <ul className="mt-4 space-y-3">
                  {visitorChecklist.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-white/55">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/10">
                        <Check className="h-3 w-3 text-gold-soft" strokeWidth={2.5} aria-hidden />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FlashlightCard>

          {/* Architectural Visual Cell */}
          <FlashlightCard
            className="min-h-[22rem] p-3 md:col-span-6 lg:col-span-5 lg:min-h-[34rem]"
            accent="none"
          >
            <div className="relative flex h-full min-h-[22rem] flex-col overflow-hidden rounded-[1.65rem] border border-white/10 bg-gradient-to-br from-pine-deep via-[#0a1612] to-black">
              <div className="relative min-h-[14rem] flex-1 overflow-hidden">
                <Image
                  src={media.jumah.src}
                  alt={media.jumah.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  priority
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(7,25,18,0.15) 0%, transparent 35%, rgba(7,11,9,0.55) 70%, rgba(7,11,9,0.92) 100%), radial-gradient(ellipse at 50% 20%, rgba(201,164,74,0.22), transparent 55%)",
                  }}
                />
              </div>
              <div className="relative z-10 space-y-3 p-6 md:p-7">
                <Label>Prayer Hall · Welcome</Label>
                <p className="font-display text-2xl font-bold leading-[1.05] tracking-[-0.03em] text-white md:text-[1.85rem]">
                  Dress &amp; etiquette
                </p>
                <p className="max-w-sm text-sm leading-relaxed tracking-[0.03em] text-white/50">
                  Modest attire is appreciated. Sisters&apos; and brothers&apos; areas are clearly
                  marked — come as you are; we&apos;ll help you find a place.
                </p>
              </div>
            </div>
          </FlashlightCard>

          {/* Arrival, Parking & Bessemer Entrance */}
          <FlashlightCard
            className="min-h-[22rem] p-8 md:col-span-6 md:p-9 lg:col-span-6"
            accent="b"
          >
            <div className="flex h-full flex-col justify-between gap-8">
              <div>
                <IconWell>
                  <DoorOpen className="h-4 w-4 text-white/70" strokeWidth={1.5} aria-hidden />
                </IconWell>
                <Label>Arrival · Parking · Bessemer Entrance</Label>
                <p className="mt-5 font-display text-3xl font-bold leading-[0.95] tracking-[-0.04em] text-white md:text-4xl">
                  How to arrive
                </p>

                <ol className="mt-8 space-y-4">
                  {arrivalTimeline.map((step) => (
                    <li
                      key={step.time}
                      className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-white/8 pb-4 last:border-0 last:pb-0"
                    >
                      <span className="flex items-start gap-2 text-[11px] uppercase tracking-[0.28em] text-gold-soft/80">
                        <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
                        {step.time}
                      </span>
                      <span>
                        <span className="block text-sm font-medium tracking-[0.04em] text-white/85">
                          {step.label}
                        </span>
                        <span className="mt-1 block text-sm tracking-[0.03em] text-white/40">
                          {step.detail}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-start gap-3">
                  <Car className="mt-0.5 h-4 w-4 shrink-0 text-white/55" strokeWidth={1.5} aria-hidden />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.36em] text-white/40">Parking</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">
                      Lot and street parking at{" "}
                      <span className="text-white/85">{site.address.street}</span>,{" "}
                      {site.address.city}. Keep the driveway clear for accessibility.
                    </p>
                    <motion.a
                      href={mapsHref}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={reduce ? undefined : { x: 4 }}
                      transition={spring}
                      className="mt-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-white/55 hover:text-white"
                    >
                      <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                      Open in Maps →
                    </motion.a>
                  </div>
                </div>
              </div>
            </div>
          </FlashlightCard>

          {/* Remote / YouTube Live congregation */}
          <FlashlightCard
            className="min-h-[22rem] p-8 md:col-span-6 md:p-9 lg:col-span-6"
            accent="c"
            photo={{ src: media.gathering.src, alt: media.gathering.alt, opacity: 0.12 }}
          >
            <div className="flex h-full flex-col justify-between gap-8">
              <div>
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <Label>Remote Congregation</Label>
                    <p className="mt-5 font-display text-3xl font-bold leading-[0.95] tracking-[-0.04em] text-white md:text-4xl">
                      Watch live, right here
                    </p>
                  </div>
                  <IconWell>
                    <Video className="h-4 w-4 text-white/70" strokeWidth={1.5} aria-hidden />
                  </IconWell>
                </div>
                <p className="mt-5 max-w-md text-sm leading-relaxed tracking-[0.04em] text-white/45">
                  {notes ??
                    "Jumu'ah is live streamed for those who cannot attend in person — watch in the player above without leaving the site, or open the YouTube channel. Join us in the prayer hall when you can."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <motion.a
                  href="#live"
                  whileHover={reduce ? undefined : { scale: 1.03, y: -2 }}
                  transition={spring}
                  className="inline-flex rounded-full border border-gold/30 bg-gold px-6 py-3 text-[10px] font-medium uppercase tracking-[0.36em] text-pine-deep shadow-2xl shadow-black/30"
                >
                  Watch live above ↑
                </motion.a>
                <motion.a
                  href={streamUrl ?? site.jumah.streamUrl}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={reduce ? undefined : { x: 3 }}
                  transition={spring}
                  className="inline-flex text-[10px] uppercase tracking-[0.36em] text-white/55 hover:text-white"
                >
                  Open on YouTube →
                </motion.a>
                <motion.a
                  href={site.phoneHref}
                  whileHover={reduce ? undefined : { x: 3 }}
                  transition={spring}
                  className="inline-flex text-[10px] uppercase tracking-[0.36em] text-white/40 hover:text-white/70"
                >
                  Call {site.phone}
                </motion.a>
              </div>
            </div>
          </FlashlightCard>

          {/* Contact strip */}
          <FlashlightCard className="min-h-[11rem] p-8 md:col-span-6 lg:col-span-12" accent="a">
            <div className="flex h-full flex-col justify-between gap-8 sm:flex-row sm:items-end">
              <div>
                <Label>Questions</Label>
                <p className="mt-5 font-display text-3xl font-bold tracking-[-0.04em] text-white md:text-4xl">
                  The office can help
                </p>
                <p className="mt-3 text-sm tracking-[0.06em] text-white/40">{site.hours}</p>
              </div>
              <div className="flex flex-col gap-3 sm:items-end">
                <motion.a
                  href={site.phoneHref}
                  whileHover={reduce ? undefined : { x: -3 }}
                  transition={spring}
                  className="text-sm tracking-[0.06em] text-white/75 hover:text-white"
                >
                  {site.phone}
                </motion.a>
                <motion.a
                  href={`mailto:${site.emails.info}`}
                  whileHover={reduce ? undefined : { x: -3 }}
                  transition={spring}
                  className="text-sm tracking-[0.06em] text-white/45 hover:text-white/80"
                >
                  {site.emails.info}
                </motion.a>
              </div>
            </div>
          </FlashlightCard>
        </div>
      </div>
    </div>
  );
}
