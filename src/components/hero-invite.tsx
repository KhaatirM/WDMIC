"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { media } from "@/lib/media";
import { site } from "@/lib/site";

/** Full-bleed warm arrival — brand, one headline, one line, one CTA group. */
export function HeroInvite() {
  const reduce = useReducedMotion();

  return (
    <section
      id="home"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-pine-deep"
      aria-label="Welcome"
    >
      <motion.div
        aria-hidden
        className="absolute inset-0"
        initial={reduce ? false : { scale: 1.06, opacity: 0.85 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={media.hero.src}
          alt={media.hero.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-pine-deep via-pine-deep/55 to-pine/25"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-pine-deep/70 via-pine-deep/20 to-transparent"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-36 md:px-8 md:pb-24 md:pt-44">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="font-display text-4xl leading-none tracking-[-0.03em] text-gold-soft md:text-5xl">
            {site.shortName}
          </p>
          <p className="mt-3 text-sm tracking-[0.04em] text-ivory/75 md:text-base">
            {site.name}
          </p>

          <h1 className="mt-8 font-display text-[clamp(2.75rem,7vw,5.25rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-ivory">
            The door is open on Bessemer.
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/70 md:text-lg">
            Visitors welcome every Friday at {site.jumah.time} — English khutbah in East
            Greensboro.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/jumah"
              className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-pine-deep transition-transform duration-300 hover:scale-[1.02]"
            >
              Plan your visit
            </Link>
            <Link
              href="/donate"
              className="rounded-full border border-ivory/25 bg-ivory/5 px-6 py-3 text-sm text-ivory/90 backdrop-blur-sm transition-colors hover:border-ivory/40 hover:bg-ivory/10"
            >
              Support the Center
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
