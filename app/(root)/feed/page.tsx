import { getRecentPosts } from "@/actions/posts/getPosts.actions";
import PostCard from "@/components/feed/PostCard";

const Feedpage = async () => {
  const posts = await getRecentPosts();
  return (
    <div
      className="w-full flex flex-col space-y-4 py-4 justify-center items-center"
      aria-label="Recent posts"
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
            />
          );
        })}
    </div>
  );
};

export default Feedpage;
