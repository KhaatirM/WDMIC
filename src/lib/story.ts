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
    line: "Charity — Halimah's Pantry, senior meals, the open table.",
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

/** Masjid fills the open gap opposite the copy. Y kept low so it never hits the footer. */
const path = [
  { p: 0, x: 50, y: 8, s: 0.95 },
  { p: 0.14, x: 6, y: 18, s: 0.88 },
  { p: 0.28, x: 52, y: 6, s: 0.92 },
  { p: 0.42, x: 4, y: 12, s: 0.9 },
  { p: 0.56, x: 50, y: 16, s: 0.88 },
  { p: 0.7, x: 54, y: 10, s: 0.92 },
  { p: 0.84, x: 6, y: 8, s: 0.9 },
  { p: 1, x: 48, y: 10, s: 0.9 },
];

function clamp(v: number, a = 0, b = 1) {
  return Math.min(b, Math.max(a, v));
}

function smoothstep(t: number) {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
}

export function pillarAt(progress: number) {
  const i = clamp(progress) * (pillars.length - 0.001);
  return pillars[Math.floor(i)] ?? pillars[0];
}

export function theaterPose(progress: number, mobile = false) {
  const t = clamp(progress);
  if (mobile) {
    return {
      x: 10 + Math.sin(t * Math.PI) * 16,
      y: 6 + (1 - Math.cos(t * Math.PI * 2)) * 4,
      s: 0.7,
    };
  }

  let i = 0;
  while (i < path.length - 1 && path[i + 1].p < t) i += 1;
  const a = path[i];
  const b = path[Math.min(i + 1, path.length - 1)];
  const span = b.p - a.p || 1;
  const e = smoothstep((t - a.p) / span);
  return {
    x: a.x + (b.x - a.x) * e,
    y: a.y + (b.y - a.y) * e,
    s: a.s + (b.s - a.s) * e,
  };
}
