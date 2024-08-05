import { getfollowing } from "@/actions/users/profile.actions";
import FollowComponent from "@/components/profile/FollowerComponent";

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
      <FollowComponent followers={follwing.data!} />
    </div>
  );
}
