"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PostCardProps } from "@/types";
import { useUser } from "@clerk/nextjs";
import { Bookmark, Heart, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const PostCard = (props: PostCardProps) => {
  const created = new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
  }).format(props.createdAt);

  const { isLoaded, user } = useUser();
  return (
    <Card className={`w-[300px] md:w-[450px]`}>
      <CardHeader className="flex flex-row justify-center items-center">
        <div className="w-full flex flex-row justify-start space-x-3 items-center">
          <Avatar>
            <AvatarImage
              src={props.author?.profile!}
              alt={`profile image of ${props.author.name}`}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col font-semibold" suppressHydrationWarning>
            <h4>{props.author.name}</h4>
            <p>{created}</p>
          </div>
        </div>
        {isLoaded && user?.id !== props.author.id && !props.following && (
          <Button variant={"secondary"}>Follow</Button>
        )}
      </CardHeader>
      <CardContent className="w-full flex flex-col space-y-6">
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
      </CardContent>
      <CardFooter className="w-full flex flex-row">
        <LikeButton />
        <CommentsButton />
        <BookmarksButton />
      </CardFooter>
    </Card>
  );
};

const LikeButton = () => {
  return (
    <Button variant={"ghost"} className="flex flex-row space-x-1 w-full">
      <Heart size={16} />
      <span className="hidden sm:inline">Like</span>
    </Button>
  );
};

const CommentsButton = () => {
  return (
    <Button variant={"ghost"} className="flex flex-row space-x-1 w-full">
      <MessageCircle size={16} />
      <span className="hidden sm:inline">Comment</span>
    </Button>
  );
};

const BookmarksButton = () => {
  return (
    <Button variant={"ghost"} className="flex flex-row space-x-1 w-full">
      <Bookmark size={16} />
      <span className="hidden sm:inline">Comment</span>
    </Button>
  );
};

export default PostCard;
