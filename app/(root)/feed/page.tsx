import { getRecentPosts } from "@/actions/posts/getPosts.actions";
import Posts from "@/components/feed/Posts";
import { currentUser } from "@clerk/nextjs/server";

const Feedpage = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser?.id) {
    return;
  }
  const posts = await getRecentPosts({ id: clerkUser.id });
  return (
    <div className="w-full" aria-label="Recent posts">
      {posts.valid && <Posts postsData={posts.data!} />}
    </div>
  );
};

export default Feedpage;
