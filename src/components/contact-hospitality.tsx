"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import { sendContact } from "@/app/contact/actions";
import { media, mediaFallback } from "@/lib/media";
import { site, weeklyPrograms } from "@/lib/site";

export type ContactHospitalityProps = {
  sent?: string;
  error?: string;
  /** Hidden return path for the server action (e.g. "/#contact" or "/contact") */
  returnTo?: string;
  /** Section id for in-page anchors */
  id?: string;
};

/**
 * Executive Dark Glass contact — form left, Visit & Hospitality right.
 * Shared by homepage #contact and /contact.
 */
export function ContactHospitality({
  sent,
  error,
  returnTo = "/#contact",
  id = "contact",
}: ContactHospitalityProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && (entry.intersectionRatio ?? 0) > 0.25) {
          document.body.setAttribute("data-on-dark", "true");
        }
      },
      { threshold: [0.25, 0.5] },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative scroll-mt-28 overflow-hidden bg-[#070b09] px-5 py-20 text-ivory md:px-8 md:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 50% 40% at 15% 20%, rgba(201,164,74,0.12), transparent 55%),
            radial-gradient(ellipse 45% 35% at 85% 70%, rgba(22,68,52,0.28), transparent 50%),
            #070b09
          `,
        }}
      />

      <div className="relative mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left — form */}
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.42em] text-gold-soft/80">
            Get in touch
          </p>
          <h2 className="mt-4 font-display text-[clamp(2.25rem,4vw,3.75rem)] font-semibold leading-[0.94] tracking-[-0.04em] text-ivory">
            The door is on Bessemer.
          </h2>
          <p className="mt-4 max-w-md text-base text-ivory/55">
            Write the office — someone will reach back, in sha Allah.
          </p>

          <form action={sendContact} className="form-glass mt-8 p-6 md:p-8">
            <input type="hidden" name="returnTo" value={returnTo} />
            {sent ? (
              <p className="mb-4 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">
                Message received. Someone will reach out soon, in sha Allah.
              </p>
            ) : null}
            {error ? (
              <p className="mb-4 rounded-xl border border-red-400/25 bg-red-400/10 px-3 py-2 text-sm text-red-200">
                Please check the fields and try again.
              </p>
            ) : null}

            <label className="block text-sm text-ivory/70">
              Name
              <input
                required
                name="name"
                placeholder="Your name"
                className="form-glass-input mt-1.5"
              />
            </label>
            <label className="mt-4 block text-sm text-ivory/70">
              Email
              <input
                required
                type="email"
                name="email"
                placeholder="you@example.com"
                className="form-glass-input mt-1.5"
              />
            </label>
            <label className="mt-4 block text-sm text-ivory/70">
              Phone <span className="text-ivory/35">(optional)</span>
              <input
                name="phone"
                placeholder="(336) …"
                className="form-glass-input mt-1.5"
              />
            </label>
            <label className="mt-4 block text-sm text-ivory/70">
              Attention
              <select name="attention" className="form-glass-input mt-1.5">
                <option>Imam</option>
                <option>Board of Directors</option>
                <option>Halimah&apos;s Pantry</option>
                <option>Other</option>
              </select>
            </label>
            <label className="mt-4 block text-sm text-ivory/70">
              How can we help?
              <textarea
                required
                name="message"
                rows={4}
                placeholder="A short note…"
                className="form-glass-input mt-1.5 resize-y"
              />
            </label>
            <button type="submit" className="btn-gold mt-6 w-full sm:w-auto">
              Send message
            </button>
          </form>
        </div>

        {/* Right — Visit & Hospitality Showcase */}
        <div className="space-y-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.42em] text-gold-soft/80">
            Visit &amp; hospitality
          </p>
          <div
            className="relative aspect-[4/3] min-h-[16rem] w-full overflow-hidden rounded-[1.75rem] border border-white/15"
            style={{ background: mediaFallback }}
          >
            <Image
              src={media.gathering.src}
              alt={media.gathering.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070b09]/85 via-transparent to-[#070b09]/20" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="font-display text-2xl text-ivory">{site.address.street}</p>
              <p className="mt-1 text-sm text-ivory/55">
                {site.address.city}, {site.address.state} {site.address.zip}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <a href={site.phoneHref} className="contact-pill">
              <Phone className="h-4 w-4 shrink-0 text-gold-soft" strokeWidth={1.5} />
              {site.phone}
            </a>
            <a href={`mailto:${site.emails.info}`} className="contact-pill">
              <Mail className="h-4 w-4 shrink-0 text-gold-soft" strokeWidth={1.5} />
              {site.emails.info}
            </a>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${site.mapsQuery}`}
              target="_blank"
              rel="noreferrer"
              className="contact-pill"
            >
              <MapPin className="h-4 w-4 shrink-0 text-gold-soft" strokeWidth={1.5} />
              {site.address.full}
            </a>
          </div>

          <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-5 backdrop-blur-xl">
            <p className="text-[10px] uppercase tracking-[0.28em] text-ivory/45">
              Weekly program hours
            </p>
            <ul className="mt-4 space-y-3">
              {weeklyPrograms.map((program) => (
                <li
                  key={program.name}
                  className="flex flex-col gap-0.5 border-b border-white/8 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                >
                  <span className="font-display text-lg text-ivory">{program.name}</span>
                  <span className="text-sm text-ivory/50">{program.detail}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-ivory/40">Office · {site.hours}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
