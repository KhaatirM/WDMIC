/**
 * Jumu'ah live stream (YouTube). Single source of truth for every "Watch on YouTube" button.
 * Canonical channel URL for W.D. Mohammed Islamic Center.
 */
export const JUMAH_YOUTUBE_URL =
  "https://www.youtube.com/@WDMohammedIslamicCenter";

/**
 * YouTube channel ID (UC…) for @WDMohammedIslamicCenter — resolved from the channel page's
 * canonical URL (https://www.youtube.com/channel/UCWra-CY2Ge_5_Yn3C9rHcPQ).
 * Used for the always-current live embed; never a fixed video ID.
 */
export const JUMAH_YOUTUBE_CHANNEL_ID = "UCWra-CY2Ge_5_Yn3C9rHcPQ";

/** Privacy-enhanced embed of whatever the channel is streaming right now. */
export const JUMAH_YOUTUBE_EMBED_URL = `https://www.youtube-nocookie.com/embed/live_stream?channel=${JUMAH_YOUTUBE_CHANNEL_ID}&rel=0&modestbranding=1&playsinline=1`;

export const site = {
  name: "W.D. Mohammed Islamic Center",
  shortName: "WDMIC",
  tagline: "Worship, service, and community in East Greensboro.",
  established: 2018,
  address: {
    street: "3015 E. Bessemer Ave.",
    city: "Greensboro",
    state: "NC",
    zip: "27405",
    full: "3015 E. Bessemer Ave., Greensboro, NC 27405",
  },
  phone: "(336) 285-5992",
  phoneHref: "tel:+13362855992",
  emails: {
    info: "info@wdmic.org",
    business: "business@wdmic.org",
  },
  hours: "Mon–Fri, 8:00 AM – 5:00 PM",
  jumah: {
    time: "1:30 PM EST",
    language: "English Khutbah",
    imam: "Imam Dr. Abdel J. Nuriddin, N.D., Ph.D.",
    doorsOpen: "1:00 PM",
    /** Public channel URL — "Open on YouTube" fallback. */
    streamUrl: JUMAH_YOUTUBE_URL,
    /** Channel ID powering the on-site live embed (`/jumah#live`). */
    youtubeChannelId: JUMAH_YOUTUBE_CHANNEL_ID,
    /** Privacy-enhanced live embed URL for the channel's current stream. */
    embedUrl: JUMAH_YOUTUBE_EMBED_URL,
    /** On-site deep link to the live player. */
    watchPath: "/jumah#live",
    streamLabel: "YouTube Live",
    /** Short format description shown in chips and specs. */
    format: "In-Person & YouTube Live",
  },
  programs: {
    /** Canonical Halimah's Pantry schedule — consume this everywhere; do not re-type hours. */
    pantry: {
      name: "Halimah's Pantry",
      days: "Tuesday–Thursday",
      /** Compact day range for tight UI (stat tiles, metrics). */
      daysShort: "Tue–Thu",
      time: "12:00–1:00 PM EST",
      hours: "Tuesday–Thursday · 12:00–1:00 PM EST",
      /** Compact form for tight UI. */
      hoursShort: "Tue–Thu · 12–1 PM EST",
    },
  },
  mapsQuery: "3015+E+Bessemer+Ave+Greensboro+NC+27405",
  ein: "46-5053181",
};

/** Weekly program hours list (contact section), derived from the canonical values above. */
export const weeklyPrograms = [
  {
    name: "Jumu'ah",
    detail: `Fridays · ${site.jumah.time} · ${site.jumah.language}`,
  },
  { name: site.programs.pantry.name, detail: site.programs.pantry.hours },
] as const;

/**
 * Public stream URL: prefers an admin-entered YouTube link on the Jumu'ah service,
 * otherwise the canonical `site.jumah.streamUrl`. Legacy non-YouTube links are ignored.
 */
export function resolveJumahStreamUrl(serviceUrl?: string | null): string {
  const candidate = serviceUrl?.trim();
  if (candidate && /^https?:\/\/(www\.|m\.)?(youtube\.com|youtu\.be)\//i.test(candidate)) {
    return candidate;
  }
  return site.jumah.streamUrl;
}

export const nav = [
  { id: "home", href: "/#home", label: "Home" },
  { id: "about", href: "/#about", label: "About" },
  { id: "jumah", href: "/#jumah", label: "Jumu'ah" },
  { id: "events", href: "/events", label: "Events" },
  { id: "announcements", href: "/#announcements", label: "Announcements" },
  { id: "journal", href: "/#journal", label: "Journal" },
  { id: "outreach", href: "/#outreach", label: "Outreach" },
  { id: "contact", href: "/#contact", label: "Contact" },
] as const;

export type SectionId = (typeof nav)[number]["id"];
