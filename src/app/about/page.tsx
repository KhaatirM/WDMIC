import type { Metadata } from "next";
import { OurStoryScroll } from "@/components/our-story-scroll";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Story",
  description: `The story of ${site.name} — worship, service, and belonging in East Greensboro since ${site.established}.`,
};

export default function AboutPage() {
  return (
    <div className="bg-ivory">
      <header className="border-b border-pine/10 bg-ivory px-5 pb-10 pt-28 md:px-10 md:pt-32">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-medium uppercase tracking-[0.48em] text-gold">
            About · {site.shortName}
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.75rem,8vw,5.5rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-pine">
            Our Story
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink-soft md:text-base">
            Scroll — the narrative holds still while the room changes around it.
          </p>
        </div>
      </header>

      <OurStoryScroll />
    </div>
  );
}
