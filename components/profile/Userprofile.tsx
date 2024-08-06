import { User } from "@prisma/client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";

const Userprofile = (props: User) => {
  const created = new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
  }).format(new Date(props.createdAt));
  return (
    <Card className="w-full max-w-[400px]">
      <CardContent className="pt-4 w-full">
        <Link
          href={`/profile/${encodeURIComponent(props.id)}`}
          className="w-full flex flex-row space-x-4"
        >
          <Avatar className="w-[50px] h-[50px]">
            <AvatarImage
              src={props.profile!}
              alt={`profile image of ${props.name}`}
            />
            <AvatarFallback>{props.name?.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col font-semibold" suppressHydrationWarning>
            <CardTitle className="font-semibold text-xl">
              {props.name}
            </CardTitle>
            <CardDescription>Joined: {created}</CardDescription>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default Userprofile;
