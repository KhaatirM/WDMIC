"use client";

import dynamic from "next/dynamic";

const StoryScene = dynamic(
  () => import("@/components/story-scene").then((m) => m.StoryScene),
  {
    ssr: false,
    loading: () => (
      <div className="relative z-[2] h-[340vh] w-full bg-black" aria-hidden>
        <div className="sticky top-0 h-svh w-full bg-black" />
      </div>
    ),
  },
);

/** Sticky scroll theater — product-reveal stage driven by StoryScene. */
export function PinnedTheater() {
  return <StoryScene />;
}
