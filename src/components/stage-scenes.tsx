"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Clock,
  Mail,
  MapPin,
  Megaphone,
  Navigation,
  Phone,
  Sprout,
  Video,
} from "lucide-react";
import { media, mediaFallback, type MediaSlot } from "@/lib/media";
import { site } from "@/lib/site";
import {
  aboutMilestones,
  journalFallback,
  journalSecondaryQuote,
  jumahClock,
  jumahSpecs,
  mapLinks,
  outreachMetrics,
  outreachPrograms,
  pullQuote,
  type SceneId,
} from "@/lib/story";

/* -------------------------------------------------------------------------- */
/*  Data contracts (serialisable — built on the server in page.tsx)            */
/* -------------------------------------------------------------------------- */

export type StageAnnouncement = {
  id: string;
  title: string;
  body: string;
  kind: "GENERAL" | "URGENT" | "PROGRAM";
  pinned: boolean;
  dateLabel: string;
};

export type StageEvent = {
  id: string;
  title: string;
  summary: string;
  location: string;
  category: string;
  dateLabel: string;
};

export type StageJumah = {
  khutbahTitle: string;
  imam: string;
  streamUrl: string;
  dateLabel: string;
};

export type StageJournal = {
  id: string;
  title: string;
  issueLabel: string;
  excerpt: string;
  readMinutes: number;
  dateLabel: string;
};

export type StageData = {
  announcements: StageAnnouncement[];
  events: StageEvent[];
  jumah: StageJumah | null;
  journal: StageJournal[];
};

/* -------------------------------------------------------------------------- */
/*  Primitives                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * The only way stage photography is rendered. The parent frame has a fixed,
 * guaranteed height and a warm multi-stop gradient behind the photo, so a
 * `fill` image can never collapse to zero height or leave a void.
 */
export function StageImage({
  slot,
  sizes,
  priority = false,
  children,
}: {
  slot: MediaSlot;
  sizes: string;
  priority?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className="relative h-[52vh] min-h-[24rem] w-full overflow-hidden rounded-[2rem] border border-white/15"
      style={{ backgroundImage: mediaFallback }}
    >
      <Image
        src={slot.src}
        alt={slot.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={{ objectPosition: slot.position ?? "50% 50%" }}
      />
      {children}
    </div>
  );
}

/** Gentle, endless levitation for floating glass elements. */
function Float({
  children,
  className = "",
  delay = 0,
  amplitude = 7,
  style,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  amplitude?: number;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      animate={reduce ? undefined : { y: [0, -amplitude, 0] }}
      transition={{ duration: 6 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-gold-soft">
      {children}
    </p>
  );
}

function GlassLink({
  href,
  children,
  external = false,
  primary = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  primary?: boolean;
}) {
  const cls = `group inline-flex items-center justify-between gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${
    primary
      ? "bg-gold text-pine-deep shadow-[0_10px_30px_rgba(201,164,74,0.35)] hover:bg-gold-soft"
      : "glass hover:border-gold/50"
  }`;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*  Live Friday clock (hydration-safe: null on the server)                     */
/* -------------------------------------------------------------------------- */

let clockTick = Math.floor(Date.now() / 1000);

function subscribeClock(onChange: () => void) {
  clockTick = Math.floor(Date.now() / 1000);
  onChange();
  const id = window.setInterval(() => {
    clockTick = Math.floor(Date.now() / 1000);
    onChange();
  }, 1000);
  return () => window.clearInterval(id);
}

const getClockSnapshot = () => clockTick;
const getClockServerSnapshot = () => null;

const weekdayIndex: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const easternParts = new Intl.DateTimeFormat("en-US", {
  timeZone: jumahClock.timeZone,
  weekday: "short",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hourCycle: "h23",
});

type JumahStatus = {
  phase: "countdown" | "today" | "live";
  headline: string;
  detail: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

function jumahStatus(nowSeconds: number): JumahStatus {
  const parts = easternParts.formatToParts(new Date(nowSeconds * 1000));
  const read = (type: string) => parts.find((part) => part.type === type)?.value ?? "0";
  const weekday = weekdayIndex[read("weekday")] ?? 0;
  const secondsIntoDay = Number(read("hour")) * 3600 + Number(read("minute")) * 60 + Number(read("second"));

  const target = jumahClock.hour * 3600 + jumahClock.minute * 60;
  const week = 7 * 86400;
  const daysAhead = (jumahClock.weekday - weekday + 7) % 7;
  let diff = daysAhead * 86400 + target - secondsIntoDay;
  if (diff <= -jumahClock.sessionMinutes * 60) diff += week;

  if (diff <= 0) {
    return { phase: "live", headline: "In session now", detail: "Jumu'ah is underway" };
  }

  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

  if (days === 0) {
    return {
      phase: "today",
      headline: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
      detail: "until khutbah today",
    };
  }
  return {
    phase: "countdown",
    headline: `${days}d ${pad(hours)}h ${pad(minutes)}m`,
    detail: "until Friday's khutbah",
  };
}

function JumahCountdown() {
  const tick = useSyncExternalStore(subscribeClock, getClockSnapshot, getClockServerSnapshot);
  const status = tick === null ? null : jumahStatus(tick);
  const live = status?.phase === "live" || status?.phase === "today";

  return (
    <div className="glass flex items-center gap-3 rounded-2xl px-4 py-2.5">
      <span className="relative flex h-2.5 w-2.5">
        {live ? (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
        ) : null}
        <span
          className={`relative inline-flex h-2.5 w-2.5 rounded-full ${live ? "bg-gold" : "bg-gold-soft/70"}`}
        />
      </span>
      <div className="leading-tight">
        <p className="font-display text-xl tabular-nums text-ivory">
          {status ? status.headline : "Every Friday"}
        </p>
        <p className="text-[11px] uppercase tracking-[0.18em] text-ivory/65">
          {status ? status.detail : site.jumah.time}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Scene 1 — Our story                                                        */
/* -------------------------------------------------------------------------- */

function AboutScene() {
  return (
    <div className="relative mx-auto w-full max-w-[40rem]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-16 h-[118%] w-[128%] bg-contain bg-center bg-no-repeat opacity-15"
        style={{ backgroundImage: "url(/arabic-calligraphy.svg)" }}
      />

      <div className="relative rounded-[2.5rem] border border-white/15 bg-white/[0.06] p-3 shadow-[0_40px_120px_rgba(0,0,0,0.45),0_0_0_1px_rgba(201,164,74,0.2)] backdrop-blur-sm">
        <StageImage slot={media.about} sizes="(max-width: 1024px) 100vw, 640px" priority>
          <div className="absolute inset-0 bg-gradient-to-t from-pine-deep/80 via-pine-deep/10 to-pine/20" />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.05)_30%,transparent_46%)]" />
          {/* Milestone pills live inside the frame with safe insets so they can never clip. */}
          <div className="absolute inset-x-4 top-5 z-10 flex flex-wrap items-start justify-between gap-2 md:inset-x-6 md:top-6">
            {aboutMilestones.map((milestone, index) => (
              <Float key={milestone.id} className="max-w-full" delay={index * 1.4} amplitude={3}>
                <span className="glass inline-flex max-w-full items-center gap-2 rounded-full px-4 py-2 text-xs font-medium tracking-wide text-ivory md:text-sm">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  <span className="min-w-0">{milestone.label}</span>
                </span>
              </Float>
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            <p className="font-display text-3xl leading-none text-ivory md:text-4xl">
              {site.name}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.24em] text-gold-soft">
              Masjid · Table · Community
            </p>
          </div>
        </StageImage>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Scene 2 — Jumu'ah                                                          */
/* -------------------------------------------------------------------------- */

function JumahScene({ jumah }: { jumah: StageJumah | null }) {
  return (
    <div className="relative mx-auto w-full max-w-[42rem]">
      {/* One outer frame holds both the photo and the spec cards, so nothing straddles its edge. */}
      <div className="relative rounded-[2.5rem] border border-white/15 bg-white/[0.06] p-3 shadow-[0_40px_120px_rgba(0,0,0,0.45),0_0_0_1px_rgba(201,164,74,0.2)] backdrop-blur-sm">
      <StageImage slot={media.jumah} sizes="(max-width: 1024px) 100vw, 672px">
        <div className="absolute inset-0 bg-gradient-to-t from-pine-deep/85 via-pine-deep/10 to-pine-deep/30" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(230,211,154,0.28),transparent_70%)]" />
        <div className="absolute inset-x-4 top-4 flex flex-wrap items-start justify-between gap-3 md:inset-x-6 md:top-6">
          <span className="glass inline-flex max-w-full items-center gap-2 rounded-full px-4 py-2 text-xs font-medium tracking-wide text-ivory">
            <MapPin size={14} className="shrink-0 text-gold" />
            <span className="min-w-0">Doors Open Every Friday on Bessemer</span>
          </span>
          <JumahCountdown />
        </div>
        {jumah ? (
          <div className="absolute inset-x-5 bottom-5 hidden md:block">
            <p className="text-[11px] uppercase tracking-[0.24em] text-gold-soft">
              {jumah.dateLabel}
            </p>
            <p className="mt-1 font-display text-3xl leading-tight text-ivory">
              {jumah.khutbahTitle}
            </p>
          </div>
        ) : null}
      </StageImage>

      <div className="relative z-10 grid gap-3 px-1 pb-3 pt-4 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)_minmax(0,1fr)] sm:px-2">
        {jumahSpecs.map((spec, index) => (
          <Float key={spec.id} className="h-full" delay={index * 0.6} amplitude={3}>
            <div className="glass h-full min-w-0 rounded-2xl px-4 py-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-soft">
                {spec.label}
              </p>
              <p className="mt-2 text-balance break-words font-display text-lg leading-snug text-ivory md:text-xl">
                {spec.value}
              </p>
            </div>
          </Float>
        ))}
      </div>
      </div>

      <div className="relative z-10 mt-3 flex flex-col gap-3 px-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p className="text-xs leading-relaxed text-ivory/70">
          Can&apos;t make it in person? Live Fridays at {site.jumah.time} — watch without leaving
          the site.
        </p>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <GlassLink href={site.jumah.watchPath} primary>
            <span className="inline-flex items-center gap-2">
              <Video size={16} /> Watch live on site
            </span>
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </GlassLink>
          <a
            href={jumah?.streamUrl ?? site.jumah.streamUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-gold-soft transition-colors hover:text-gold"
          >
            Open on YouTube →
          </a>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Scene 3 — Announcements                                                    */
/* -------------------------------------------------------------------------- */

const kindLabel: Record<StageAnnouncement["kind"], string> = {
  GENERAL: "Bulletin",
  URGENT: "Urgent",
  PROGRAM: "Program",
};

function AnnouncementsScene({
  announcements,
  events,
}: {
  announcements: StageAnnouncement[];
  events: StageEvent[];
}) {
  const featured = announcements[0];
  const more = announcements.slice(1, 3);

  return (
    <div className="relative mx-auto w-full max-w-[42rem]">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-12 h-[70%] w-[90%] bg-contain bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: "url(/arabic-calligraphy.svg)" }}
      />

      <div className="relative grid gap-4 sm:grid-cols-5">
        <article className="glass-strong relative flex flex-col justify-between overflow-hidden rounded-[2rem] p-6 sm:col-span-3 md:p-7">
          <div
            aria-hidden
            className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(201,164,74,0.32),transparent_70%)]"
          />
          <div className="relative">
            <div className="flex items-center gap-2">
              <Megaphone size={14} className="text-gold" />
              <Eyebrow>Featured bulletin</Eyebrow>
            </div>
            {featured ? (
              <>
                <span
                  className={`mt-4 inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                    featured.kind === "URGENT"
                      ? "bg-red-400/20 text-red-100"
                      : "bg-gold/20 text-gold-soft"
                  }`}
                >
                  {featured.pinned ? "Pinned · " : ""}
                  {kindLabel[featured.kind]}
                </span>
                <h3 className="mt-3 font-display text-3xl leading-[1.02] text-ivory md:text-4xl">
                  {featured.title}
                </h3>
                <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-ivory/75">
                  {featured.body}
                </p>
              </>
            ) : (
              <>
                <h3 className="mt-4 font-display text-3xl leading-[1.02] text-ivory md:text-4xl">
                  Notes from the office
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/75">
                  No bulletins right now. New notes appear here the moment the office posts them.
                </p>
              </>
            )}
          </div>
          <div className="relative mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-ivory/60">
            <span>{featured ? featured.dateLabel : "Updated live"}</span>
            <Link
              href="/announcements"
              className="inline-flex items-center gap-1 text-gold-soft transition-colors hover:text-gold"
            >
              All announcements <ArrowUpRight size={14} />
            </Link>
          </div>
        </article>

        <div className="flex flex-col gap-3 sm:col-span-2">
          <p className="px-1 text-[10px] font-medium uppercase tracking-[0.24em] text-gold-soft">
            Quick links
          </p>
          <GlassLink href={site.jumah.watchPath} primary>
            <span className="inline-flex items-center gap-2">
              <Video size={16} /> Watch live on site
            </span>
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </GlassLink>
          <GlassLink href="/events">
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={16} className="text-gold" /> Community calendar
            </span>
            <ArrowUpRight size={16} />
          </GlassLink>
          <GlassLink href="/volunteer">
            <span className="inline-flex items-center gap-2">
              <Sprout size={16} className="text-gold" /> Volunteer
            </span>
            <ArrowUpRight size={16} />
          </GlassLink>
          {more.length ? (
            <ul className="mt-1 space-y-2 px-1">
              {more.map((item) => (
                <li key={item.id} className="border-l border-gold/40 pl-3 text-xs leading-snug text-ivory/70">
                  {item.title}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <section className="glass rounded-[2rem] p-5 sm:col-span-5 md:p-6">
          <div className="flex items-center justify-between">
            <Eyebrow>Community schedule</Eyebrow>
            <Link
              href="/events"
              className="text-xs text-gold-soft transition-colors hover:text-gold"
            >
              Full calendar →
            </Link>
          </div>
          {events.length ? (
            <ul className="mt-4 divide-y divide-white/10">
              {events.slice(0, 3).map((event) => (
                <li key={event.id} className="flex items-baseline justify-between gap-4 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate font-display text-xl text-ivory">{event.title}</p>
                    <p className="truncate text-xs text-ivory/60">{event.location}</p>
                  </div>
                  <p className="shrink-0 text-xs font-medium text-gold-soft">{event.dateLabel}</p>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="mt-4 divide-y divide-white/10">
              <li className="flex items-baseline justify-between gap-4 py-2.5">
                <p className="font-display text-xl text-ivory">Jumu&apos;ah congregation</p>
                <p className="shrink-0 text-xs font-medium text-gold-soft">
                  Fridays · {site.jumah.time}
                </p>
              </li>
              <li className="flex items-baseline justify-between gap-4 py-2.5">
                <p className="font-display text-xl text-ivory">{site.programs.pantry.name}</p>
                <p className="shrink-0 text-xs font-medium text-gold-soft">
                  {site.programs.pantry.hoursShort}
                </p>
              </li>
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Scene 4 — Muslim Journal                                                   */
/* -------------------------------------------------------------------------- */

function JournalScene({ journal }: { journal: StageJournal[] }) {
  const issue = journal[0] ?? {
    id: "fallback",
    title: journalFallback.title,
    issueLabel: journalFallback.issueLabel,
    excerpt: journalFallback.excerpt,
    readMinutes: journalFallback.readMinutes,
    dateLabel: "",
  };
  const quote = pullQuote(issue.excerpt);

  return (
    <div className="relative mx-auto w-full max-w-[44rem] px-3 py-4">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-4 rounded-[3rem] bg-[radial-gradient(60%_60%_at_50%_50%,rgba(201,164,74,0.18),transparent_72%)] blur-xl"
      />
      {/* Flat editorial frame — static, upright, no cursor-reactive motion. */}
      <div className="relative rounded-[2.25rem] border border-white/15 bg-white/[0.06] p-3 shadow-[0_40px_120px_rgba(0,0,0,0.4),0_0_0_1px_rgba(201,164,74,0.2)] backdrop-blur-sm">
      <div className="relative grid min-h-[max(22rem,46vh)] grid-cols-1 overflow-hidden rounded-[1.75rem] shadow-[0_20px_50px_rgba(3,12,8,0.35)] sm:grid-cols-2">
        {/* Left page — pull-quote */}
        <article
          className="relative flex flex-col justify-between gap-4 overflow-hidden border-gold/30 bg-[linear-gradient(135deg,#fbf6e8_0%,#efe3c4_100%)] px-6 py-7 text-ink shadow-[inset_-26px_0_34px_-26px_rgba(13,59,46,0.22)] md:px-9 md:py-9"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-pine/70">
            {issue.issueLabel}
          </p>
          <div>
            <span className="font-display text-7xl leading-none text-gold">&ldquo;</span>
            <p className="-mt-4 font-display text-xl italic leading-[1.14] text-pine md:text-[1.6rem]">
              {quote}
            </p>
          </div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-ink-soft">
            {issue.dateLabel || "Muslim Journal"}
          </p>
        </article>

        {/* Right page — issue */}
        <article
          className="relative flex flex-col justify-between gap-4 overflow-hidden bg-[linear-gradient(225deg,#fbf6e8_0%,#ecdfbd_100%)] px-6 py-7 text-ink shadow-[inset_26px_0_34px_-26px_rgba(13,59,46,0.22)] md:px-9 md:py-9"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-pine px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-soft">
              <BookOpen size={12} />
              {issue.readMinutes} min read
            </span>
            <h3 className="mt-4 text-balance font-display text-2xl font-semibold leading-[1.02] text-pine md:text-[2rem]">
              {issue.title}
            </h3>
          </div>
          <div>
            <p className="line-clamp-3 text-sm leading-relaxed text-ink-soft">{issue.excerpt}</p>
            <p className="mt-3 border-t border-pine/15 pt-3 font-display text-base italic text-pine/80 md:text-lg">
              {journalSecondaryQuote}
            </p>
          </div>
        </article>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-10 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(13,59,46,0.18),transparent)] sm:block"
        />
      </div>
      </div>

      <Float className="relative z-10 mt-6 flex justify-center" amplitude={4}>
        <Link
          href="/journal"
          className="glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors hover:border-gold/60"
        >
          <BookOpen size={15} className="text-gold" />
          {journal.length > 1 ? `${journal.length} issues online` : "Read the journal"}
          <ArrowUpRight size={14} />
        </Link>
      </Float>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Scene 5 — Service / Outreach                                               */
/* -------------------------------------------------------------------------- */

function OutreachScene() {
  const { pantry, hours, garden } = outreachPrograms;
  return (
    <div className="relative mx-auto w-full max-w-[44rem]">
      <div className="grid gap-4 md:grid-cols-5">
        <div className="md:col-span-3">
          <StageImage slot={media.pantry} sizes="(max-width: 1024px) 100vw, 420px">
            <div className="absolute inset-0 bg-gradient-to-t from-pine-deep/90 via-pine-deep/10 to-transparent" />
            <div className="absolute inset-x-3 bottom-3">
              <div className="glass rounded-2xl p-4">
                <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-soft">
                  {pantry.metric} {pantry.metricLabel}
                </p>
                <p className="mt-1 font-display text-2xl leading-tight text-ivory">{pantry.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-ivory/70">{pantry.line}</p>
              </div>
            </div>
          </StageImage>
        </div>

        <div className="grid gap-4 md:col-span-2 md:grid-rows-2">
          <Float amplitude={4}>
            <article className="glass-strong flex h-full min-h-[11rem] flex-col justify-between rounded-[2rem] p-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-soft">
                {hours.name}
              </p>
              <div>
                <p className="font-display text-5xl leading-none text-gold">{hours.metric}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-ivory/80">
                  {hours.metricLabel}
                </p>
              </div>
              <p className="text-xs leading-snug text-ivory/60">{hours.line}</p>
            </article>
          </Float>
          <Float amplitude={4} delay={1.1}>
            <article className="glass relative flex h-full min-h-[11rem] flex-col justify-between overflow-hidden rounded-[2rem] p-5">
              <div
                aria-hidden
                className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(22,68,52,0.9),transparent_70%)]"
              />
              <div className="relative flex items-center justify-between">
                <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-soft">
                  {garden.name}
                </p>
                <Sprout size={18} className="text-gold" />
              </div>
              <p className="relative font-display text-3xl leading-tight text-ivory">
                {garden.metricLabel}
              </p>
              <p className="relative text-xs leading-snug text-ivory/70">{garden.line}</p>
            </article>
          </Float>
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-3">
        {outreachMetrics.map((metric) => (
          <li key={metric.id} className="glass rounded-2xl px-4 py-3 text-center">
            <p className="font-display text-2xl leading-none text-gold-soft md:text-3xl">
              {metric.value}
            </p>
            <p className="mt-1.5 text-[10px] uppercase tracking-[0.16em] text-ivory/65">
              {metric.label}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Scene 6 — Contact / location                                               */
/* -------------------------------------------------------------------------- */

function BlueprintMap() {
  return (
    <svg
      viewBox="0 0 640 240"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Map sketch of East Bessemer Avenue"
    >
      <defs>
        <linearGradient id="bp-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#14382b" />
          <stop offset="0.55" stopColor="#0d3b2e" />
          <stop offset="1" stopColor="#071912" />
        </linearGradient>
        <radialGradient id="bp-glow" cx="0.5" cy="0.55" r="0.5">
          <stop offset="0" stopColor="rgba(201,164,74,0.42)" />
          <stop offset="1" stopColor="rgba(201,164,74,0)" />
        </radialGradient>
        <pattern id="bp-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0V32" fill="none" stroke="rgba(230,211,154,0.12)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="640" height="240" fill="url(#bp-bg)" />
      <rect width="640" height="240" fill="url(#bp-grid)" />
      <rect width="640" height="240" fill="url(#bp-glow)" />

      <path d="M-20 150 L660 118" stroke="rgba(244,239,228,0.32)" strokeWidth="26" strokeLinecap="round" />
      <path
        d="M-20 150 L660 118"
        stroke="rgba(201,164,74,0.7)"
        strokeWidth="2"
        strokeDasharray="14 12"
        strokeLinecap="round"
      />
      <path d="M180 -10 L214 260" stroke="rgba(244,239,228,0.14)" strokeWidth="14" />
      <path d="M470 -10 L430 260" stroke="rgba(244,239,228,0.14)" strokeWidth="14" />

      <g stroke="rgba(230,211,154,0.55)" strokeWidth="1.5" fill="rgba(7,25,18,0.55)">
        <rect x="236" y="48" width="64" height="40" rx="4" />
        <rect x="334" y="40" width="72" height="48" rx="4" />
        <rect x="250" y="170" width="84" height="44" rx="4" />
        <rect x="360" y="164" width="52" height="40" rx="4" />
      </g>

      <text
        x="40"
        y="196"
        fill="rgba(244,239,228,0.7)"
        fontSize="13"
        letterSpacing="3"
        className="font-sans"
      >
        E. BESSEMER AVE.
      </text>

      <g transform="translate(320 104)">
        <circle r="26" fill="rgba(201,164,74,0.22)">
          <animate attributeName="r" values="18;34;18" dur="3.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;0;0.9" dur="3.2s" repeatCount="indefinite" />
        </circle>
        <path
          d="M0 12 C-14 -4 -16 -10 -16 -16 A16 16 0 1 1 16 -16 C16 -10 14 -4 0 12Z"
          fill="#c9a44a"
          stroke="#f4efe4"
          strokeWidth="2"
        />
        <circle cy="-16" r="5.5" fill="#071912" />
      </g>
    </svg>
  );
}

function ContactScene() {
  return (
    <div className="relative mx-auto w-full max-w-[40rem]">
      <Float className="absolute -right-2 -top-4 z-10 md:-right-6" amplitude={5}>
        <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium tracking-wide">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          East Greensboro · {site.address.zip}
        </span>
      </Float>

      <article className="glass-strong overflow-hidden rounded-[2rem]">
        <div className="relative h-[26vh] min-h-[11rem] w-full overflow-hidden border-b border-white/10">
          <BlueprintMap />
        </div>

        <div className="p-6 md:p-8">
          <Eyebrow>Visit the Center</Eyebrow>
          <h3 className="mt-3 font-display text-4xl leading-[0.98] text-ivory md:text-5xl">
            {site.address.street}
          </h3>
          <p className="mt-1 text-base text-ivory/70">
            {site.address.city}, {site.address.state} {site.address.zip}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <GlassLink href={mapLinks.google} external primary>
              <span className="inline-flex items-center gap-2">
                <Navigation size={16} /> Open in Google Maps
              </span>
              <ArrowUpRight size={16} />
            </GlassLink>
            <GlassLink href={mapLinks.apple} external>
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} className="text-gold" /> Open in Apple Maps
              </span>
              <ArrowUpRight size={16} />
            </GlassLink>
          </div>

          <dl className="mt-6 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2">
            <div className="flex items-start gap-3 sm:col-span-2">
              <Clock size={16} className="mt-0.5 shrink-0 text-gold" />
              <div>
                <dt className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-soft">
                  Visiting hours
                </dt>
                <dd className="mt-1 text-sm text-ivory/85">
                  Office: {site.hours} · Jumu&apos;ah: Fridays, {site.jumah.time}
                </dd>
              </div>
            </div>
            <a
              href={site.phoneHref}
              className="glass inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm transition-colors hover:border-gold/60"
            >
              <Phone size={15} className="text-gold" />
              {site.phone}
            </a>
            <a
              href={`mailto:${site.emails.info}`}
              className="glass inline-flex min-w-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm transition-colors hover:border-gold/60"
            >
              <Mail size={15} className="shrink-0 text-gold" />
              <span className="truncate">{site.emails.info}</span>
            </a>
          </dl>
        </div>
      </article>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Dispatcher                                                                 */
/* -------------------------------------------------------------------------- */

export function SceneVisual({ scene, data }: { scene: SceneId; data: StageData }) {
  switch (scene) {
    case "about":
      return <AboutScene />;
    case "jumah":
      return <JumahScene jumah={data.jumah} />;
    case "announcements":
      return (
        <AnnouncementsScene
          announcements={data.announcements}
          events={data.events}
        />
      );
    case "journal":
      return <JournalScene journal={data.journal} />;
    case "outreach":
      return <OutreachScene />;
    case "contact":
      return <ContactScene />;
  }
}
