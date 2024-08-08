import { getRecentPosts } from "@/actions/posts/getPosts.actions";
import Posts from "@/components/feed/Posts";

const Feedpage = async () => {
  const posts = await getRecentPosts();
  return (
    <div className="w-full" aria-label="Recent posts">
      {posts.valid && <Posts postsData={posts.data!} />}
    </div>
  );
};

export default Feedpage;
