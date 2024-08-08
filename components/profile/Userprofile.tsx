import { User } from "@prisma/client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";

type Props = {
  user: User;
  currentId: string;
};

const Userprofile = (props: Props) => {
  const created = new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
  }).format(new Date(props.user.createdAt));

  return (
    <Card className="w-full max-w-[400px]">
      <CardContent className="pt-4 w-full">
        <Link
          href={`/profile/${encodeURIComponent(props.user.id)}`}
          className="w-full flex flex-row space-x-4"
        >
          <Avatar className="w-[50px] h-[50px]">
            <AvatarImage
              src={props.user.profile!}
              alt={`profile image of ${props.user.name}`}
            />
            <AvatarFallback>{props.user.name?.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col font-semibold" suppressHydrationWarning>
            <CardTitle className="font-semibold text-base">
              {props.user.id === props.currentId ? "You" : props.user.name}
            </CardTitle>
            <CardDescription>Joined: {created}</CardDescription>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default Userprofile;
