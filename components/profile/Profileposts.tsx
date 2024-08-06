"use client";

import { useEffect } from "react";
import PostCard from "../feed/PostCard";

type Props = {
  posts: {
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
  focusId?: string;
};

const Profileposts = ({ posts, focusId }: Props) => {
  useEffect(() => {
    if (focusId !== undefined && focusId) {
      const focus = document.getElementById(focusId);
      focus?.scrollIntoView({
        behavior: "smooth",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="w-full flex flex-col justify-center items-center space-y-4 py-4 px-2">
      {posts.length &&
        posts.map((post) => {
          return (
            <PostCard
              author={post.author}
              createdAt={post.createdAt}
              description={post.description}
              id={post.postID}
              title={post.title}
              key={post.postID}
              userId={post.author.id}
              following={post.following}
              bookmarkCount={post.bookmarkCount}
              bookmarkedBy={post.bookmarkedBy}
              comments={post.comments}
              likeCount={post.likeCount}
              likedBy={post.likedBy}
            />
          );
        })}
    </div>
  );
};

export default Profileposts;
