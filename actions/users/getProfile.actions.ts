"use server";

import prisma from "@/prisma/prisma";
import { ActionsReturnType, Profile } from "@/types";
import { auth } from "@clerk/nextjs/server";

type ProfileReturnType = ActionsReturnType & {
  data?: Profile;
};

export const getProfile = async ({
  id,
}: {
  id: string;
}): Promise<ProfileReturnType> => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized user");
  }
  if (!id || id === undefined) {
    throw new Error("Bad request");
  }
  const user = await prisma.user.findFirst({
    where: { id: id },
    include: {
      _count: true,
      followedBy: true,
      posts: {
        orderBy: {
          createdAt: "desc",
        },
        where: {
          isDeleted: false,
        },
      },
    },
  });
  if (user) {
    const dataToSend = {
      id: user.id,
      name: user.name,
      email: user.email,
      description: user.description,
      profile: user.profile,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      posts_count: user._count.posts,
      posts: user.posts,
      followers: user.followedBy,
      followersCount: user._count.followedBy,
      followingCount: user._count.following,
    };
    return {
      message: "Valid user",
      valid: true,
      data: dataToSend,
    };
  } else {
    return { message: "Invalid user", valid: false };
  }
};
