import { Post, User } from "@prisma/client";

declare type RootLayoutProps = {
  children: React.ReactNode;
};

declare type ActionsReturnType = {
  message: string;
  valid: boolean;
};

declare type PostCardProps = Omit<Post, "updatedAt"> & {
  author: Omit<User, "description">;
  following?: boolean;
};
