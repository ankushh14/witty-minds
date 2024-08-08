"use server";

import prisma from "@/prisma/prisma";
import { ActionsReturnType, UpdateBookmarkProps } from "@/types";
import { revalidateTag } from "next/cache";

export const mutateBookmarks = async ({
  postID,
  userID,
  addBookmark,
}: UpdateBookmarkProps): Promise<ActionsReturnType> => {
  try {
    if (addBookmark) {
      await prisma.post.update({
        where: { id: postID },
        data: { bookmarkedBy: { connect: { id: userID } } },
      });
      revalidateTag("posts");
      return { message: "Bookmark added", valid: true };
    } else {
      await prisma.post.update({
        where: { id: postID },
        data: { bookmarkedBy: { disconnect: { id: userID } } },
      });
      revalidateTag("posts");
      return {
        message: "Bookmark removed",
        valid: true,
      };
    }
  } catch (error) {
    return {
      message: "Bookmark update unsuccesful!",
      valid: false,
    };
  }
};
