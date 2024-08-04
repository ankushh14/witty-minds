"use server";

import prisma from "@/prisma/prisma";
import { ActionsReturnType, MutateLikeProps } from "@/types";
import { revalidateTag } from "next/cache";

export const mutateLike = async ({
  postID,
  addLike,
  userID,
}: MutateLikeProps): Promise<ActionsReturnType> => {
  try {
    if (addLike) {
      await prisma.post.update({
        where: { id: postID },
        data: { likedBy: { connect: { id: userID } } },
      });
      revalidateTag("posts");
      return { message: "Like add succesful!", valid: true };
    } else {
      await prisma.post.update({
        where: { id: postID },
        data: { likedBy: { disconnect: { id: userID } } },
      });
      revalidateTag("posts");
      return {
        message: "Like remove succesful!",
        valid: true,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      message: "Like mutate unsuccesful!",
      valid: false,
    };
  }
};
