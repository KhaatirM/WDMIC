"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  attention: z.string().min(2).max(80),
  message: z.string().min(8).max(4000),
  returnTo: z.string().optional(),
});

function safeReturn(raw: string | undefined, query: string) {
  const allowed = new Set(["/#contact", "/contact"]);
  const base = raw && allowed.has(raw) ? raw : "/#contact";
  if (base.startsWith("/#")) {
    return `/?${query}${base.slice(1)}`;
  }
  const join = base.includes("?") ? "&" : "?";
  return `${base}${join}${query}`;
}

export async function sendContact(formData: FormData) {
  const returnTo = String(formData.get("returnTo") ?? "");
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: String(formData.get("phone") ?? "") || undefined,
    attention: formData.get("attention"),
    message: formData.get("message"),
    returnTo,
  });

  if (!parsed.success) {
    redirect(safeReturn(returnTo, "error=1"));
  }

  const { returnTo: _r, ...data } = parsed.data;
  await prisma.contactMessage.create({ data });
  redirect(safeReturn(returnTo, "sent=1"));
}
