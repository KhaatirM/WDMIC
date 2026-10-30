/**
 * Swappable photo slots for the site.
 * Replace `src` with paths under /public/media/ when real Center photos arrive.
 */
export type MediaSlot = {
  src: string;
  alt: string;
};

export const media = {
  hero: {
    src: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=2400&q=80",
    alt: "Warm light filling a mosque prayer hall",
  },
  jumah: {
    src: "https://images.unsplash.com/photo-1564769625392-651b89c6db66?auto=format&fit=crop&w=1600&q=80",
    alt: "Soft daylight across a prayer space",
  },
  pantry: {
    src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1600&q=80",
    alt: "Neighbors sharing food at a community table",
  },
  gathering: {
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
    alt: "Friends gathered in warm afternoon light",
  },
  story: {
    src: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1600&q=80",
    alt: "Morning light opening over a quiet horizon",
  },
} as const satisfies Record<string, MediaSlot>;

export type MediaKey = keyof typeof media;
