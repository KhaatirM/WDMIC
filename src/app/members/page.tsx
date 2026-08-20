import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/app/login/actions";
import Link from "next/link";
import { formatDate } from "@/lib/dates";

export default async function MembersPage() {
  const session = await auth();
  const documents = await prisma.memberDocument.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-gold">Member hub</p>
          <h1 className="mt-3 font-display text-4xl">
            As-salaamu alaikum, {session?.user?.name}
          </h1>
          <p className="mt-2 text-ink-soft">
            This area holds operational notes that should not sit on the public homepage.
            Keep personal contact lists offline.
          </p>
        </div>
        <div className="flex gap-2">
          {session?.user?.role === "ADMIN" ? (
            <Link href="/admin" className="rounded-full bg-gold px-4 py-2 text-sm text-pine-deep">
              Admin
            </Link>
          ) : null}
          <form action={logoutAction}>
            <button className="rounded-full border border-pine/20 px-4 py-2 text-sm">
              Sign out
            </button>
          </form>
        </div>
      </div>
      <div className="mt-10 space-y-5">
        {documents.map((doc) => (
          <article key={doc.id} className="rounded-3xl bg-white p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-gold">
              {doc.category} · {formatDate(doc.createdAt)}
            </p>
            <h2 className="mt-2 font-display text-3xl">{doc.title}</h2>
            <p className="mt-2 text-sm text-ink-soft">{doc.summary}</p>
            <p className="mt-4 whitespace-pre-wrap text-ink-soft">{doc.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
