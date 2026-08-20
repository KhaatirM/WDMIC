"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { AnnouncementKind } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/login");
  }
}

export async function createAnnouncement(formData: FormData) {
  await requireAdmin();
  await prisma.announcement.create({
    data: {
      title: String(formData.get("title") ?? ""),
      body: String(formData.get("body") ?? ""),
      kind: (String(formData.get("kind") ?? "GENERAL") as AnnouncementKind),
      pinned: formData.get("pinned") === "on",
    },
  });
  redirect("/admin?saved=announcements");
}

export async function createJumah(formData: FormData) {
  await requireAdmin();
  await prisma.jumahService.create({
    data: {
      serviceDate: new Date(String(formData.get("serviceDate"))),
      khutbahTitle: String(formData.get("khutbahTitle") ?? ""),
      imam: String(formData.get("imam") ?? ""),
      startsAt: String(formData.get("startsAt") ?? "1:30 PM EST"),
      zoomUrl: String(formData.get("zoomUrl") ?? "") || null,
      notes: String(formData.get("notes") ?? "") || null,
    },
  });
  redirect("/admin?saved=jumah");
}

export async function createEvent(formData: FormData) {
  await requireAdmin();
  await prisma.event.create({
    data: {
      title: String(formData.get("title") ?? ""),
      summary: String(formData.get("summary") ?? ""),
      details: String(formData.get("details") ?? ""),
      startsAt: new Date(String(formData.get("startsAt"))),
      location: String(formData.get("location") ?? ""),
      category: String(formData.get("category") ?? "Community"),
    },
  });
  redirect("/admin?saved=events");
}

export async function createJournal(formData: FormData) {
  await requireAdmin();
  await prisma.journalIssue.create({
    data: {
      title: String(formData.get("title") ?? ""),
      issueLabel: String(formData.get("issueLabel") ?? ""),
      excerpt: String(formData.get("excerpt") ?? ""),
      body: String(formData.get("body") ?? ""),
      publishedAt: new Date(),
    },
  });
  redirect("/admin?saved=journal");
}

export async function createMemberDoc(formData: FormData) {
  await requireAdmin();
  await prisma.memberDocument.create({
    data: {
      title: String(formData.get("title") ?? ""),
      summary: String(formData.get("summary") ?? ""),
      body: String(formData.get("body") ?? ""),
      category: String(formData.get("category") ?? "Operations"),
    },
  });
  redirect("/admin?saved=members");
}
