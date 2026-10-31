"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { nav, site, type SectionId } from "@/lib/site";
import {
  lightColors,
  scenes,
  type LightKey,
  type SceneId,
  type StageSide,
} from "@/lib/story";
import { Reveal } from "@/components/reveal";
import { SceneVisual, type StageData } from "@/components/stage-scenes";

/* -------------------------------------------------------------------------- */
/*  Header nav support                                                         */
/* -------------------------------------------------------------------------- */

const ids = nav.map((item) => item.id);

/**
 * Which top-level section sits under a reading line ~38% down the viewport.
 * Sections are re-queried on every frame so it keeps working after client-side
 * navigation (the header outlives the page).
 */
export function useActiveSection() {
  const pathname = usePathname();
  const [scene, setScene] = useState<SectionId>("home");

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.38;
      let current: SectionId = "home";
      for (const id of ids) {
        const node = document.getElementById(id);
        if (!node) continue;
        const rect = node.getBoundingClientRect();
        if (rect.top <= line && rect.bottom > line) {
          current = id;
          break;
        }
      }
      setScene(current);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const syncHash = () => {
      const hash = window.location.hash.slice(1) as SectionId;
      if (ids.includes(hash)) setScene(hash);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", syncHash);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", syncHash);
    };
  }, [pathname]);

  return scene;
}

/** Smooth-scroll to #hash on load and when the hash changes. */
export function HashScroller() {
  useEffect(() => {
    const go = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    go();
    window.addEventListener("hashchange", go);
    return () => window.removeEventListener("hashchange", go);
  }, []);
  return null;
}

/* -------------------------------------------------------------------------- */
/*  Volumetric stage lighting                                                  */
/* -------------------------------------------------------------------------- */

const lightKeys: LightKey[] = ["gold", "pine", "ivory"];
const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Three soft light pools (Mihrab Gold, Deep Pine Emerald, Soft Ivory) that glide
 * to a new position / size / intensity each time the active scene changes.
 * The layer is sticky, so the light stays pinned to the viewport while scrolling.
 */
function StageLights({ scene, reduce }: { scene: SceneId; reduce: boolean }) {
  const signature = scenes[scene].light;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {lightKeys.map((key) => {
          const pose = signature[key];
          return (
            <motion.div
              key={key}
              className="absolute h-[85vmax] w-[85vmax] rounded-full"
              style={{
                x: "-50%",
                y: "-50%",
                background: `radial-gradient(closest-side, ${lightColors[key]} 0%, transparent 100%)`,
              }}
              initial={false}
              animate={{
                left: `${pose.x}%`,
                top: `${pose.y}%`,
                scale: pose.scale,
                opacity: pose.intensity,
              }}
              transition={{ duration: reduce ? 0 : 1.8, ease }}
            />
          );
        })}
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_120%,rgba(7,25,18,0.55),transparent_60%)]" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Narrative steps                                                            */
/* -------------------------------------------------------------------------- */

type StepId = "about" | "jumah" | "events" | "announcements" | "journal" | "outreach";

const stepScene: Record<StepId, SceneId> = {
  about: "about",
  jumah: "jumah",
  events: "announcements",
  announcements: "announcements",
  journal: "journal",
  outreach: "outreach",
};

const stageWidth = "58.3333%"; // 7 / 12 columns
const stageOffset = "41.6667%"; // 5 / 12 columns

function Step({
  id,
  side,
  active,
  visual,
  children,
}: {
  id: StepId;
  side: StageSide;
  active: boolean;
  /** Mobile-only inline Visual Stage (desktop uses the sticky stage). */
  visual?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-scene={stepScene[id]}
      data-step={id}
      className="pointer-events-none relative scroll-mt-24 py-10 lg:grid lg:min-h-[100svh] lg:grid-cols-12 lg:items-center lg:py-16"
    >
      {visual ? <div className="pointer-events-auto mb-10 lg:hidden">{visual}</div> : null}
      <div
        className={`pointer-events-auto lg:col-span-5 ${
          side === "right" ? "lg:col-start-1 lg:pr-10" : "lg:col-start-8 lg:pl-10"
        }`}
      >
        <Reveal from="up">
          <div
            data-active={active}
            className="rounded-[2rem] border border-white/20 bg-ivory p-7 text-ink shadow-[0_30px_80px_rgba(3,12,8,0.45)] transition-opacity duration-500 md:p-9 lg:data-[active=false]:opacity-60"
          >
            {children}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CardHeading({ eyebrow, title, as: Tag = "h2" }: { eyebrow: string; title: string; as?: "h2" | "h3" }) {
  return (
    <>
      <p className="text-xs uppercase tracking-[0.32em] text-gold">{eyebrow}</p>
      <Tag className="mt-4 font-display text-4xl leading-[0.95] text-pine md:text-5xl">{title}</Tag>
    </>
  );
}

function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="mt-7 inline-flex text-sm font-medium text-pine underline decoration-gold/50 underline-offset-4 transition-colors hover:decoration-gold"
    >
      {children}
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*  ScrollStage                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Two-column choreographed narrative.
 *
 * - Narrative cards scroll (5 of 12 columns) while the Visual Stage (7 of 12)
 *   stays sticky beside them, so the opposite side of a card is never empty.
 * - The scene under the viewport's midline drives the stage: compositions
 *   crossfade (scale 0.94 → 1, opacity 0 → 1, blur 8px → 0), the stage slides
 *   to the other side of the layout, and the volumetric lights re-aim.
 * - Below `lg` the stage is inlined above each narrative card instead.
 */
export function ScrollStage({ data }: { data: StageData }) {
  const reduce = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<StepId>("about");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.5;
      const nodes = root.querySelectorAll<HTMLElement>("[data-step]");
      for (const node of nodes) {
        const rect = node.getBoundingClientRect();
        if (rect.top <= line && rect.bottom > line) {
          setStep(node.dataset.step as StepId);
          return;
        }
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const scene = stepScene[step];
  const side = scenes[scene].side;
  const nextEvent = data.events[0];
  const latestNote = data.announcements[0];
  const latestIssue = data.journal[0];

  const visual = (id: SceneId) => <SceneVisual scene={id} data={data} />;

  return (
    <div ref={rootRef} className="stage-region relative isolate overflow-clip">
      <StageLights scene={scene} reduce={reduce} />

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        {/* Desktop Visual Stage — sticky, slides between sides, crossfades scenes. */}
        <div className="pointer-events-none absolute inset-y-0 left-5 right-5 z-20 hidden lg:block md:left-8 md:right-8">
          <motion.div
            className="pointer-events-auto sticky top-24 h-[calc(100svh-7rem)]"
            initial={false}
            animate={{ marginLeft: side === "left" ? "0%" : stageOffset }}
            transition={{ duration: reduce ? 0 : 1.1, ease }}
            style={{ width: stageWidth }}
          >
            <AnimatePresence initial={false}>
              <motion.div
                key={scene}
                className="absolute inset-0 flex items-center justify-center px-2"
                style={reduce ? undefined : { willChange: "transform, opacity, filter" }}
                initial={reduce ? false : { opacity: 0, scale: 0.94, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={
                  reduce
                    ? { opacity: 0, transition: { duration: 0 } }
                    : {
                        opacity: 0,
                        scale: 1.03,
                        filter: "blur(8px)",
                        transition: { duration: 0.55, ease },
                      }
                }
                transition={{ duration: reduce ? 0 : 0.95, ease }}
              >
                {visual(scene)}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        <Step id="about" side={scenes.about.side} active={step === "about"} visual={visual("about")}>
          <CardHeading eyebrow={scenes.about.eyebrow} title={scenes.about.headline} />
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{scenes.about.body}</p>
          <TextLink href="/about">Read our story →</TextLink>
        </Step>

        <Step id="jumah" side={scenes.jumah.side} active={step === "jumah"} visual={visual("jumah")}>
          <CardHeading eyebrow={scenes.jumah.eyebrow} title={scenes.jumah.headline} />
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{scenes.jumah.body}</p>
          {data.jumah ? (
            <p className="mt-6 font-display text-2xl text-pine md:text-3xl">
              {data.jumah.khutbahTitle}
            </p>
          ) : null}
          <p className="mt-3 text-sm text-ink-soft">{site.jumah.imam}</p>
          <TextLink href="/jumah">Jum&apos;ah details →</TextLink>
        </Step>

        <Step
          id="events"
          side={scenes.announcements.side}
          active={step === "events"}
          visual={visual("announcements")}
        >
          <CardHeading eyebrow={scenes.announcements.eyebrow} title={scenes.announcements.headline} />
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{scenes.announcements.body}</p>
          <div className="mt-6 border-t border-pine/10 pt-5">
            <p className="text-[11px] uppercase tracking-[0.28em] text-ink-soft">Next event</p>
            <h3 className="mt-2 font-display text-2xl text-pine md:text-3xl">
              {nextEvent ? nextEvent.title : "Programs & gatherings"}
            </h3>
            {nextEvent ? (
              <>
                <p className="mt-2 text-ink-soft">{nextEvent.summary}</p>
                <p className="mt-3 text-sm text-gold">
                  {nextEvent.dateLabel} · {nextEvent.location}
                </p>
              </>
            ) : (
              <p className="mt-2 text-ink-soft">Check back for upcoming programs.</p>
            )}
          </div>
          <TextLink href="/events">Full calendar →</TextLink>
        </Step>

        <Step
          id="announcements"
          side={scenes.announcements.side}
          active={step === "announcements"}
        >
          <p className="text-xs uppercase tracking-[0.32em] text-gold">From the office</p>
          <h3 className="mt-4 font-display text-3xl leading-[0.98] text-pine md:text-4xl">
            {latestNote ? latestNote.title : "Announcements"}
          </h3>
          {latestNote ? (
            <p className="mt-4 line-clamp-5 text-ink-soft">{latestNote.body}</p>
          ) : (
            <p className="mt-4 text-ink-soft">No announcements right now.</p>
          )}
          <TextLink href="/announcements">All notes →</TextLink>
        </Step>

        <Step id="journal" side={scenes.journal.side} active={step === "journal"} visual={visual("journal")}>
          <CardHeading eyebrow={scenes.journal.eyebrow} title={scenes.journal.headline} />
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{scenes.journal.body}</p>
          <div className="mt-6 border-t border-pine/10 pt-5">
            <h3 className="font-display text-2xl text-pine md:text-3xl">
              {latestIssue ? latestIssue.title : "Community writing"}
            </h3>
            <p className="mt-2 text-ink-soft">
              {latestIssue ? latestIssue.excerpt : "Stories from the Friday table."}
            </p>
          </div>
          <TextLink href="/journal">Read more →</TextLink>
        </Step>

        <Step id="outreach" side={scenes.outreach.side} active={step === "outreach"} visual={visual("outreach")}>
          <CardHeading eyebrow={scenes.outreach.eyebrow} title={scenes.outreach.headline} />
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{scenes.outreach.body}</p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link
              href="/volunteer"
              className="inline-flex rounded-full bg-pine px-6 py-3 text-sm font-medium text-ivory transition-transform hover:scale-[1.02]"
            >
              Volunteer with us
            </Link>
            <Link
              href="/outreach"
              className="text-sm font-medium text-pine underline decoration-gold/50 underline-offset-4 hover:decoration-gold"
            >
              Our programs →
            </Link>
          </div>
        </Step>
      </div>
    </div>
  );
}
