"use server";

import prisma from "@/prisma/prisma";
import { AddCommentProps, AddCommentReturn } from "@/types";
import { revalidateTag } from "next/cache";

export const addComment = async ({
  content,
  postID,
  userID,
  profile,
}: AddCommentProps): Promise<AddCommentReturn> => {
  try {
    if (!content || !postID || !userID) {
      return { message: "Bad Request", valid: false };
    }
    const user = await prisma.user.findFirst({ where: { id: userID } });
    if (!user || user === undefined) {
      return { message: "Invalid user", valid: false };
    }
    const post = await prisma.post.findFirst({ where: { id: postID } });
    if (!post || post === undefined) {
      return { message: "Post does not exist", valid: false };
    }
    const comment = await prisma.comment.create({
      data: { content, postID, userID, userProfile: profile },
    });
    revalidateTag("posts");
    return {
      message: "Comment add succesful",
      valid: true,
      data: comment,
    };
  } catch (error) {
    return {
      message: "Some unknown error occured",
      valid: false,
    };
  }
};
