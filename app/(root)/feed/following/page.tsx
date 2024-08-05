import { getFollowingPosts } from "@/actions/posts/getPosts.actions";
import PostCard from "@/components/feed/PostCard";
import { currentUser } from "@clerk/nextjs/server";

const Followpage = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser?.id) {
    return;
  }
  const posts = await getFollowingPosts({ id: clerkUser?.id });
  return (
    <div
      className="w-full flex flex-col space-y-4 py-4 justify-center items-center"
      aria-label="Posts of people you follow"
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

export default Followpage;
