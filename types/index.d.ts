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

declare type RecentPostsReturn = ActionsReturnType & {
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
    likedBy: User[];
    bookmarkCount: number;
    bookmarkedBy: User[];
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

declare type Postsprops = {
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
  likedBy: User[];
  bookmarkCount: number;
  bookmarkedBy: User[];
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

declare type PostCardProps = Omit<Post, "updatedAt" | "isDeleted"> & {
  author: Omit<User, "description">;
  following?: boolean;
  likeCount: number;
  likedBy: User[];
  bookmarkCount: number;
  bookmarkedBy: User[];
  comments: {
    id: string;
    userID: string;
    postID: string;
    content: string;
    userProfile: string;
    createdAt: Date;
  }[];
  setPosts: React.Dispatch<React.SetStateAction<Postsprops>>;
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

declare type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  profile: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  posts_count: number;
  posts: {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
  }[];
  followers: User[];
  followersCount: number;
  followingCount: number;
};

declare type DeletePostprops = {
  userId: string;
  id: string;
};
