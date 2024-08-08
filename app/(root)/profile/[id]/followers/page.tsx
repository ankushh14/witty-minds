import { getfollowers } from "@/actions/users/profile.actions";
import UserList from "@/components/feed/UserList";

export default async function FollowersPage({
  params,
}: {
  params: { id: string };
}) {
  const followers = await getfollowers({ id: params.id });
  if (!followers.valid) {
    throw new Error(followers.message);
  }
  return (
    <div className="w-full p-4">
      <UserList followers={followers.data!} />
    </div>
  );
}
