import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/dates";
import { JumahBento } from "@/components/jumah-bento";

export const metadata: Metadata = {
  title: "Jumu'ah",
  description: `Friday congregation at ${site.name} — ${site.jumah.time}, English khutbah, visitors welcome.`,
};

export default async function JumahPage() {
  const next = await prisma.jumahService.findFirst({
    where: { published: true },
    orderBy: { serviceDate: "asc" },
  });

  return (
    <div className="min-h-full bg-black text-white">
      <header className="relative overflow-hidden border-b border-white/10 px-5 pb-14 pt-28 md:px-10 md:pt-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 20% 0%, rgba(201,164,74,0.12), transparent 45%), radial-gradient(ellipse at 80% 100%, rgba(255,255,255,0.04), transparent 40%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-[10px] font-medium uppercase tracking-[0.52em] text-white/40">
            Friday Congregation · {site.shortName}
          </p>
          <h1 className="mt-6 bg-gradient-to-b from-white to-white/35 bg-clip-text font-display text-[clamp(2.75rem,8vw,5.5rem)] font-bold leading-[0.88] tracking-[-0.055em] text-transparent">
            Jumu&apos;ah
          </h1>
          <p className="mt-7 max-w-xl text-sm leading-relaxed tracking-[0.08em] text-white/40 md:text-base md:tracking-[0.1em]">
            Times, place, and how to arrive — clear, warm, ready.
          </p>
        </div>
      </header>

      <JumahBento
        time={next?.startsAt ?? site.jumah.time}
        language={next?.language ?? site.jumah.language}
        imam={next?.imam ?? site.jumah.imam}
        khutbahTitle={next?.khutbahTitle}
        zoomUrl={next?.zoomUrl}
        notes={next?.notes}
        serviceLabel={next ? formatDate(next.serviceDate) : null}
      />
    </div>
  );
}
