import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/app/login/actions";
import Link from "next/link";
import {
  createAnnouncement,
  createEvent,
  createJournal,
  createJumah,
  createMemberDoc,
} from "./actions";
import { site } from "@/lib/site";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const [messages, announcements] = await Promise.all([
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.announcement.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return (
    <div className="min-h-screen bg-pine-deep text-ivory">
      <header className="border-b border-ivory/10 px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-gold-soft">Administration</p>
            <p className="font-display text-2xl">{site.shortName} hub</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-ivory/60">{session?.user?.email}</span>
            <Link href="/" className="text-gold-soft">
              View site
            </Link>
            <form action={logoutAction}>
              <button className="text-ivory/80">Sign out</button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-2">
        {params.saved ? (
          <p className="lg:col-span-2 rounded-2xl bg-gold/15 px-4 py-3 text-gold-soft">
            Saved: {params.saved}
          </p>
        ) : null}

        <section className="rounded-3xl bg-pine p-6">
          <h2 className="font-display text-2xl">New announcement</h2>
          <form action={createAnnouncement} className="mt-4 space-y-3 text-sm text-pine-deep">
            <input name="title" required placeholder="Title" className="w-full rounded-xl px-3 py-2" />
            <textarea name="body" required rows={4} placeholder="Body" className="w-full rounded-xl px-3 py-2" />
            <select name="kind" className="w-full rounded-xl px-3 py-2">
              <option value="GENERAL">General</option>
              <option value="URGENT">Urgent</option>
              <option value="PROGRAM">Program</option>
            </select>
            <label className="flex items-center gap-2 text-ivory">
              <input type="checkbox" name="pinned" /> Pin to top
            </label>
            <button className="rounded-full bg-gold px-4 py-2 text-pine-deep">Publish</button>
          </form>
          <ul className="mt-6 space-y-2 text-sm text-ivory/70">
            {announcements.map((a) => (
              <li key={a.id}>{a.title}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl bg-pine p-6">
          <h2 className="font-display text-2xl">Jumu&apos;ah service</h2>
          <form action={createJumah} className="mt-4 space-y-3 text-sm text-pine-deep">
            <input name="serviceDate" type="datetime-local" required className="w-full rounded-xl px-3 py-2" />
            <input name="khutbahTitle" required placeholder="Khutbah title" className="w-full rounded-xl px-3 py-2" />
            <input name="imam" defaultValue={site.jumah.imam} className="w-full rounded-xl px-3 py-2" />
            <input name="startsAt" defaultValue="1:30 PM EST" className="w-full rounded-xl px-3 py-2" />
            <input name="zoomUrl" placeholder="Zoom URL (optional)" className="w-full rounded-xl px-3 py-2" />
            <textarea name="notes" rows={3} placeholder="Notes" className="w-full rounded-xl px-3 py-2" />
            <button className="rounded-full bg-gold px-4 py-2 text-pine-deep">Add service</button>
          </form>
        </section>

        <section className="rounded-3xl bg-pine p-6">
          <h2 className="font-display text-2xl">Event</h2>
          <form action={createEvent} className="mt-4 space-y-3 text-sm text-pine-deep">
            <input name="title" required placeholder="Title" className="w-full rounded-xl px-3 py-2" />
            <input name="category" placeholder="Category" className="w-full rounded-xl px-3 py-2" />
            <input name="location" placeholder="Location" className="w-full rounded-xl px-3 py-2" />
            <input name="startsAt" type="datetime-local" required className="w-full rounded-xl px-3 py-2" />
            <input name="summary" required placeholder="Short summary" className="w-full rounded-xl px-3 py-2" />
            <textarea name="details" required rows={3} className="w-full rounded-xl px-3 py-2" />
            <button className="rounded-full bg-gold px-4 py-2 text-pine-deep">Add event</button>
          </form>
        </section>

        <section className="rounded-3xl bg-pine p-6">
          <h2 className="font-display text-2xl">Journal issue</h2>
          <form action={createJournal} className="mt-4 space-y-3 text-sm text-pine-deep">
            <input name="title" required placeholder="Title" className="w-full rounded-xl px-3 py-2" />
            <input name="issueLabel" required placeholder="Vol. 1, No. 3" className="w-full rounded-xl px-3 py-2" />
            <input name="excerpt" required placeholder="Excerpt" className="w-full rounded-xl px-3 py-2" />
            <textarea name="body" required rows={4} className="w-full rounded-xl px-3 py-2" />
            <button className="rounded-full bg-gold px-4 py-2 text-pine-deep">Publish issue</button>
          </form>
        </section>

        <section className="rounded-3xl bg-pine p-6">
          <h2 className="font-display text-2xl">Member document</h2>
          <form action={createMemberDoc} className="mt-4 space-y-3 text-sm text-pine-deep">
            <input name="title" required placeholder="Title" className="w-full rounded-xl px-3 py-2" />
            <input name="category" defaultValue="Operations" className="w-full rounded-xl px-3 py-2" />
            <input name="summary" required placeholder="Summary" className="w-full rounded-xl px-3 py-2" />
            <textarea name="body" required rows={4} className="w-full rounded-xl px-3 py-2" />
            <button className="rounded-full bg-gold px-4 py-2 text-pine-deep">Post to members</button>
          </form>
        </section>

        <section className="rounded-3xl bg-pine p-6">
          <h2 className="font-display text-2xl">Inbox</h2>
          <ul className="mt-4 space-y-3 text-sm text-ivory/75">
            {messages.length === 0 ? <li>No messages yet.</li> : null}
            {messages.map((m) => (
              <li key={m.id} className="rounded-2xl bg-pine-deep/50 p-3">
                <p className="text-gold-soft">
                  {m.name} → {m.attention}
                </p>
                <p className="text-xs">{m.email}</p>
                <p className="mt-2">{m.message}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
