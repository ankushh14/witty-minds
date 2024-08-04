"use server";

import prisma from "@/prisma/prisma";
import { ActionsReturnType } from "@/types";
import { unstable_cache } from "next/cache";

type RecentPostsReturn = ActionsReturnType & {
  data?: {
    postID: string;
    author: {
      id: string;
      name: string | null;
      email: string | null;
      profile: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
    title: string;
    description: string;
    createdAt: Date;
    likeCount: number;
    likedBy: {
      id: string;
      name: string | null;
      email: string | null;
      createdAt: Date;
      updatedAt: Date;
    }[];
    bookmarkCount: number;
    bookmarkedBy: {
      id: string;
      name: string | null;
      email: string | null;
      createdAt: Date;
      updatedAt: Date;
    }[];
    comments: {
      id: string;
      userID: string;
      postID: string;
      content: string;
      userProfile: string;
      createdAt: Date;
    }[];
    following?: boolean;
  }[];
};

export const getRecentPosts = unstable_cache(
  async ({ id }: { id: string }): Promise<RecentPostsReturn> => {
    try {
      const limit = 10;
      const data = await prisma.post.findMany({
        take: limit + 1,
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
            where: { postID: item.id },
          });

          const followers = await prisma.user.findFirst({
            where: { id: item.author.id },
            select: { followedBy: true },
          });

          const following = followers?.followedBy.some(
            (follower) => follower.id === id
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
      console.error(error);
      return {
        message: "Some unknown error occured!",
        valid: false,
      };
    }
  },
  ["recent"],
  {
    tags: ["posts"],
  }
);

export const getFollowingPosts = unstable_cache(
  async ({ id }: { id: string }): Promise<RecentPostsReturn> => {
    try {
      const limit = 10;
      const data = await prisma.post.findMany({
        take: limit + 1,
        where: {
          author: {
            followedBy: {
              some: {
                id: id,
              },
            },
          },
        },
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
            where: { postID: item.id },
          });

          const followers = await prisma.user.findFirst({
            where: { id: item.author.id },
            select: { followedBy: true },
          });

          const following = followers?.followedBy.some(
            (follower) => follower.id === id
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
  ["following"],
  {
    tags: ["posts"],
  }
);

export const getBookmarkedPosts = unstable_cache(
  async ({ id }: { id: string }): Promise<RecentPostsReturn> => {
    try {
      const limit = 10;
      const data = await prisma.post.findMany({
        take: limit + 1,
        where: {
          bookmarkedBy: {
            some: {
              id: id,
            },
          },
        },
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
            where: { postID: item.id },
          });

          const followers = await prisma.user.findFirst({
            where: { id: item.author.id },
            select: { followedBy: true },
          });

          const following = followers?.followedBy.some(
            (follower) => follower.id === id
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
  ["bookmarks"],
  {
    tags: ["posts"],
  }
);
