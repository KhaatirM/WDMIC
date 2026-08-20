import type { ReactNode } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/dates";
import { HashScroller, ScrollStage } from "@/components/scroll-stage";
import { PinnedTheater } from "@/components/pinned-theater";
import { Reveal } from "@/components/reveal";
import { sendContact } from "@/app/contact/actions";
import { HeartHandshake, Leaf, Users } from "lucide-react";

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
  const nextEvent = events[0];
  const latestNote = announcements[0];
  const latestJournal = journal[0];

  return (
    <div className="story-shell text-ivory">
      <ScrollStage />
      <HashScroller />
      <PinnedTheater />

      <div className="story-col">
        <section id="home" className="page-section slot-left">
          <Reveal from="left" className="story-copy">
            <p className="text-xs uppercase tracking-[0.4em] text-gold-soft">
              Greensboro · Est. {site.established}
            </p>
            <h1 className="mt-6 font-display text-6xl leading-[0.86] md:text-8xl">
              A masjid that feels warm before you arrive.
            </h1>
            <p className="mt-6 max-w-sm text-lg text-ivory/70">
              Scroll, and the light fills — the way Friday fills this room.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#jumah" className="rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-pine-deep">
                Friday · {site.jumah.time}
              </a>
              <a href="#outreach" className="rounded-full border border-ivory/25 px-5 py-2.5 text-sm">
                Halimah&apos;s Pantry
              </a>
            </div>
            <p className="mt-8 text-sm text-ivory/45">{site.address.full}</p>
            <div className="mt-10 flex flex-col gap-3">
              <StatCard icon={<Users size={16} />} label="Masjid" value="Open to visitors" />
              <StatCard icon={<HeartHandshake size={16} />} label="Pantry" value="Food, clothing, care" />
              <StatCard icon={<Leaf size={16} />} label="Seniors" value="Meals, five days a week" />
            </div>
          </Reveal>
        </section>

        <section id="about" className="page-section slot-top-right">
          <Reveal from="right" className="story-copy">
            <p className="text-xs uppercase tracking-[0.32em] text-gold-soft">Our story</p>
            <h2 className="mt-5 font-display text-5xl leading-[0.9] md:text-7xl">
              Named for a teacher of this community.
            </h2>
            <p className="mt-6 text-lg text-ivory/70">
              {site.name} opened in {site.established} as masjid and table — Islamic
              identity, welcome, and a public pledge of service in East Greensboro.
            </p>
          </Reveal>
        </section>

        <section id="jumah" className="page-section slot-bottom-left">
          <Reveal from="up" className="story-copy">
            <p className="text-xs uppercase tracking-[0.32em] text-gold-soft">Friday congregation</p>
            <h2 className="mt-5 font-display text-6xl leading-[0.88] md:text-8xl">
              {site.jumah.time}
            </h2>
            <p className="mt-4 text-xl text-ivory/80">English khutbah. Visitors welcome.</p>
            {nextJumah ? (
              <p className="mt-8 font-display text-3xl text-gold-soft">{nextJumah.khutbahTitle}</p>
            ) : null}
            <p className="mt-3 text-sm text-ivory/55">{site.jumah.imam}</p>
          </Reveal>
        </section>

        <section id="events" className="page-section slot-right">
          <Reveal from="right" className="story-copy">
            <p className="text-xs uppercase tracking-[0.32em] text-gold-soft">Calendar</p>
            <h2 className="mt-5 font-display text-5xl leading-[0.9] md:text-7xl">
              {nextEvent ? nextEvent.title : "Events & programs"}
            </h2>
            {nextEvent ? (
              <>
                <p className="mt-5 text-lg text-ivory/70">{nextEvent.summary}</p>
                <p className="mt-4 text-sm text-gold-soft">
                  {formatDate(nextEvent.startsAt)} · {nextEvent.location}
                </p>
              </>
            ) : null}
          </Reveal>
        </section>

        <section id="announcements" className="page-section slot-top-left">
          <Reveal from="left" className="story-copy">
            <p className="text-xs uppercase tracking-[0.32em] text-gold-soft">From the office</p>
            <h2 className="mt-5 font-display text-5xl leading-[0.9] md:text-7xl">
              {latestNote ? latestNote.title : "Announcements"}
            </h2>
            {latestNote ? (
              <p className="mt-6 text-lg text-ivory/70 line-clamp-5">{latestNote.body}</p>
            ) : null}
          </Reveal>
        </section>

        <section id="journal" className="page-section slot-center">
          <Reveal from="fade" className="story-copy story-copy-center">
            <p className="text-xs uppercase tracking-[0.32em] text-gold-soft">Muslim Journal</p>
            <h2 className="mt-5 font-display text-5xl leading-[0.9] md:text-7xl">
              {latestJournal ? latestJournal.title : "Community writing"}
            </h2>
            {latestJournal ? (
              <p className="mt-6 text-lg text-ivory/70">{latestJournal.excerpt}</p>
            ) : null}
          </Reveal>
        </section>

        <section id="outreach" className="page-section slot-bottom-right">
          <Reveal from="up" className="story-copy">
            <p className="text-xs uppercase tracking-[0.32em] text-gold-soft">Service</p>
            <h2 className="mt-5 font-display text-5xl leading-[0.9] md:text-7xl">
              From a little, much.
            </h2>
            <p className="mt-6 text-lg text-ivory/70">
              Halimah&apos;s Pantry. Senior meals. A garden for East Greensboro.
            </p>
            <Link href="/volunteer" className="mt-8 inline-block text-gold-soft">
              Volunteer with us →
            </Link>
          </Reveal>
        </section>

        <section id="contact" className="page-section slot-left">
          <Reveal from="left" className="story-copy">
            <p className="text-xs uppercase tracking-[0.32em] text-gold-soft">Get in touch</p>
            <h2 className="mt-5 font-display text-5xl leading-[0.9] md:text-7xl">
              The door is on Bessemer.
            </h2>
            <p className="mt-4 text-ivory/70">
              {site.address.full}
              <br />
              {site.phone} · {site.emails.info}
            </p>
            <form action={sendContact} className="panel mt-8 rounded-3xl p-6 text-ink">
              {params.sent ? (
                <p className="mb-4 rounded-xl bg-pine/10 px-3 py-2 text-sm text-pine">
                  Message received. Someone will reach out soon, in sha Allah.
                </p>
              ) : null}
              {params.error ? (
                <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">
                  Please check the fields and try again.
                </p>
              ) : null}
              <label className="block text-sm">
                Name
                <input required name="name" className="mt-1 w-full rounded-xl border border-pine/15 px-3 py-2" />
              </label>
              <label className="mt-3 block text-sm">
                Email
                <input required type="email" name="email" className="mt-1 w-full rounded-xl border border-pine/15 px-3 py-2" />
              </label>
              <label className="mt-3 block text-sm">
                Attention
                <select name="attention" className="mt-1 w-full rounded-xl border border-pine/15 px-3 py-2">
                  <option>Imam</option>
                  <option>Board of Directors</option>
                  <option>Halimah&apos;s Pantry</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="mt-3 block text-sm">
                How can we help?
                <textarea required name="message" rows={3} className="mt-1 w-full rounded-xl border border-pine/15 px-3 py-2" />
              </label>
              <button type="submit" className="mt-5 rounded-full bg-pine px-5 py-2.5 text-sm text-ivory">
                Send message
              </button>
            </form>
          </Reveal>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="grid h-9 w-9 place-items-center rounded-full bg-gold text-pine-deep">
        {icon}
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-ivory/45">{label}</p>
        <p className="font-display text-xl leading-tight">{value}</p>
      </div>
    </div>
  );
}
