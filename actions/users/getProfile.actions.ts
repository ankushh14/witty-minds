"use server";

import prisma from "@/prisma/prisma";
import { ActionsReturnType, Profile } from "@/types";
import { unstable_cache } from "next/cache";

type ProfileReturnType = ActionsReturnType & {
  data?: Profile;
};

export const getProfile = unstable_cache(
  async ({ id }: { id: string }): Promise<ProfileReturnType> => {
    if (!id || id === undefined) {
      return { message: "Bad Request", valid: false };
    }
    const user = await prisma.user.findFirst({
      where: { id: id },
      include: { _count: true, followedBy: true },
    });
    const posts = await prisma.post.findMany({
      where: { author: { id: user?.id } },
      orderBy: {
        createdAt: "desc",
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
        posts: posts,
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
  },
  ["profile"],
  {
    tags: ["profile"],
  }
);
