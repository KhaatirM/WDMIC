import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { site } from "@/lib/site";
import { media } from "@/lib/media";
import { formatDate } from "@/lib/dates";
import { HashScroller } from "@/components/scroll-stage";
import { HeroInvite } from "@/components/hero-invite";
import { Reveal } from "@/components/reveal";
import { sendContact } from "@/app/contact/actions";

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
    <div className="bg-ivory text-ink">
      <HashScroller />
      <HeroInvite />

      <section
        id="jumah"
        className="invite-section grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
      >
        <Reveal from="up" className="order-2 lg:order-1">
          <p className="text-xs uppercase tracking-[0.32em] text-gold">Friday congregation</p>
          <h2 className="mt-4 font-display text-4xl leading-[0.95] text-pine md:text-6xl">
            Come this Friday
          </h2>
          <p className="mt-5 text-lg text-ink-soft">
            {site.jumah.time} · {site.jumah.language}. Visitors are welcome.
          </p>
          {nextJumah ? (
            <p className="mt-8 font-display text-2xl text-pine md:text-3xl">
              {nextJumah.khutbahTitle}
            </p>
          ) : null}
          <p className="mt-3 text-sm text-ink-soft">{site.jumah.imam}</p>
          <Link
            href="/jumah"
            className="mt-8 inline-flex text-sm font-medium text-pine underline decoration-gold/50 underline-offset-4 transition-colors hover:decoration-gold"
          >
            Jum&apos;ah details →
          </Link>
        </Reveal>
        <Reveal from="fade" className="order-1 lg:order-2">
          <div className="invite-photo">
            <Image
              src={media.jumah.src}
              alt={media.jumah.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </section>

      <section
        id="outreach"
        className="invite-section invite-section-mist grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
      >
        <Reveal from="fade">
          <div className="invite-photo">
            <Image
              src={media.pantry.src}
              alt={media.pantry.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <Reveal from="up">
          <p className="text-xs uppercase tracking-[0.32em] text-gold">Service</p>
          <h2 className="mt-4 font-display text-4xl leading-[0.95] text-pine md:text-6xl">
            From a little, much.
          </h2>
          <p className="mt-5 text-lg text-ink-soft">
            Halimah&apos;s Pantry. Senior meals five days a week. A garden for East Greensboro —
            care that shares the same address as prayer.
          </p>
          <Link
            href="/volunteer"
            className="mt-8 inline-flex rounded-full bg-pine px-6 py-3 text-sm font-medium text-ivory transition-transform hover:scale-[1.02]"
          >
            Volunteer with us
          </Link>
        </Reveal>
      </section>

      <section className="invite-section relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 opacity-[0.07]"
        >
          <Image
            src="/arabic-calligraphy.svg"
            alt=""
            fill
            sizes="28rem"
            className="object-contain"
          />
        </div>
        <Reveal from="up" className="relative mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-gold">Our story</p>
          <h2 className="mt-4 font-display text-4xl leading-[0.95] text-pine md:text-6xl">
            Named for a teacher of this community.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-ink-soft">
            {site.name} opened in {site.established} as masjid and table — Islamic identity,
            welcome, and a public pledge of service in East Greensboro.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-flex text-sm font-medium text-pine underline decoration-gold/50 underline-offset-4 hover:decoration-gold"
          >
            Read our story →
          </Link>
        </Reveal>
      </section>

      <section className="invite-section invite-section-mist">
        <Reveal from="up" className="mx-auto max-w-5xl">
          <p className="text-xs uppercase tracking-[0.32em] text-gold">This week</p>
          <h2 className="mt-4 font-display text-4xl leading-[0.95] text-pine md:text-5xl">
            What&apos;s happening at the Center
          </h2>

          <div className="mt-12 grid gap-10 md:grid-cols-3">
            <article id="events" className="scroll-mt-28">
              <p className="text-[11px] uppercase tracking-[0.28em] text-ink-soft">Events</p>
              <h3 className="mt-3 font-display text-2xl text-pine md:text-3xl">
                {nextEvent ? nextEvent.title : "Programs & gatherings"}
              </h3>
              {nextEvent ? (
                <>
                  <p className="mt-3 text-ink-soft">{nextEvent.summary}</p>
                  <p className="mt-4 text-sm text-gold">
                    {formatDate(nextEvent.startsAt)} · {nextEvent.location}
                  </p>
                </>
              ) : (
                <p className="mt-3 text-ink-soft">Check back for upcoming programs.</p>
              )}
              <Link href="/events" className="mt-5 inline-block text-sm text-pine underline underline-offset-4">
                Full calendar →
              </Link>
            </article>

            <article id="announcements" className="scroll-mt-28">
              <p className="text-[11px] uppercase tracking-[0.28em] text-ink-soft">
                From the office
              </p>
              <h3 className="mt-3 font-display text-2xl text-pine md:text-3xl">
                {latestNote ? latestNote.title : "Announcements"}
              </h3>
              {latestNote ? (
                <p className="mt-3 line-clamp-4 text-ink-soft">{latestNote.body}</p>
              ) : (
                <p className="mt-3 text-ink-soft">No announcements right now.</p>
              )}
              <Link
                href="/announcements"
                className="mt-5 inline-block text-sm text-pine underline underline-offset-4"
              >
                All notes →
              </Link>
            </article>

            <article id="journal" className="scroll-mt-28">
              <p className="text-[11px] uppercase tracking-[0.28em] text-ink-soft">
                Muslim Journal
              </p>
              <h3 className="mt-3 font-display text-2xl text-pine md:text-3xl">
                {latestJournal ? latestJournal.title : "Community writing"}
              </h3>
              {latestJournal ? (
                <p className="mt-3 text-ink-soft">{latestJournal.excerpt}</p>
              ) : (
                <p className="mt-3 text-ink-soft">Stories from the Friday table.</p>
              )}
              <Link href="/journal" className="mt-5 inline-block text-sm text-pine underline underline-offset-4">
                Read more →
              </Link>
            </article>
          </div>
        </Reveal>
      </section>

      <section id="contact" className="invite-section grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal from="up">
          <p className="text-xs uppercase tracking-[0.32em] text-gold">Get in touch</p>
          <h2 className="mt-4 font-display text-4xl leading-[0.95] text-pine md:text-6xl">
            Find us on Bessemer.
          </h2>
          <p className="mt-5 text-lg text-ink-soft">
            {site.address.full}
            <br />
            <a href={site.phoneHref} className="text-pine hover:underline">
              {site.phone}
            </a>
            {" · "}
            <a href={`mailto:${site.emails.info}`} className="text-pine hover:underline">
              {site.emails.info}
            </a>
          </p>
          <p className="mt-4 text-sm text-ink-soft">Office hours: {site.hours}</p>
          <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={media.gathering.src}
              alt={media.gathering.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal from="up">
          <form action={sendContact} className="rounded-3xl border border-pine/10 bg-white p-6 shadow-sm md:p-8">
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
            <label className="block text-sm text-ink">
              Name
              <input
                required
                name="name"
                className="mt-1 w-full rounded-xl border border-pine/15 px-3 py-2.5"
              />
            </label>
            <label className="mt-4 block text-sm text-ink">
              Email
              <input
                required
                type="email"
                name="email"
                className="mt-1 w-full rounded-xl border border-pine/15 px-3 py-2.5"
              />
            </label>
            <label className="mt-4 block text-sm text-ink">
              Attention
              <select name="attention" className="mt-1 w-full rounded-xl border border-pine/15 px-3 py-2.5">
                <option>Imam</option>
                <option>Board of Directors</option>
                <option>Halimah&apos;s Pantry</option>
                <option>Other</option>
              </select>
            </label>
            <label className="mt-4 block text-sm text-ink">
              How can we help?
              <textarea
                required
                name="message"
                rows={4}
                className="mt-1 w-full rounded-xl border border-pine/15 px-3 py-2.5"
              />
            </label>
            <button
              type="submit"
              className="mt-6 rounded-full bg-pine px-6 py-3 text-sm font-medium text-ivory"
            >
              Send message
            </button>
          </form>
        </Reveal>
      </section>
    </div>
  );
}
