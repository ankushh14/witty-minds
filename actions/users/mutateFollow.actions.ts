"use server";

import prisma from "@/prisma/prisma";
import { ActionsReturnType, AddFollowProps, RemoveFollowProps } from "@/types";
import { revalidateTag } from "next/cache";

export const addFollow = async ({
  fromUserID,
  toUserID,
}: AddFollowProps): Promise<ActionsReturnType> => {
  try {
    if (!fromUserID || !toUserID) {
      return { message: "Bad Request", valid: false };
    }
    await prisma.user.update({
      where: { id: fromUserID },
      data: { following: { connect: { id: toUserID } } },
    });
    revalidateTag("posts");
    revalidateTag("profile");
    revalidateTag("follow");
    return { message: "follow succesful!", valid: true };
  } catch (error) {
    console.log(error);
    return {
      message: "Some unknown error occured",
      valid: false,
    };
  }
};

export const removeFollow = async ({
  fromUserID,
  toUserID,
}: RemoveFollowProps): Promise<ActionsReturnType> => {
  try {
    if (!fromUserID || !toUserID) {
      return { message: "Bad Request", valid: false };
    }
    await prisma.user.update({
      where: { id: fromUserID },
      data: { following: { disconnect: { id: toUserID } } },
    });
    revalidateTag("posts");
    revalidateTag("profile");
    revalidateTag("follow");
    return { message: "unfollow succesful!", valid: true };
  } catch (error) {
    console.log(error);
    return {
      message: "Some unknown error occured",
      valid: false,
    };
  }
};
