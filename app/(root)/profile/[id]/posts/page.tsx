import { getuserPosts } from "@/actions/users/profile.actions";
import Profileposts from "@/components/profile/Profileposts";
import { currentUser } from "@clerk/nextjs/server";

export default async function page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { post: string };
}) {
  const clerkUser = await currentUser();
  if (!clerkUser?.id) {
    throw new Error("Invalid user");
  }
  const posts = await getuserPosts({
    id: params.id,
    currentuserId: clerkUser.id,
  });
  if (!posts.valid) {
    throw new Error(posts.message);
  }
  return (
    <div className="w-full" aria-label="posts">
      <Profileposts profileposts={posts.data!} focusId={searchParams.post} />
    </div>
  );
}
