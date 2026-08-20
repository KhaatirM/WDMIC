"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { pageScroll } from "@/lib/page-scroll";
import { pillarAt } from "@/lib/story";

const firstPillar = pillarAt(0);

const StoryScene = dynamic(
  () => import("@/components/story-scene").then((m) => m.StoryScene),
  {
    ssr: false,
    loading: () => <div className="h-full w-full bg-[#0c0a07]" />,
  },
);

export function PinnedTheater() {
  const word = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLParagraphElement>(null);
  const [label, setLabel] = useState(firstPillar);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      const pillar = pillarAt(pageScroll.p);
      if (word.current && word.current.textContent !== pillar.name) {
        word.current.textContent = pillar.name;
        setLabel(pillar);
      }
      if (line.current && line.current.textContent !== pillar.line) {
        line.current.textContent = pillar.line;
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <aside className="world-stage" aria-hidden>
      <div className="world-canvas">
        <StoryScene />
      </div>
      <div className="world-vignette" />
      <div ref={word} className="world-word">
        {label.name}
      </div>
      <p ref={line} className="world-line">
        {label.line}
      </p>
    </aside>
  );
}
