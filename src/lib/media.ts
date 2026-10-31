/**
 * Swappable photo slots for the site.
 * Replace `src` with paths under /public/media/ when real Center photos arrive.
 *
 * Every remote host used here must be listed in next.config.ts `images.remotePatterns`.
 */
export type MediaSlot = {
  src: string;
  alt: string;
  /** CSS object-position for the focal point inside a cropped frame. */
  position?: string;
};

/**
 * Multi-stop warm fallback painted behind every stage photo, so a frame
 * is never an empty void while (or if) the image is unavailable.
 */
export const mediaFallback =
  "radial-gradient(120% 90% at 18% 8%, rgba(230,211,154,0.42) 0%, rgba(201,164,74,0.2) 28%, transparent 58%), " +
  "radial-gradient(90% 80% at 88% 96%, rgba(22,68,52,0.95) 0%, rgba(13,59,46,0.7) 42%, transparent 78%), " +
  "linear-gradient(155deg, #3a3017 0%, #14382b 46%, #0d3b2e 72%, #071912 100%)";

export const media = {
  hero: {
    src: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=2400&q=80",
    alt: "Warm light filling a mosque prayer hall",
  },
  about: {
    src: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1800&q=80",
    alt: "Arched mosque architecture glowing in warm light",
    position: "50% 40%",
  },
  jumah: {
    src: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1800&q=80",
    alt: "A warm, quiet prayer hall ready for Friday congregation",
    position: "50% 55%",
  },
  pantry: {
    src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1600&q=80",
    alt: "Neighbors sharing food at a community table",
    position: "50% 45%",
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
