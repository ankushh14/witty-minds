import { getfollowers } from "@/actions/users/profile.actions";
import FollowComponent from "@/components/profile/FollowerComponent";

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
      <FollowComponent followers={followers.data!} />
    </div>
  );
}
