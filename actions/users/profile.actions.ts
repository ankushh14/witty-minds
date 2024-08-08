"use server";

import prisma from "@/prisma/prisma";
import { ActionsReturnType, RecentPostsReturn } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { User } from "@prisma/client";

type getfollowersReturn = ActionsReturnType & {
  data?: User[];
};

export const getfollowers = async ({
  id,
}: {
  id: string;
}): Promise<getfollowersReturn> => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized user");
  }
  try {
    if (!id || id === undefined) {
      return { message: "Bad request", valid: false };
    }
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        followedBy: true,
      },
    });
    if (!user) {
      throw new Error("Invalid user!");
    }
    return {
      message: "Action succesful",
      valid: true,
      data: user.followedBy,
    };
  } catch (error) {
    throw new Error("Some unknown error occured!");
  }
};

export const getfollowing = async ({
  id,
}: {
  id: string;
}): Promise<getfollowersReturn> => {
  try {
    if (!id || id === undefined) {
      return { message: "Bad request", valid: false };
    }
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        following: true,
      },
    });
    if (!user) {
      throw new Error("Invalid user!");
    }
    return { message: "Action succesful", valid: true, data: user.following };
  } catch (error) {
    throw new Error("Some unknown error occured!");
  }
};

export const getuserPosts = async ({
  id,
}: {
  id: string;
}): Promise<RecentPostsReturn> => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized user!");
  }
  try {
    const data = await prisma.post.findMany({
      where: { author: { id: id }, isDeleted: false },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      select: {
        _count: true,
        likedBy: true,
        bookmarkedBy: true,
        author: {
          include: {
            followedBy: true,
          },
        },
        description: true,
        id: true,
        title: true,
        createdAt: true,
        Comment: true,
      },
    });
    const posts = data.map((item) => {
      const following = item.author.followedBy.some(
        (follower) => follower.id === userId
      );

      return {
        postID: item.id,
        author: item.author,
        title: item.title,
        description: item.description,
        createdAt: item.createdAt,
        likeCount: item._count.likedBy,
        likedBy: item.likedBy,
        bookmarkCount: item._count.bookmarkedBy,
        bookmarkedBy: item.bookmarkedBy,
        comments: item.Comment,
        following: following,
      };
    });
    return {
      message: "Fetch posts succesful!",
      valid: true,
      data: posts,
    };
  } catch (error) {
    throw new Error("Some unknown error occured!");
  }
};
