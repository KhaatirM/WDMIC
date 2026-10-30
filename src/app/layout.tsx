import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { site } from "@/lib/site";

const display = localFont({
  src: [
    { path: "../fonts/CormorantGaramond-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/CormorantGaramond-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/CormorantGaramond-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

const sans = localFont({
  src: [
    { path: "../fonts/Outfit-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Outfit-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Outfit-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/Outfit-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.shortName} · ${site.name}`,
    template: `%s · ${site.shortName}`,
  },
  description:
    "W.D. Mohammed Islamic Center of Greensboro, NC — masjid, community hub, Halimah's Pantry, Jumu'ah, events, and member resources.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col text-ink" suppressHydrationWarning>
        <SmoothScrollProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
