"use server";

import prisma from "@/prisma/prisma";
import { RecentPostsReturn } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { unstable_cache } from "next/cache";

export const getRecentPosts = async (): Promise<RecentPostsReturn> => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized user!");
  }
  try {
    const data = await unstable_cache(
      async () => {
        return await prisma.post.findMany({
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
            images: true,
          },
        });
      },
      ["recent"],
      {
        tags: ["posts"],
        revalidate: 10,
      }
    )();
    const posts = data.map((item) => {
      const following = item?.author.followedBy.some(
        (follower) => follower.id === userId
      );

      const { followedBy, ...requiredAuthorData } = item.author;
      return {
        postID: item.id,
        author: requiredAuthorData,
        title: item.title,
        description: item.description,
        createdAt: item.createdAt,
        likeCount: item._count.likedBy,
        likedBy: item.likedBy,
        bookmarkCount: item._count.bookmarkedBy,
        bookmarkedBy: item.bookmarkedBy,
        comments: item.Comment,
        following: following,
        images: item.images,
      };
    });
    return {
      message: "Fetch posts succesful!",
      valid: true,
      data: posts,
    };
  } catch (error) {
    return {
      message: "Some unknown error occured!",
      valid: false,
    };
  }
};

export const getFollowingPosts = async (): Promise<RecentPostsReturn> => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized user!");
  }
  try {
    const data = await unstable_cache(
      async () => {
        return await prisma.post.findMany({
          where: {
            isDeleted: false,
            author: {
              followedBy: {
                some: {
                  id: userId,
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
            images: true,
          },
        });
      },
      ["following"],
      {
        tags: ["posts"],
        revalidate: 10,
      }
    )();
    const posts = data.map((item) => {
      const following = item.author.followedBy.some(
        (follower) => follower.id === userId
      );
      const { followedBy, ...requiredAuthorData } = item.author;

      return {
        postID: item.id,
        author: requiredAuthorData,
        title: item.title,
        description: item.description,
        createdAt: item.createdAt,
        likeCount: item._count.likedBy,
        likedBy: item.likedBy,
        bookmarkCount: item._count.bookmarkedBy,
        bookmarkedBy: item.bookmarkedBy,
        comments: item.Comment,
        following: following,
        images: item.images,
      };
    });
    return {
      message: "Fetch posts succesful!",
      valid: true,
      data: posts,
    };
  } catch (error) {
    return {
      message: "Some unknown error occured!",
      valid: false,
    };
  }
};

export const getBookmarkedPosts = async (): Promise<RecentPostsReturn> => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized user!");
  }
  try {
    const data = await unstable_cache(
      async () =>
        await prisma.post.findMany({
          where: {
            isDeleted: false,
            bookmarkedBy: {
              some: {
                id: userId,
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
            images: true,
          },
        }),
      ["bookmarks"],
      {
        tags: ["posts"],
      }
    )();
    const posts = data.map((item) => {
      const following = item.author.followedBy.some(
        (follower) => follower.id === userId
      );

      const { followedBy, ...requiredAuthorData } = item.author;

      return {
        postID: item.id,
        author: requiredAuthorData,
        title: item.title,
        description: item.description,
        createdAt: item.createdAt,
        likeCount: item._count.likedBy,
        likedBy: item.likedBy,
        bookmarkCount: item._count.bookmarkedBy,
        bookmarkedBy: item.bookmarkedBy,
        comments: item.Comment,
        following: following,
        images: item.images,
      };
    });
    return {
      message: "Fetch posts succesful!",
      valid: true,
      data: posts,
    };
  } catch (error) {
    return {
      message: "Some unknown error occured!",
      valid: false,
    };
  }
};
