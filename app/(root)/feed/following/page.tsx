import { getFollowingPosts } from "@/actions/posts/getPosts.actions";
import Posts from "@/components/feed/Posts";

const Followpage = async () => {
  const posts = await getFollowingPosts({});
  return (
    <div className="w-full" aria-label="Posts of people you follow">
      {posts.valid && posts.data?.length ? (
        <Posts
          postsData={posts.data}
          getMoreDataAction={getFollowingPosts}
          initialCursor={posts.cursor}
        />
      ) : (
        <h1 className="text-xl my-6 text-center w-full">
          Nothing to show here...
        </h1>
      )}
    </div>
  );
};

export default Followpage;
