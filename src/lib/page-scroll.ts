import type { SectionId } from "@/lib/site";

export const pageScroll = {
  target: 0,
  p: 0,
  scene: "home" as SectionId,
};

export function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

export function readScrollTarget() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  pageScroll.target = max > 0 ? window.scrollY / max : 0;
}
