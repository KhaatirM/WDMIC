"use client";

import {
  useEffect,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { Car, MapPin, Mic2, Users, Video } from "lucide-react";
import { site } from "@/lib/site";

export type JumahBentoProps = {
  time: string;
  language: string;
  imam: string;
  khutbahTitle?: string | null;
  zoomUrl?: string | null;
  notes?: string | null;
  serviceLabel?: string | null;
};

const spring = { type: "spring" as const, stiffness: 260, damping: 22, mass: 0.55 };

function FlashlightCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowOpacity = useSpring(0, { stiffness: 180, damping: 28 });
  const lift = useSpring(0, { stiffness: 280, damping: 24, mass: 0.5 });
  const scale = useSpring(1, { stiffness: 280, damping: 24, mass: 0.5 });

  const glow = useMotionTemplate`radial-gradient(380px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.18), rgba(201,164,74,0.1) 32%, transparent 62%)`;
  const edgeGlow = useMotionTemplate`radial-gradient(280px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.55), rgba(201,164,74,0.25) 28%, transparent 55%)`;

  const onMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  };

  const onEnter = () => {
    if (reduce) return;
    glowOpacity.set(1);
    lift.set(-7);
    scale.set(1.015);
  };

  const onLeave = () => {
    glowOpacity.set(0);
    lift.set(0);
    scale.set(1);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ y: reduce ? 0 : lift, scale: reduce ? 1 : scale }}
      className={`group relative isolate overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/5 backdrop-blur-xl ${className}`}
    >
      {/* Soft floating depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[1.75rem]"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.45), 0 28px 70px rgba(0,0,0,0.55)",
        }}
      />

      {/* Flashlight fill */}
      {!reduce ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: glow, opacity: glowOpacity }}
        />
      ) : null}

      {/* Border edge reveal — glow clipped to the rim */}
      {!reduce ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[1.75rem] p-px"
          style={{ opacity: glowOpacity }}
        >
          <div
            className="h-full w-full rounded-[calc(1.75rem-1px)]"
            style={{
              background: "transparent",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
            }}
          />
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[1.75rem] opacity-80 mix-blend-screen"
            style={{ background: edgeGlow }}
          />
        </motion.div>
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
    <div className="mb-6 grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20 backdrop-blur-xl">
      {children}
    </div>
  );
}

/**
 * Friday congregation — asymmetric glass bento with physics hover + flashlight.
 */
export function JumahBento({
  time,
  language,
  imam,
  khutbahTitle,
  zoomUrl,
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
      {/* Atmosphere — not flat black */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 0%, rgba(201,164,74,0.1), transparent 42%), radial-gradient(ellipse at 90% 40%, rgba(255,255,255,0.035), transparent 36%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-28 pt-4 md:px-10 md:pb-36">
        <div className="grid auto-rows-[minmax(12rem,auto)] grid-cols-1 gap-5 md:grid-cols-6 md:gap-6 lg:grid-cols-12 lg:gap-7">
          {/* Hero time */}
          <FlashlightCard className="min-h-[20rem] p-8 md:col-span-6 md:p-10 lg:col-span-7 lg:row-span-2 lg:min-h-[30rem] lg:p-12">
            <div className="flex h-full flex-col justify-between gap-12">
              <div>
                <Label>First Khutbah</Label>
                <p className="mt-10 font-display text-[clamp(4.75rem,15vw,9.5rem)] font-bold leading-[0.78] tracking-[-0.07em]">
                  <span className="bg-gradient-to-b from-white via-white to-white/30 bg-clip-text text-transparent">
                    {timeDisplay}
                  </span>
                </p>
                <p className="mt-5 text-[11px] uppercase tracking-[0.4em] text-white/35">
                  EST · {language}
                </p>
              </div>
              <div className="flex flex-wrap items-end justify-between gap-5 border-t border-white/10 pt-7">
                <p className="max-w-sm text-sm leading-relaxed tracking-[0.04em] text-white/50">
                  English khutbah. Visitors welcome — arrive a few minutes early for seating.
                </p>
                {serviceLabel ? (
                  <p className="text-[10px] uppercase tracking-[0.42em] text-white/45">
                    {serviceLabel}
                  </p>
                ) : null}
              </div>
            </div>
          </FlashlightCard>

          {/* Theme */}
          <FlashlightCard className="min-h-[15rem] p-8 md:col-span-6 lg:col-span-5">
            <div className="flex h-full flex-col justify-between gap-10">
              <div>
                <Label>This Week&apos;s Khutbah</Label>
                <h2 className="mt-6 bg-gradient-to-b from-white to-white/45 bg-clip-text font-display text-3xl font-bold leading-[0.94] tracking-[-0.04em] text-transparent md:text-[2.65rem]">
                  {khutbahTitle ?? "English khutbah · theme announced Friday"}
                </h2>
              </div>
              <div className="flex items-center gap-3 border-t border-white/10 pt-5 text-white/45">
                <Mic2 className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden />
                <p className="text-sm tracking-[0.04em]">{imam}</p>
              </div>
            </div>
          </FlashlightCard>

          {/* Location */}
          <FlashlightCard className="min-h-[14rem] p-8 md:col-span-3 lg:col-span-5">
            <div className="flex h-full flex-col justify-between gap-8">
              <div>
                <IconWell>
                  <MapPin className="h-4 w-4 text-white/70" strokeWidth={1.5} aria-hidden />
                </IconWell>
                <Label>Location</Label>
                <p className="mt-5 font-display text-3xl font-bold leading-[0.95] tracking-[-0.04em] text-white">
                  {site.address.street}
                </p>
                <p className="mt-3 text-sm tracking-[0.05em] text-white/40">
                  {site.address.city}, {site.address.state} {site.address.zip}
                </p>
              </div>
              <motion.a
                href={mapsHref}
                target="_blank"
                rel="noreferrer"
                whileHover={reduce ? undefined : { x: 4 }}
                transition={spring}
                className="inline-flex text-[10px] uppercase tracking-[0.42em] text-white/55 hover:text-white"
              >
                Open in Maps →
              </motion.a>
            </div>
          </FlashlightCard>

          {/* Parking */}
          <FlashlightCard className="min-h-[14rem] p-8 md:col-span-3 lg:col-span-4">
            <div className="flex h-full flex-col justify-between gap-6">
              <div>
                <IconWell>
                  <Car className="h-4 w-4 text-white/70" strokeWidth={1.5} aria-hidden />
                </IconWell>
                <Label>Parking</Label>
                <p className="mt-5 font-display text-3xl font-bold leading-[0.95] tracking-[-0.04em] text-white">
                  Lot on Bessemer
                </p>
                <p className="mt-4 text-sm leading-relaxed tracking-[0.04em] text-white/40">
                  Street parking along E. Bessemer Ave. Overflow on side streets — keep the driveway clear for accessibility.
                </p>
              </div>
            </div>
          </FlashlightCard>

          {/* Visitors */}
          <FlashlightCard className="min-h-[14rem] p-8 md:col-span-3 lg:col-span-3">
            <div className="flex h-full flex-col justify-between gap-6">
              <div>
                <IconWell>
                  <Users className="h-4 w-4 text-white/70" strokeWidth={1.5} aria-hidden />
                </IconWell>
                <Label>Visitors</Label>
                <p className="mt-5 font-display text-3xl font-bold leading-[0.95] tracking-[-0.04em] text-white">
                  Welcome
                </p>
                <p className="mt-4 text-sm leading-relaxed tracking-[0.04em] text-white/40">
                  Modest dress appreciated. Sisters&apos; and brothers&apos; spaces marked inside.
                </p>
              </div>
            </div>
          </FlashlightCard>

          {/* Zoom */}
          <FlashlightCard className="min-h-[13rem] p-8 md:col-span-3 lg:col-span-5">
            <div className="flex h-full flex-col justify-between gap-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <Label>Remote Option</Label>
                  <p className="mt-5 font-display text-3xl font-bold leading-[0.95] tracking-[-0.04em] text-white">
                    {zoomUrl ? "Join by Zoom" : "In person preferred"}
                  </p>
                  <p className="mt-4 max-w-md text-sm leading-relaxed tracking-[0.04em] text-white/40">
                    {notes ??
                      "When available, a Zoom link is posted for those who cannot attend in person."}
                  </p>
                </div>
                <IconWell>
                  <Video className="h-4 w-4 text-white/70" strokeWidth={1.5} aria-hidden />
                </IconWell>
              </div>
              {zoomUrl ? (
                <motion.a
                  href={zoomUrl}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={reduce ? undefined : { scale: 1.03, y: -2 }}
                  transition={spring}
                  className="inline-flex w-fit rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-[10px] uppercase tracking-[0.4em] text-white/85 shadow-2xl shadow-black/20 backdrop-blur-xl"
                >
                  Open Zoom →
                </motion.a>
              ) : null}
            </div>
          </FlashlightCard>

          {/* Contact */}
          <FlashlightCard className="min-h-[11rem] p-8 md:col-span-6 lg:col-span-7">
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
