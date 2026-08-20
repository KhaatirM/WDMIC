"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type MouseEvent } from "react";
import { Menu, X } from "lucide-react";
import { nav, site } from "@/lib/site";
import { useActiveSection } from "@/components/scroll-stage";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const scene = useActiveSection();
  const hideChrome = pathname.startsWith("/admin");

  if (hideChrome) return null;

  const onHome = pathname === "/";

  const goTo = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    setOpen(false);
    if (!onHome || !href.startsWith("/#")) return;
    event.preventDefault();
    const id = href.slice(2);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", href);
  };

  return (
    <header className="site-header sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/#home" className="flex items-center gap-3" onClick={(event) => goTo(event, "/#home")}>
          <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/50 bg-pine text-gold-soft shadow-[0_0_24px_rgba(201,164,74,0.25)]">
            <span className="font-display text-lg leading-none">و</span>
          </span>
          <span>
            <span className="block font-display text-lg leading-none">{site.shortName}</span>
            <span className="block text-[11px] uppercase tracking-[0.18em] opacity-70">
              Greensboro
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-4 xl:flex">
          {nav.map((item) => {
            const active = onHome && scene === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={(event) => goTo(event, item.href)}
                className={`text-[13px] tracking-wide transition-colors ${
                  active ? "font-medium text-gold" : "opacity-80 hover:opacity-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <Link
            href="/donate"
            className="rounded-full border border-gold/40 bg-gold px-4 py-2 text-sm font-medium text-pine-deep"
          >
            Donate
          </Link>
          <Link href="/login" className="rounded-full border px-4 py-2 text-sm header-ghost">
            Member login
          </Link>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full border xl:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open ? (
        <div className="border-t px-4 py-4 xl:hidden">
          <div className="flex flex-col gap-3">
            {nav.map((item) => (
              <Link key={item.id} href={item.href} onClick={(event) => goTo(event, item.href)}>
                {item.label}
              </Link>
            ))}
            <Link href="/donate" onClick={() => setOpen(false)}>
              Donate
            </Link>
            <Link href="/login" onClick={() => setOpen(false)}>
              Member login
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
