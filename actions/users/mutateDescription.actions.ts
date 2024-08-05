"use server";

import prisma from "@/prisma/prisma";
import { ActionsReturnType } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";

export const updateDescription = async (
  prevState: ActionsReturnType,
  formData: FormData
): Promise<ActionsReturnType> => {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return { message: "Invalid user", valid: false };
  }
  const description = String(formData.get("description"));
  if (!description || description === undefined) {
    return { message: "Bad request", valid: false };
  }
  const user = await prisma.user.findFirst({ where: { id: clerkUser.id } });
  if (!user) {
    return { message: "Invalid user", valid: false };
  }
  const response = await prisma.user.update({
    where: { id: clerkUser.id },
    data: {
      description,
    },
  });
  if (!response) {
    return {
      message: "description update failed",
      valid: false,
    };
  }
  revalidateTag("profile");
  return { message: "description updated", valid: true };
};
