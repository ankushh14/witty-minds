"use server";

import prisma from "@/prisma/prisma";
import { RecentPostsReturn } from "@/types";
import { auth } from "@clerk/nextjs/server";

export type getPosts = {
  cursor?: string;
};

export const getRecentPosts = async ({
  cursor,
}: getPosts): Promise<RecentPostsReturn & getPosts> => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized user!");
  }
  try {
    const data = await prisma.post.findMany({
      where: { isDeleted: false },
      cursor: cursor
        ? {
            id: cursor,
          }
        : undefined,
      take: 5,
      skip: cursor ? 1 : undefined,
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
    const myCursor = data[data.length - 1].id;
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
      cursor: myCursor,
    };
  } catch (error) {
    return {
      message: "Some unknown error occured!",
      valid: false,
    };
  }
};

export const getFollowingPosts = async ({
  cursor,
}: getPosts): Promise<RecentPostsReturn & getPosts> => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized user!");
  }
  try {
    const data = await prisma.post.findMany({
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
      cursor: cursor
        ? {
            id: cursor,
          }
        : undefined,
      take: 5,
      skip: cursor ? 1 : undefined,
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
    const myCursor = data[data.length - 1].id;
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
      cursor: myCursor,
    };
  } catch (error) {
    return {
      message: "Some unknown error occured!",
      valid: false,
    };
  }
};

export const getBookmarkedPosts = async ({
  cursor,
}: getPosts): Promise<RecentPostsReturn & getPosts> => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized user!");
  }
  try {
    const data = await prisma.post.findMany({
      where: {
        isDeleted: false,
        bookmarkedBy: {
          some: {
            id: userId,
          },
        },
      },
      cursor: cursor
        ? {
            id: cursor,
          }
        : undefined,
      take: 5,
      skip: cursor ? 1 : undefined,
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
    const myCursor = data[data.length - 1].id;

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
      cursor: myCursor,
    };
  } catch (error) {
    return {
      message: "Some unknown error occured!",
      valid: false,
    };
  }
};
