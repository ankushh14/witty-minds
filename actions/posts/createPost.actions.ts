"use server";

import prisma from "@/prisma/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const createPost = async (
  prevState: ActionsReturnType,
  formData: FormData
): Promise<ActionsReturnType> => {
  try {
    const clerkUser = await currentUser();
    const title = String(formData.get("title"));
    const description = String(formData.get("description"));
    if (!clerkUser?.id || !title || !description) {
      return { message: "Bad Request!", valid: false };
    }
    const user = await prisma.user.findUnique({ where: { id: clerkUser.id } });
    if (!user) {
      return { message: "Invalid User!", valid: false };
    }
    await prisma.post.create({
      data: {
        description: description,
        title: title,
        userId: clerkUser.id,
        updatedAt: new Date(),
      },
    });
    return { message: "Create succesful!", valid: true };
  } catch (error) {
    console.log(error);
    return {
      message: "Some unknown server error",
      valid: false,
    };
  }
};
