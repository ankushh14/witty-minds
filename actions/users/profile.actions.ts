"use server";

import prisma from "@/prisma/prisma";
import { ActionsReturnType, RecentPostsReturn } from "@/types";
import { User } from "@prisma/client";
import { unstable_cache } from "next/cache";

type getfollowersReturn = ActionsReturnType & {
  data?: User[];
};

export const getfollowers = unstable_cache(
  async ({ id }: { id: string }): Promise<getfollowersReturn> => {
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
        return { message: "Invalid user", valid: false };
      }
      return {
        message: "Action succesful",
        valid: true,
        data: user.followedBy,
      };
    } catch (error) {
      console.log(error);
      return { message: "Some unknown error occured", valid: false };
    }
  },
  ["followers"],
  {
    tags: ["follow"],
  }
);

export const getfollowing = unstable_cache(
  async ({ id }: { id: string }): Promise<getfollowersReturn> => {
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
        return { message: "Invalid user", valid: false };
      }
      return { message: "Action succesful", valid: true, data: user.following };
    } catch (error) {
      console.log(error);
      return { message: "Some unknown error occured", valid: false };
    }
  },
  ["following"],
  {
    tags: ["follow"],
  }
);

export const getuserPosts = unstable_cache(
  async ({
    id,
    currentuserId,
  }: {
    id: string;
    currentuserId: string;
  }): Promise<RecentPostsReturn> => {
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
          author: true,
          description: true,
          id: true,
          title: true,
          createdAt: true,
        },
      });
      const posts = await Promise.all(
        data.map(async (item) => {
          const comments = await prisma.comment.findMany({
            where: { postID: item.id, isDeleted: false },
          });

          const followers = await prisma.user.findFirst({
            where: { id: item.author.id },
            select: { followedBy: true },
          });

          const following = followers?.followedBy.some(
            (follower) => follower.id === currentuserId
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
            comments: comments,
            following: following,
          };
        })
      );

      return {
        message: "Fetch posts succesful!",
        valid: true,
        data: posts,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Some unknown error occured!",
        valid: false,
      };
    }
  },
  ["profile-posts"],
  {
    tags: ["posts"],
  }
);
