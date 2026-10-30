"use client";

import { useEffect, useState } from "react";
import { nav, type SectionId } from "@/lib/site";

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
