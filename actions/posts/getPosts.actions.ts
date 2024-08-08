"use server";

import prisma from "@/prisma/prisma";
import { RecentPostsReturn } from "@/types";
import { unstable_cache } from "next/cache";

export const getRecentPosts = unstable_cache(
  async ({ id }: { id: string }): Promise<RecentPostsReturn> => {
    try {
      const limit = 10;
      const data = await prisma.post.findMany({
        take: limit + 1,
        where: { isDeleted: false },
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
          isDeleted: false,
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
            where: { postID: item.id, isDeleted: false },
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
      const data = await prisma.post.findMany({
        where: {
          isDeleted: false,
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
            where: { postID: item.id, isDeleted: false },
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
