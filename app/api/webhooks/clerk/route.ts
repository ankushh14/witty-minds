import prisma from "@/prisma/prisma";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    return new Response("Error occured", {
      status: 400,
    });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    if (!id || !email_addresses) {
      return new Response("Error occurred -- missing data", {
        status: 400,
      });
    }

    const user = {
      clerkUserId: id,
      email: email_addresses[0].email_address,
      ...(first_name ? { firstName: first_name } : {}),
      ...(last_name ? { lastName: last_name } : {}),
      ...(image_url ? { imageUrl: image_url } : {}),
    };
    await prisma.user.create({
      data: {
        id: user.clerkUserId,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        updatedAt: new Date(),
        profile: user.imageUrl,
      },
    });
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    if (!id) {
      return new Response("Error occurred -- missing data", {
        status: 400,
      });
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });
  }

  return new Response("", { status: 200 });
}
