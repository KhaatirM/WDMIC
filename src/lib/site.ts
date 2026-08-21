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
  },
  mapsQuery: "3015+E+Bessemer+Ave+Greensboro+NC+27405",
  ein: "46-5053181",
};

export const nav = [
  { id: "home", href: "/#home", label: "Home" },
  { id: "about", href: "/about", label: "About" },
  { id: "jumah", href: "/jumah", label: "Jumu'ah" },
  { id: "events", href: "/#events", label: "Events" },
  { id: "announcements", href: "/#announcements", label: "Announcements" },
  { id: "journal", href: "/#journal", label: "Journal" },
  { id: "outreach", href: "/#outreach", label: "Outreach" },
  { id: "contact", href: "/#contact", label: "Contact" },
] as const;

export type SectionId = (typeof nav)[number]["id"];

export const darkScenes: SectionId[] = [
  "home",
  "about",
  "jumah",
  "events",
  "announcements",
  "journal",
  "outreach",
  "contact",
];
