"use client";

import { getPosts } from "@/actions/posts/getPosts.actions";
import { Postsprops, RecentPostsReturn } from "@/types";
import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import Spinner from "../ui/Spinner";
import PostCard from "./PostCard";

const Posts = ({
  postsData,
  initialCursor,
  getMoreDataAction,
}: {
  postsData: Postsprops;
  initialCursor?: string;
  getMoreDataAction: ({
    cursor,
  }: getPosts) => Promise<RecentPostsReturn & getPosts>;
}) => {
  const [cursor, setCursor] = useState(initialCursor);
  const [posts, setPosts] = useState(postsData);
  const [hasMoreData, setHasMoreData] = useState(true);
  useEffect(() => setPosts(postsData), [postsData]);

  const getNextData = useCallback(async () => {
    const response = await getMoreDataAction({
      cursor,
    });
    if (response.valid && response.data && response.data.length) {
      setPosts((prev) => [...prev, ...response.data!]);
      setCursor(response.cursor);
    } else {
      setHasMoreData(false);
    }
  }, [cursor, getMoreDataAction]);

  return (
    <>
      <InfiniteScroll
        pageStart={0}
        loadMore={getNextData}
        hasMore={hasMoreData}
        className="w-full flex flex-col space-y-4 py-4 px-2 justify-center items-center"
        loader={
          <div className="w-full flex justify-center items-center py-3" key={0}>
            <Spinner />
          </div>
        }
        useWindow={true}
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
      </InfiniteScroll>
    </>
  );
};

export default Posts;
