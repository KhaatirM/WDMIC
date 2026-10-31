import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { site } from "../src/lib/site";

const prisma = new PrismaClient();

async function main() {
  const adminHash = await bcrypt.hash("WdmicAdmin2026!", 10);
  const memberHash = await bcrypt.hash("MemberDemo2026!", 10);

  await prisma.user.upsert({
    where: { email: "admin@wdmic.org" },
    update: {},
    create: {
      email: "admin@wdmic.org",
      name: "Center Administrator",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "member@wdmic.org" },
    update: {},
    create: {
      email: "member@wdmic.org",
      name: "Community Member",
      passwordHash: memberHash,
      role: "MEMBER",
    },
  });

  await prisma.announcement.deleteMany();
  await prisma.announcement.createMany({
    data: [
      {
        title: "Jumu'ah this Friday",
        body: "Join us in person at 3015 E. Bessemer Ave. at 1:30 PM EST for English khutbah led by Imam Dr. Nuriddin. Visitors are welcome. Jumu'ah is also live streamed on YouTube for those who cannot attend in person — watch right here on the Jumu'ah page (/jumah#live) or open the YouTube channel.",
        kind: "PROGRAM",
        pinned: true,
      },
      {
        title: "Halimah's Pantry needs volunteers",
        body: "Halimah's Pantry provides food, clothing, and sanitary products to neighbors in need, regardless of faith, gender, or race. If you can pack boxes, greet guests, or help with intake, please use the contact form and select Halimah's Pantry.",
        kind: "GENERAL",
      },
      {
        title: "Halimah's Pantry distribution hours",
        body: `Halimah's Pantry is open ${site.programs.pantry.days}, ${site.programs.pantry.time}. Neighbors are welcome — call the office with any questions.`,
        kind: "PROGRAM",
      },
    ],
  });

  const comingFriday = nextFriday(new Date());
  await prisma.jumahService.deleteMany();
  await prisma.jumahService.createMany({
    data: [
      {
        serviceDate: comingFriday,
        khutbahTitle: "Faith, Service, and the American Muslim Identity",
        imam: "Imam Dr. Abdel J. Nuriddin, N.D., Ph.D.",
        language: "English",
        startsAt: "1:30 PM EST",
        // Column is named zoomUrl for historical reasons; it now holds the YouTube stream URL.
        zoomUrl: site.jumah.streamUrl,
        notes:
          "In-person Jumu'ah is held at the Center. Arrive a few minutes early for seating. If you cannot attend, watch the live stream on this site (Jumu'ah page) or on YouTube.",
      },
      {
        serviceDate: addDays(comingFriday, 7),
        khutbahTitle: "From a Little There Was Much",
        imam: "Imam Dr. Abdel J. Nuriddin, N.D., Ph.D.",
        language: "English",
        startsAt: "1:30 PM EST",
        notes: "Khutbah theme drawn from the spirit of Halimah's Pantry and community care.",
      },
    ],
  });

  await prisma.event.deleteMany();
  await prisma.event.createMany({
    data: [
      {
        title: "Community Garden Workshop",
        summary: "Hands-on gardening skills with certified volunteers, supporting fresh produce for East Greensboro.",
        details:
          "The Center is building a community garden to provide fruits and vegetables to neighbors while teaching environmental awareness. Workshops are led by certified volunteers. Wear closed-toe shoes and bring water.",
        startsAt: addDays(new Date(), 10),
        location: "WDMIC grounds, 3015 E. Bessemer Ave.",
        category: "Garden",
      },
      {
        title: "Community Resource Day",
        summary: "A day of dignity with partner agencies, pantry support, and neighborhood resources.",
        details:
          "Join us for resource tables, pantry distribution, and conversation with neighbors. Volunteers should check in at the front desk.",
        startsAt: addDays(new Date(), 24),
        location: "W.D. Mohammed Islamic Center",
        category: "Outreach",
      },
      {
        title: "Open House & New Visitor Welcome",
        summary: "Tour the masjid, meet the Imam and board, and learn about membership and volunteer roles.",
        details:
          "Families and first-time visitors are especially welcome. Light refreshments will be served after a brief introduction to the Center's history and programs.",
        startsAt: addDays(new Date(), 17),
        location: "Main prayer hall and community room",
        category: "Community",
      },
    ],
  });

  await prisma.journalIssue.deleteMany();
  await prisma.journalIssue.createMany({
    data: [
      {
        title: "Service as Worship in East Greensboro",
        issueLabel: "Vol. 1, No. 1",
        excerpt:
          "How Halimah's Pantry, the garden, and Friday congregation form one community ethic.",
        body: "The W.D. Mohammed Islamic Center opened its doors in 2018 with a pledge to unite communities and support those in need. This first journal note is a placeholder the board can replace with Muslim Journal clippings, original essays, or khutbah summaries. The database is ready: administrators can publish new issues from the hub without touching code.",
        publishedAt: new Date(),
      },
      {
        title: "Remembering Imam W.D. Mohammed",
        issueLabel: "Vol. 1, No. 2",
        excerpt:
          "A brief reflection on the namesake of the Center and a community committed to Islamic identity in America.",
        body: "The Center is named after Imam Warith Deen Mohammed and is committed to preserving an Islamic identity while serving Greensboro as a mosque and community center. Future issues can carry longer historical notes, photo essays, and youth writing from Generation: Next.",
        publishedAt: addDays(new Date(), -21),
      },
    ],
  });

  await prisma.memberDocument.deleteMany();
  await prisma.memberDocument.createMany({
    data: [
      {
        title: "Member briefing: building use & security",
        summary: "Hours, facility requests, and safety contacts for members.",
        category: "Operations",
        body: "This members-only note is a template. The board can replace it with current building-use rules, alarm procedures, and who to call after hours. Do not post sensitive personal data here without consent.",
      },
      {
        title: "Volunteer roster snapshot",
        summary: "Current pantry, garden, and Jumu'ah hospitality needs.",
        category: "Volunteers",
        body: "Halimah's Pantry, the garden, and Friday hospitality all need consistent volunteers. Coordinators can update this document weekly. Personal phone numbers should stay in a private spreadsheet, not on this page.",
      },
      {
        title: "Board meeting packet (sample)",
        summary: "Agenda outline for the next board session.",
        category: "Board",
        body: "Sample agenda: (1) opening du'a, (2) minutes, (3) treasurer report, (4) pantry and garden, (5) facilities, (6) membership, (7) closing. Replace this text before sharing real minutes.",
      },
    ],
  });
}

function nextFriday(from: Date) {
  const d = new Date(from);
  d.setHours(13, 30, 0, 0);
  const day = d.getDay();
  const add = (5 - day + 7) % 7 || 7;
  d.setDate(d.getDate() + add);
  return d;
}

function addDays(from: Date, days: number) {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d;
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
