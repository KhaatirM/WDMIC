import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Donate" };

export default function DonatePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <p className="text-xs uppercase tracking-[0.28em] text-gold">Sadaqah</p>
      <h1 className="mt-3 font-display text-5xl">Support the Center</h1>
      <p className="mt-4 text-ink-soft">
        {site.name} is a religious nonprofit eligible to receive tax-deductible
        contributions (EIN {site.ein}). Gifts keep the masjid, pantry, senior meals, and
        garden work going.
      </p>
      <div className="mt-8 rounded-3xl border border-gold/30 bg-white p-6">
        <h2 className="font-display text-3xl">How to give</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-soft">
          <li>In person at Friday Jumu&apos;ah or during office hours ({site.hours}).</li>
          <li>
            By mail to {site.address.full}. Please note the program in the memo line
            (masjid, pantry, seniors, garden).
          </li>
          <li>
            Email {site.emails.business} for campaign receipts, monthly giving, or
            stock/in-kind gifts.
          </li>
        </ul>
        <p className="mt-6 text-sm text-ink-soft">
          Online checkout can be wired later (PayPal, Stripe, or the Center&apos;s existing
          processor) without changing the rest of this site.
        </p>
      </div>
    </div>
  );
}
