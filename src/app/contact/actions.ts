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
});

export async function sendContact(formData: FormData) {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: String(formData.get("phone") ?? "") || undefined,
    attention: formData.get("attention"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    redirect("/?error=1#contact");
  }

  await prisma.contactMessage.create({ data: parsed.data });
  redirect("/?sent=1#contact");
}
