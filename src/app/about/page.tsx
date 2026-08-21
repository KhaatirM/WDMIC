import type { Metadata } from "next";
import { OurStoryScroll } from "@/components/our-story-scroll";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Story",
  description: `The story of ${site.name} — worship, service, and belonging in East Greensboro since ${site.established}.`,
};

export default function AboutPage() {
  return (
    <div className="bg-black">
      <header className="border-b border-white/5 bg-black px-5 pb-10 pt-28 md:px-10 md:pt-32">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-medium uppercase tracking-[0.48em] text-white/35">
            About · {site.shortName}
          </p>
          <h1 className="mt-5 bg-gradient-to-b from-white to-white/40 bg-clip-text font-display text-[clamp(2.75rem,8vw,5.5rem)] font-bold leading-[0.9] tracking-[-0.05em] text-transparent">
            Our Story
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed tracking-[0.06em] text-white/40 md:text-base">
            Scroll — the narrative holds still while the room changes around it.
          </p>
        </div>
      </header>

      <OurStoryScroll />
    </div>
  );
}
