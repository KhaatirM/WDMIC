"use client";

import { useEffect, useState } from "react";
import { nav, type SectionId } from "@/lib/site";
import { pageScroll, readScrollTarget } from "@/lib/page-scroll";

const ids = nav.map((item) => item.id);

export function useActiveSection() {
  const [scene, setScene] = useState<SectionId>("home");

  useEffect(() => {
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = visible?.target.id as SectionId | undefined;
        if (id && ids.includes(id)) {
          setScene(id);
          pageScroll.scene = id;
        }
      },
      { rootMargin: "-28% 0px -48% 0px", threshold: [0.12, 0.28, 0.5, 0.75] },
    );

    nodes.forEach((node) => io.observe(node));
    const syncHash = () => {
      const hash = window.location.hash.slice(1) as SectionId;
      if (ids.includes(hash)) setScene(hash);
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => {
      io.disconnect();
      window.removeEventListener("hashchange", syncHash);
    };
  }, []);

  return scene;
}

/** Keeps scroll progress + body theme in sync. The 3D world is the background. */
export function ScrollStage() {
  const scene = useActiveSection();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const onScroll = () => {
      readScrollTarget();
      if (reduced) pageScroll.p = pageScroll.target;
    };

    const tick = () => {
      readScrollTarget();
      frame = window.requestAnimationFrame(tick);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    frame = window.requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    document.body.dataset.scene = scene;
    document.body.dataset.onDark = "true";
    return () => {
      delete document.body.dataset.scene;
      delete document.body.dataset.onDark;
    };
  }, [scene]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[#080603]" />
    </div>
  );
}

export function BodyClass({ scene }: { scene: SectionId }) {
  useEffect(() => {
    document.body.dataset.scene = scene;
    document.body.dataset.onDark = "true";
  }, [scene]);
  return null;
}

/** Smooth-scroll to #hash on load and when the hash changes. */
export function HashScroller() {
  useEffect(() => {
    const go = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    go();
    window.addEventListener("hashchange", go);
    return () => window.removeEventListener("hashchange", go);
  }, []);
  return null;
}
