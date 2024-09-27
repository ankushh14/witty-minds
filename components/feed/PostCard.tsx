"use client";

import { addFollow } from "@/actions/users/mutateFollow.actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createToast } from "@/lib/utils";
import { PostCardProps } from "@/types";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import AdditionalMenu from "../postcard/AdditionalMenu";
import BookmarksButton from "../postcard/BookmarksButton";
import CommentsButton from "../postcard/CommentsButton";
import LikeButton from "../postcard/LikeButton";
import Postdetails from "../postcard/Postdetails";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import EmblaCarousel from "../ui/carousel/carousel";

const PostCard = (props: PostCardProps) => {
  const created = new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
  }).format(new Date(props.createdAt));

  const { isLoaded, user } = useUser();
  const [isLoading, setIsLoading] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(props.likeCount);
  const [bookmarkCount, setBookmarkCount] = React.useState(props.bookmarkCount);

  const handleFollow = async () => {
    const fromId = user?.id;
    const toUserId = props.author.id;
    if (!fromId || !toUserId) {
      return;
    }
    setIsLoading(true);
    if (!props.following) {
      const response = await addFollow({
        fromUserID: fromId,
        toUserID: toUserId,
      });
      if (response.valid) {
      } else {
        setIsLoading(false);
        createToast({
          description: response.message,
          title: "Error",
          variant: "destructive",
        });
      }
    }
  };
  return (
    <Card className={`w-full max-w-[450px] scroll-mt-16`} id={props.id}>
      <CardHeader className="flex flex-row justify-center items-center">
        <Link
          href={`/profile/${encodeURIComponent(props.author.id)}`}
          className="w-full flex flex-row justify-start space-x-3 items-center"
        >
          <Avatar>
            <AvatarImage
              src={props.author?.profile!}
              alt={`profile image of ${props.author.name}`}
            />
            <AvatarFallback>
              {props.author.name?.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col font-semibold" suppressHydrationWarning>
            <h4>
              {props.author.email === user?.emailAddresses[0].emailAddress
                ? "You"
                : props.author.name}
            </h4>
            <p>{created}</p>
          </div>
        </Link>
        {isLoaded && user?.id !== props.author.id && !props.following && (
          <Button
            variant={"secondary"}
            onClick={handleFollow}
            disabled={isLoading}
            aria-disabled={isLoading}
          >
            Follow
          </Button>
        )}
        {user?.id === props.author.id && (
          <AdditionalMenu
            postId={props.id}
            posttitle={props.title}
            setPosts={props.setPosts}
          />
        )}
      </CardHeader>
      <CardContent className="w-full flex flex-col space-y-6">
        <CardTitle>{props.title}</CardTitle>
        <EmblaCarousel images={props.images} />
        <CardDescription>{props.description}</CardDescription>
      </CardContent>
      <Postdetails
        bookmarkCount={bookmarkCount}
        bookmarkedBy={props.bookmarkedBy}
        likeCount={likeCount}
        likedBy={props.likedBy}
      />
      <CardFooter className="w-full flex flex-row">
        <LikeButton
          likedBy={props.likedBy}
          postID={props.id}
          currentUserId={user?.id!}
          likeCount={props.likeCount}
          setLikeCount={setLikeCount}
        />
        <CommentsButton
          commentsDb={props.comments}
          currentUserId={user?.id!}
          postID={props.id}
        />
        <BookmarksButton
          bookmarkCount={props.bookmarkCount}
          bookmarkedBy={props.bookmarkedBy}
          postID={props.id}
          currentUserId={user?.id!}
          title={props.title}
          setBookmarkCount={setBookmarkCount}
        />
      </CardFooter>
    </Card>
  );
};

export default PostCard;
