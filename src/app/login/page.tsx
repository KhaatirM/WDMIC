import type { Metadata } from "next";
import { loginAction } from "./actions";

export const metadata: Metadata = { title: "Member login" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <p className="text-xs uppercase tracking-[0.28em] text-gold">Members</p>
      <h1 className="mt-3 font-display text-4xl">Sign in to the hub</h1>
      <p className="mt-3 text-sm text-ink-soft">
        Members see volunteer notes and board packets. Administrators can publish
        announcements, Jumu&apos;ah, events, and journal issues.
      </p>
      <form action={loginAction} className="mt-8 rounded-3xl bg-white p-6">
        {params.error ? (
          <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">
            Email or password was not recognized.
          </p>
        ) : null}
        <input type="hidden" name="callbackUrl" value={params.callbackUrl ?? "/members"} />
        <label className="block text-sm">
          Email
          <input
            required
            type="email"
            name="email"
            className="mt-1 w-full rounded-xl border border-pine/15 px-3 py-2"
          />
        </label>
        <label className="mt-4 block text-sm">
          Password
          <input
            required
            type="password"
            name="password"
            className="mt-1 w-full rounded-xl border border-pine/15 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-pine py-2.5 text-sm text-ivory"
        >
          Enter
        </button>
        <p className="mt-4 text-xs text-ink-soft">
          Demo accounts after seed: admin@wdmic.org / WdmicAdmin2026! and
          member@wdmic.org / MemberDemo2026!
        </p>
      </form>
    </div>
  );
}
