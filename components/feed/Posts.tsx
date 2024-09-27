"use client";

import { Postsprops } from "@/types";
import { useEffect, useState } from "react";
import PostCard from "./PostCard";

const Posts = ({
  postsData,
  flexWrap = false,
}: {
  postsData: Postsprops;
  flexWrap?: boolean;
}) => {
  const [posts, setPosts] = useState(postsData);
  useEffect(() => setPosts(postsData), [postsData]);
  return (
    <div
      className={`w-full  ${
        flexWrap
          ? "grid grid-cols-1 md:grid-cols-2 gap-3 place-items-center"
          : "flex flex-col space-y-4"
      }  py-4 px-2 justify-center items-center`}
    >
      {posts.map((post) => {
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
            setPosts={setPosts}
            images={post.images!}
          />
        );
      })}
    </div>
  );
};

export default Posts;
