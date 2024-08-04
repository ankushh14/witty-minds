import prisma from "@/prisma/prisma";
import { ActionsReturnType } from "@/types";
import { currentUser } from "@clerk/nextjs/server";

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

export const getRecentPosts = async (): Promise<RecentPostsReturn> => {
  const clerkUser = await currentUser();
  if (!clerkUser?.id) {
    return { message: "Invalid User!", valid: false };
  }
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
          (follower) => follower.id === clerkUser.id
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
};
