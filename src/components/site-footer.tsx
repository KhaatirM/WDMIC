"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="relative z-20 border-t border-pine/10 bg-pine-deep text-ivory">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">{site.shortName}</p>
          <p className="mt-2 max-w-xs text-sm text-ivory/70">{site.tagline}</p>
        </div>
        <div className="text-sm text-ivory/80">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gold-soft">Visit</p>
          <p>{site.address.full}</p>
          <p className="mt-2">
            <a href={site.phoneHref}>{site.phone}</a>
          </p>
          <p>
            <a href={`mailto:${site.emails.info}`}>{site.emails.info}</a>
          </p>
        </div>
        <div className="text-sm">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gold-soft">Hub</p>
          <div className="flex flex-col gap-1 text-ivory/80">
            <Link href="/jumah">Jumu&apos;ah</Link>
            <Link href="/#events">Events</Link>
            <Link href="/#journal">Muslim Journal</Link>
            <Link href="/members">Members</Link>
            <Link href="/volunteer">Volunteer</Link>
          </div>
        </div>
      </div>
      <div className="gold-line" />
      <p className="px-4 py-4 text-center text-xs text-ivory/50">
        © {new Date().getFullYear()} {site.name}. A 501(c)(3) religious nonprofit. EIN {site.ein}.
      </p>
    </footer>
  );
}
