import { getfollowing } from "@/actions/users/profile.actions";
import UserList from "@/components/feed/UserList";

export default async function FollowingPage({
  params,
}: {
  params: { id: string };
}) {
  const follwing = await getfollowing({ id: params.id });
  if (!follwing.valid) {
    throw new Error(follwing.message);
  }
  return (
    <div className="w-full p-4">
      <UserList followers={follwing.data!} />
    </div>
  );
}
