import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/dates";
import { resolveJumahStreamUrl, site } from "@/lib/site";
import { readingMinutes } from "@/lib/story";
import { HashScroller, ScrollStage } from "@/components/scroll-stage";
import { HeroInvite } from "@/components/hero-invite";
import { ContactHospitality } from "@/components/contact-hospitality";
import type { StageData } from "@/components/stage-scenes";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const params = await searchParams;
  const [announcements, jumahServices, events, journal] = await Promise.all([
    prisma.announcement.findMany({
      where: { published: true },
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    }),
    prisma.jumahService.findMany({
      where: { published: true },
      orderBy: { serviceDate: "asc" },
    }),
    prisma.event.findMany({
      where: { published: true },
      orderBy: { startsAt: "asc" },
    }),
    prisma.journalIssue.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
    }),
  ]);

  const nextJumah = jumahServices[0];

  const stageData: StageData = {
    announcements: announcements.slice(0, 4).map((item) => ({
      id: item.id,
      title: item.title,
      body: item.body,
      kind: item.kind,
      pinned: item.pinned,
      dateLabel: formatDate(item.createdAt, { weekday: undefined }),
    })),
    events: events.slice(0, 4).map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      location: item.location,
      category: item.category,
      dateLabel: formatDate(item.startsAt, { weekday: undefined, year: undefined }),
    })),
    jumah: nextJumah
      ? {
          khutbahTitle: nextJumah.khutbahTitle,
          imam: nextJumah.imam,
          streamUrl: resolveJumahStreamUrl(nextJumah.zoomUrl),
          dateLabel: formatDate(nextJumah.serviceDate, { year: undefined }),
        }
      : null,
    journal: journal.slice(0, 3).map((item) => ({
      id: item.id,
      title: item.title,
      issueLabel: item.issueLabel,
      excerpt: item.excerpt,
      readMinutes: readingMinutes(item.body || item.excerpt),
      dateLabel: formatDate(item.publishedAt, { weekday: undefined }),
    })),
  };

  return (
    <div className="bg-pine-deep text-ink">
      <HashScroller />
      <HeroInvite nextJumah={nextJumah?.startsAt || site.jumah.time} />
      <ScrollStage data={stageData} />
      <ContactHospitality
        sent={params.sent}
        error={params.error}
        returnTo="/#contact"
      />
    </div>
  );
}
