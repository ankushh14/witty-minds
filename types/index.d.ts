import { Post, User } from "@prisma/client";

declare type RootLayoutProps = {
  children: React.ReactNode;
};

declare type ActionsReturnType = {
  message: string;
  valid: boolean;
};

declare type AddCommentProps = {
  userID: string;
  postID: string;
  content: string;
  profile: string;
};

declare type AddCommentReturn = ActionsReturnType & {
  data?: {
    id: string;
    userID: string;
    postID: string;
    content: string;
    userProfile: string;
    createdAt: Date;
  };
};

declare type PostCardProps = Omit<Post, "updatedAt"> & {
  author: Omit<User, "description">;
  following?: boolean;
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
};

declare type MutateLikeProps = {
  postID: string;
  addLike: boolean;
  userID: string;
};

declare type UpdateBookmarkProps = {
  postID: string;
  addBookmark: boolean;
  userID: string;
};

declare type AddFollowProps = {
  fromUserID: string;
  toUserID: string;
};

declare type RemoveFollowProps = {
  fromUserID: string;
  toUserID: string;
};
