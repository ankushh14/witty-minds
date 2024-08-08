"use server";

import prisma from "@/prisma/prisma";
import { ActionsReturnType, DeletePostprops } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";

export const createPost = async (
  prevState: ActionsReturnType,
  formData: FormData
): Promise<ActionsReturnType> => {
  try {
    const clerkUser = await currentUser();
    const title = String(formData.get("title"));
    const description = String(formData.get("description"));
    if (!clerkUser?.id || !title.length || !description.length) {
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
    revalidateTag("posts");
    revalidateTag("profile");
    return { message: "Create succesful!", valid: true };
  } catch (error) {
    console.error(error);
    return {
      message: "Some unknown server error",
      valid: false,
    };
  }
};

export const deletePost = async ({
  userId,
  id,
}: DeletePostprops): Promise<ActionsReturnType> => {
  try {
    if (!userId || !id) {
      return { message: "Bad Request!", valid: false };
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return { message: "Invalid User!", valid: false };
    }
    const response = await prisma.post.update({
      where: {
        id: id,
        author: {
          id: userId,
        },
      },
      data: {
        isDeleted: true,
      },
    });
    revalidateTag("posts");
    revalidateTag("profile");
    return { message: `${response.title} deleted!!`, valid: true };
  } catch (error) {
    console.error(error);
    return {
      message: "Some unknown server error",
      valid: false,
    };
  }
};
