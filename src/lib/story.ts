import { media } from "@/lib/media";
import { site } from "@/lib/site";

export const pillars = [
  {
    name: "Shahadah",
    line: "Faith — there is no god but God, and Muhammad is His messenger.",
  },
  {
    name: "Salah",
    line: "Prayer — five times a day, and Jumu'ah that gathers Greensboro.",
  },
  {
    name: "Zakat",
    line: "Charity — Halimah's Pantry, the garden, the open table.",
  },
  {
    name: "Sawm",
    line: "Fasting — Ramadan, when this Center first fed the neighborhood.",
  },
  {
    name: "Hajj",
    line: "Pilgrimage — the journey home, and the door on Bessemer Avenue.",
  },
] as const;

export type SceneId =
  | "about"
  | "jumah"
  | "announcements"
  | "journal"
  | "outreach"
  | "contact";

export type StageSide = "left" | "right";
export type LightKey = "gold" | "pine" | "ivory";

export const lightColors: Record<LightKey, string> = {
  gold: "rgba(201,164,74,0.16)",
  pine: "rgba(22,68,52,0.24)",
  ivory: "rgba(255,248,231,0.08)",
};

type LightPose = { x: number; y: number; scale: number; intensity: number };

type SceneDef = {
  id: SceneId;
  eyebrow: string;
  headline: string;
  body: string;
  side: StageSide;
  light: Record<LightKey, LightPose>;
  mediaKey: keyof typeof media;
};

const goldBias = (x: number, y: number): Record<LightKey, LightPose> => ({
  gold: { x, y, scale: 1.05, intensity: 1 },
  pine: { x: 100 - x, y: 100 - y, scale: 0.9, intensity: 0.7 },
  ivory: { x: 50, y: 30, scale: 0.7, intensity: 0.45 },
});

const pineBias = (x: number, y: number): Record<LightKey, LightPose> => ({
  pine: { x, y, scale: 1.1, intensity: 1 },
  gold: { x: 100 - x, y: y * 0.6, scale: 0.85, intensity: 0.65 },
  ivory: { x: 40, y: 70, scale: 0.65, intensity: 0.4 },
});

const ivoryBias = (x: number, y: number): Record<LightKey, LightPose> => ({
  ivory: { x, y, scale: 1, intensity: 0.9 },
  gold: { x: 70, y: 25, scale: 0.8, intensity: 0.7 },
  pine: { x: 20, y: 75, scale: 0.85, intensity: 0.55 },
});

export const scenes: Record<SceneId, SceneDef> = {
  about: {
    id: "about",
    eyebrow: "Our story",
    headline: "Named for a teacher of this community.",
    body: `${site.name} opened in ${site.established} as masjid and table — Islamic identity, welcome, and a public pledge of service in East Greensboro.`,
    side: "right",
    light: goldBias(72, 38),
    mediaKey: "story",
  },
  jumah: {
    id: "jumah",
    eyebrow: "Friday congregation",
    headline: "Come this Friday",
    body: `${site.jumah.time} · ${site.jumah.language}. Visitors are welcome — the door on Bessemer stays open.`,
    side: "left",
    light: pineBias(28, 42),
    mediaKey: "jumah",
  },
  announcements: {
    id: "announcements",
    eyebrow: "From the office",
    headline: "Notes that keep the Center moving.",
    body: "Pinned bulletins, schedule shifts, and community reminders — clarity without the noise.",
    side: "right",
    light: ivoryBias(68, 35),
    mediaKey: "gathering",
  },
  journal: {
    id: "journal",
    eyebrow: "Muslim Journal",
    headline: "Stories from the Friday table.",
    body: "Community writing that holds memory, gratitude, and the quiet work of belonging.",
    side: "left",
    light: goldBias(30, 40),
    mediaKey: "story",
  },
  outreach: {
    id: "outreach",
    eyebrow: "Service",
    headline: "From a little, much.",
    body: `Halimah's Pantry, ${site.programs.pantry.hours}. A garden for East Greensboro — care that shares the same address as prayer.`,
    side: "right",
    light: pineBias(74, 48),
    mediaKey: "pantry",
  },
  contact: {
    id: "contact",
    eyebrow: "Get in touch",
    headline: "Find us on Bessemer.",
    body: `${site.address.full}. Office hours: ${site.hours}.`,
    side: "left",
    light: goldBias(26, 55),
    mediaKey: "hero",
  },
};

/* -------------------------------------------------------------------------- */
/*  Stage-scene composition data                                              */
/* -------------------------------------------------------------------------- */

export const aboutMilestones = [
  { id: "est", label: `Est. ${site.established} · East Greensboro` },
  { id: "legacy", label: "Legacy of Imam W.D. Mohammed" },
] as const;

export const jumahClock = {
  timeZone: "America/New_York",
  weekday: 5,
  hour: 13,
  minute: 30,
  sessionMinutes: 75,
} as const;

export const jumahSpecs = [
  { id: "time", label: "Khutbah Time", value: site.jumah.time },
  { id: "speaker", label: "Speaker", value: site.jumah.imam },
  { id: "format", label: "Format", value: site.jumah.format },
] as const;

export const journalFallback = {
  title: "Stories from the Friday table",
  issueLabel: "Community issue",
  excerpt:
    "East Greensboro writes its faith in meals, prayer, and the quiet work of belonging.",
  readMinutes: 4,
} as const;

export const journalSecondaryQuote =
  "A masjid that feels warm before you arrive.";

export function pullQuote(excerpt: string, max = 110) {
  const clean = excerpt.trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trimEnd()}…`;
}

export function readingMinutes(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export const outreachPrograms = {
  pantry: {
    name: "Halimah's Pantry",
    metric: "Open",
    metricLabel: "table",
    line: "Neighbors fed with dignity — same address as prayer.",
  },
  hours: {
    name: "Pantry hours",
    metric: site.programs.pantry.daysShort,
    metricLabel: site.programs.pantry.time,
    line: "Neighbors welcome, regardless of faith, gender, or race.",
  },
  garden: {
    name: "Community Garden",
    metric: "East",
    metricLabel: "Greensboro soil",
    line: "Grown for neighbors who share this block.",
  },
} as const;

export const outreachMetrics = [
  { id: "pantry", value: site.programs.pantry.daysShort, label: "Pantry distribution" },
  { id: "garden", value: "1", label: "Neighborhood garden" },
] as const;

export const mapLinks = {
  google: `https://www.google.com/maps/search/?api=1&query=${site.mapsQuery}`,
  apple: `https://maps.apple.com/?q=${site.mapsQuery}`,
} as const;

export function pillarAt(progress: number) {
  const i = Math.min(1, Math.max(0, progress)) * (pillars.length - 0.001);
  return pillars[Math.floor(i)] ?? pillars[0];
}
