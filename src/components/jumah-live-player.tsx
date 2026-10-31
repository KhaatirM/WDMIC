"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight, CalendarClock, Radio } from "lucide-react";
import { site } from "@/lib/site";

type JumahLivePlayerProps = {
  /** "Open on YouTube" destination; defaults to the canonical channel URL. */
  streamUrl?: string | null;
  className?: string;
};

/**
 * On-site Jumu'ah live stream. Embeds the channel's *current* live stream
 * (youtube-nocookie `live_stream?channel=…`) — no fixed video ID.
 *
 * When the channel is offline YouTube renders its own "not live" placeholder inside the frame,
 * so the copy beneath the player always explains the schedule and offers the channel link.
 * Reduced motion only affects the decorative pulse/glow; the player is untouched.
 */
export function JumahLivePlayer({ streamUrl, className = "" }: JumahLivePlayerProps) {
  const reduce = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const channelHref = streamUrl ?? site.jumah.streamUrl;

  return (
    <section
      id="live"
      aria-labelledby="jumah-live-heading"
      className={`relative scroll-mt-24 ${className}`}
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.42em] text-gold-soft/80">
              <span className="relative flex h-2 w-2" aria-hidden>
                <span
                  className={`absolute inline-flex h-full w-full rounded-full bg-gold/70 ${
                    reduce ? "" : "animate-ping"
                  }`}
                />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </span>
              Watch Live · On This Site
            </p>
            <h2
              id="jumah-live-heading"
              className="mt-4 font-display text-3xl font-bold leading-[0.95] tracking-[-0.04em] text-white md:text-5xl"
            >
              Jumu&apos;ah live stream
            </h2>
          </div>
          <a
            href={channelHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.3em] text-white/70 backdrop-blur-xl transition-colors hover:border-gold/40 hover:text-white"
          >
            Open on YouTube
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          </a>
        </div>

        {/* Pine / gold glass bezel */}
        <div className="relative">
          <div
            aria-hidden
            className={`pointer-events-none absolute -inset-6 rounded-[3rem] bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,164,74,0.22),transparent_65%)] blur-2xl ${
              reduce ? "opacity-70" : "opacity-60 transition-opacity duration-700"
            }`}
          />
          <div className="relative rounded-[2rem] border border-gold/25 bg-gradient-to-br from-pine/70 via-pine-deep/90 to-black p-2.5 shadow-[0_30px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-xl md:rounded-[2.5rem] md:p-3.5">
            <div className="relative aspect-video w-full overflow-hidden rounded-[1.4rem] border border-white/10 bg-black md:rounded-[2rem]">
              {/* Loading backdrop — visible until the iframe paints */}
              <div
                aria-hidden
                className={`absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_50%_40%,rgba(20,56,43,0.9),#050a08_70%)] transition-opacity duration-500 ${
                  loaded ? "opacity-0" : "opacity-100"
                }`}
              >
                <Radio
                  className={`h-8 w-8 text-gold-soft/60 ${reduce ? "" : "animate-pulse"}`}
                  strokeWidth={1.25}
                />
              </div>
              <iframe
                className="absolute inset-0 h-full w-full"
                src={site.jumah.embedUrl}
                title="WDMIC Jumu'ah live stream"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                onLoad={() => setLoaded(true)}
              />
            </div>
          </div>
        </div>

        {/* Always-visible schedule copy so a mid-week "not live" frame never feels broken */}
        <div className="mt-6 flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between md:p-6">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-gold/25 bg-gold/10">
              <CalendarClock className="h-4 w-4 text-gold-soft" strokeWidth={1.5} aria-hidden />
            </span>
            <div>
              <p className="font-display text-xl font-bold tracking-[-0.02em] text-white md:text-2xl">
                Live Fridays at {site.jumah.time}
              </p>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-white/50">
                If the player shows an offline message, the stream isn&apos;t running right now —
                it goes live for Jumu&apos;ah. You can also watch on the{" "}
                <a
                  href={channelHref}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gold-soft underline decoration-gold/30 underline-offset-4 transition-colors hover:text-gold"
                >
                  Center&apos;s YouTube channel
                </a>
                .
              </p>
            </div>
          </div>
          <a
            href={channelHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-gold/30 bg-gold px-6 py-3 text-[10px] font-medium uppercase tracking-[0.32em] text-pine-deep shadow-2xl shadow-black/30 transition-transform hover:-translate-y-0.5"
          >
            Open channel
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
