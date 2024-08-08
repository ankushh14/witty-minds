"use client";

import { Postsprops } from "@/types";
import { useEffect, useState } from "react";
import PostCard from "../feed/PostCard";

type Props = {
  profileposts: Postsprops;
  focusId?: string;
};

const Profileposts = ({ profileposts, focusId }: Props) => {
  const [posts, setPosts] = useState(profileposts);
  useEffect(() => setPosts(profileposts), [profileposts]);
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
      {posts.length ? (
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
              setPosts={setPosts}
            />
          );
        })
      ) : (
        <h2 className="w-full text-xl text-center">Nothing to show here...</h2>
      )}
    </div>
  );
};

export default Profileposts;
