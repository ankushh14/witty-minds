import { getBookmarkedPosts } from "@/actions/posts/getPosts.actions";
import Posts from "@/components/feed/Posts";

const Bookmarkpage = async () => {
  const posts = await getBookmarkedPosts();
  return (
    <div className="w-full" aria-label="Bookmarked posts">
      {posts.valid && posts.data?.length ? (
        <Posts postsData={posts.data!} flexWrap />
      ) : (
        <h1 className="text-xl my-6 text-center w-full">
          Nothing to show here...
        </h1>
      )}
    </div>
  );
};

export default Bookmarkpage;
