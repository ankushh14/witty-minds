import { getBookmarkedPosts } from "@/actions/posts/getPosts.actions";
import PostCard from "@/components/feed/PostCard";
import { currentUser } from "@clerk/nextjs/server";

const Bookmarkpage = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser?.id) {
    return;
  }
  const posts = await getBookmarkedPosts({ id: clerkUser?.id });
  return (
    <div
      className="w-full flex flex-row flex-wrap py-4 px-2 gap-4 justify-center items-start"
      aria-label="Bookmarked posts"
    >
      {posts.valid &&
        posts.data?.map((post) => {
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

export default Bookmarkpage;
