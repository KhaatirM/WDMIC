import type { Metadata } from "next";
import { ContactHospitality } from "@/components/contact-hospitality";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Reach ${site.name} — ${site.address.full}. Phone ${site.phone}.`,
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-full bg-[#070b09]">
      <div className="border-b border-white/10 px-5 pb-10 pt-28 md:px-10 md:pt-32">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-medium uppercase tracking-[0.48em] text-gold-soft/80">
            Contact · {site.shortName}
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.75rem,8vw,5rem)] font-semibold leading-[0.9] tracking-[-0.05em] bg-gradient-to-b from-white via-[#fff8e7] to-[#c9a44a]/70 bg-clip-text text-transparent">
            Hospitality on Bessemer
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-ivory/50 md:text-base">
            Call, write, or visit — the office is open {site.hours}.
          </p>
        </div>
      </div>
      <ContactHospitality
        sent={params.sent}
        error={params.error}
        returnTo="/contact"
        id="contact-form"
      />
    </div>
  );
}
