"use server";

import { bucket } from "@/lib/storageClient";
import { getFolderNameFromUrl } from "@/lib/utils";
import prisma from "@/prisma/prisma";
import { ActionsReturnType, DeletePostprops } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";

export const createPost = async (
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
    const filesArray: File[] = [];
    const uploadedFilePaths: string[] = [];
    formData.forEach((value: FormDataEntryValue, key: string) => {
      if (key === "files") {
        filesArray.push(value as File);
      }
    });
    if (filesArray.length) {
      const uploadPromises = filesArray.map(async (file) => {
        const bufferData = await file.arrayBuffer();
        const uploadedFile = bucket.file(`${title}/${file.name}`);
        await uploadedFile.save(Buffer.from(bufferData));
        await uploadedFile.makePublic();
        uploadedFilePaths.push(uploadedFile.publicUrl());
      });
      await Promise.all(uploadPromises);
    }
    await prisma.post.create({
      data: {
        description: description,
        title: title,
        userId: clerkUser.id,
        updatedAt: new Date(),
        images: uploadedFilePaths,
      },
    });
    revalidateTag("posts");
    revalidateTag("profile");
    return { message: "Create succesful!", valid: true };
  } catch (error) {
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
    if (response.images.length) {
      const folderName = getFolderNameFromUrl(response.images[0]);
      if (folderName) {
        const [files] = await bucket.getFiles({
          prefix: folderName,
        });

        if (files.length === 0) {
          throw new Error("Error deleting files");
        }
        await Promise.all(
          files.map((file) =>
            file.delete({
              ignoreNotFound: true,
            })
          )
        );
      }
    }
    revalidateTag("posts");
    revalidateTag("profile");
    return { message: `${response.title} deleted!!`, valid: true };
  } catch (error) {
    return {
      message: "Some unknown server error",
      valid: false,
    };
  }
};
