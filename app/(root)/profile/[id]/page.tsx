import { getProfile } from "@/actions/users/getProfile.actions";
import EditDescription from "@/components/profile/EditDescription";
import FollowButton from "@/components/profile/FollowButton";
import UnfollowButton from "@/components/profile/UnfollowButton";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "@clerk/nextjs/server";
import { AvatarFallback } from "@radix-ui/react-avatar";

import Link from "next/link";

const ProfilePage = async ({ params }: { params: { id: string } }) => {
  const profile = await getProfile({ id: params.id });
  if (!profile.valid) {
    throw new Error("Invalid Profile, does not exist!");
  }

  const clerkUser = await currentUser();

  const currentProfile = profile.data?.id === clerkUser?.id;

  return (
    <article
      className="w-full flex flex-col justify-center items-center space-y-5"
      aria-label={`Profile of ${profile.data?.name}`}
    >
      <section className="w-full flex flex-col justify-center items-center py-3 space-y-3">
        <Avatar className="w-[200px] h-[200px]">
          <AvatarImage
            src={profile.data?.profile!}
            alt={`profile image of ${profile.data?.name}`}
          />
          <AvatarFallback>{profile.data?.name?.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="w-full flex flex-col space-y-3 items-center">
          <h3 className="text-lg w-full text-center">{profile.data?.name}</h3>
          <p
            className="text-xs text-center text-gray-500 px-2"
            aria-label={`profile description`}
          >
            {profile.data?.description === null ||
            profile.data?.description === undefined ||
            profile.data?.description.length === 0 ? (
              currentProfile ? (
                <span className="italic">Add a description...</span>
              ) : (
                <span className="italic">No description...</span>
              )
            ) : (
              profile.data?.description
            )}
          </p>
          {currentProfile && <EditDescription />}
        </div>
      </section>
      <section className="w-full flex flex-row justify-center items-center p-2 space-x-12">
        <Link
          href={`/profile/${params.id}/followers`}
          className="flex flex-col justify-center items-center space-y-1 py-1 w-[60px]"
        >
          <h4>{profile.data?.followersCount}</h4>
          <span className="text-xs">Followers</span>
        </Link>
        <Link
          href={`/profile/${params.id}/following`}
          className="flex flex-col justify-center items-center space-y-1 py-1 w-[60px]"
        >
          <h4>{profile.data?.followingCount}</h4>
          <span className="text-xs">Following</span>
        </Link>
        <Link
          href={`/profile/${params.id}/posts`}
          className="flex flex-col justify-center items-center space-y-1 py-1 w-[60px]"
        >
          <h4>{profile.data?.posts_count}</h4>
          <span className="text-xs">Posts</span>
        </Link>
      </section>
      <section className="w-full flex justify-center items-center">
        {!currentProfile ? (
          !profile.data?.followers.some(
            (follower) => follower.id === clerkUser?.id
          ) ? (
            <FollowButton
              fromUserId={clerkUser?.id!}
              toUserId={profile.data?.id!}
            />
          ) : (
            <UnfollowButton
              fromUserId={clerkUser?.id!}
              toUserId={profile.data?.id!}
            />
          )
        ) : (
          <></>
        )}
      </section>
      <Separator className="my-4" decorative />
      <section className="w-full">
        <h3 className="text-xl font-semibold w-full pl-3">Posts</h3>
      </section>
      <div className="w-full flex flex-row flex-wrap gap-4 justify-center">
        {profile.data?.posts.map((post) => {
          const created = new Intl.DateTimeFormat(undefined, {
            dateStyle: "short",
          }).format(new Date(post.createdAt));
          return (
            <Link
              href={{
                pathname: `/profile/${params.id}/posts`,
                query: {
                  post: post.id,
                },
              }}
              key={post.id}
            >
              <Card className="w-full max-w-[300px]">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>{created}</CardDescription>
                </CardHeader>
                <CardContent>{post.description}</CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </article>
  );
};

export default ProfilePage;
