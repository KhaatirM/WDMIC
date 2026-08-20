import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Volunteer" };

export default function VolunteerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <p className="text-xs uppercase tracking-[0.28em] text-gold">Give time</p>
      <h1 className="mt-3 font-display text-5xl">Volunteer with WDMIC</h1>
      <p className="mt-4 text-ink-soft">
        The Center runs on believers who pack pantry boxes, greet Friday guests, tend the
        garden, and help seniors. Tell us where you can serve and we will match you.
      </p>
      <ul className="mt-8 space-y-3 text-ink-soft">
        <li>Halimah&apos;s Pantry — packing, intake, clothing sorting</li>
        <li>Senior Nutrition — meal service and hospitality</li>
        <li>Garden crew — planting, watering, workshop help</li>
        <li>Jumu&apos;ah hospitality — ushers and visitor welcome</li>
        <li>Generation: Next — youth programs</li>
      </ul>
      <Link
        href="/#contact"
        className="mt-8 inline-block rounded-full bg-pine px-5 py-2.5 text-ivory"
      >
        Reach the office
      </Link>
    </div>
  );
}
