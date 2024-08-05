"use client";

import { mutateBookmarks } from "@/actions/posts/mutateBookmarks";
import { addComment } from "@/actions/posts/mutateComments";
import { mutateLike } from "@/actions/posts/mutateLike";
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
import { Scrollbar } from "@radix-ui/react-scroll-area";
import { Bookmark, Heart, MessageCircle, SendHorizontal } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";

const PostCard = (props: PostCardProps) => {
  console.log(props);
  const created = new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
  }).format(new Date(props.createdAt));

  const { isLoaded, user } = useUser();
  const [isLoading, setIsLoading] = React.useState(false);

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
    <Card className={`w-[300px] md:w-[450px]`}>
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
      </CardHeader>
      <CardContent className="w-full flex flex-col space-y-6">
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
      </CardContent>
      <CardFooter className="w-full flex flex-row">
        <LikeButton
          likedBy={props.likedBy}
          postID={props.id}
          currentUserId={user?.id!}
          likeCount={props.likeCount}
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
        />
      </CardFooter>
    </Card>
  );
};

type LikeProps = {
  likeCount: number;
  postID: string;
  likedBy: {
    id: string;
    name: string | null;
    email: string | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
  currentUserId: string;
};

const LikeButton = ({
  likedBy,
  postID,
  currentUserId,
  likeCount,
}: LikeProps) => {
  const [isLiked, setIsLiked] = React.useState(() => {
    if (likedBy.find((user) => user.id === currentUserId)) {
      return true;
    } else {
      return false;
    }
  });
  const [debouncedLike, callback] = useDebounce(isLiked, 500);
  const [notInitial, setNotInitial] = useState(false);
  const [postLikes, setPostLikes] = React.useState(likeCount);

  const updateLike = React.useCallback(async () => {
    await mutateLike({
      postID,
      addLike: debouncedLike,
      userID: currentUserId,
    });
  }, [currentUserId, debouncedLike, postID]);

  const handleLikeClick = () => {
    setPostLikes((prev) => {
      if (prev <= likeCount && !isLiked) {
        return prev + 1;
      } else {
        return prev - 1;
      }
    });
    setIsLiked((prev) => !prev);
    setNotInitial(true);
  };

  React.useEffect(() => {
    if (notInitial) {
      updateLike();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateLike]);

  return (
    <Button
      variant={"ghost"}
      className="flex flex-row space-x-1 w-full justify-center items-center"
      onClick={handleLikeClick}
      aria-label="like"
    >
      <Heart size={16} fill={isLiked ? "red" : ""} />
      <span className="inline">{postLikes}</span>
    </Button>
  );
};

type CommentsButtonProps = {
  postID: string;
  commentsDb: {
    id: string;
    userID: string;
    postID: string;
    content: string;
    userProfile: string;
    createdAt: Date;
  }[];
  currentUserId: string;
};

const CommentsButton = ({
  commentsDb,
  currentUserId,
  postID,
}: CommentsButtonProps) => {
  const [commentsCount, setCommentsCount] = React.useState(commentsDb.length);
  return (
    <Popover>
      <PopoverTrigger className="w-full">
        <Button variant={"ghost"} className="flex flex-row space-x-1 w-full">
          <MessageCircle size={16} />
          <span className="inline">{commentsCount}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] md:w-[450px]" aria-label="comments">
        <Comments
          commentsDb={commentsDb}
          setCommentsCount={setCommentsCount}
          postID={postID}
        />
      </PopoverContent>
    </Popover>
  );
};

type CommentsProps = {
  commentsDb: {
    id: string;
    userID: string;
    postID: string;
    content: string;
    userProfile: string;
    createdAt: Date;
  }[];
  setCommentsCount: React.Dispatch<React.SetStateAction<number>>;
  postID: string;
};

const Comments = ({ commentsDb, setCommentsCount, postID }: CommentsProps) => {
  const [comments, setComments] = React.useState(commentsDb);
  const [textAreaValue, setTextAreaValue] = React.useState("");
  const { user } = useUser();

  const handleAddComment = async () => {
    if (textAreaValue === "") {
      return;
    }
    const newComment = {
      id: crypto.randomUUID(),
      userID: user?.id!,
      postID: postID,
      content: textAreaValue,
      userProfile: user?.imageUrl!,
      createdAt: new Date(),
    };
    setTextAreaValue("");
    setComments((prev) => [...prev, newComment]);
    setCommentsCount((prev) => prev + 1);
    const response = await addComment({
      content: newComment.content,
      postID: newComment.postID,
      profile: newComment.userProfile,
      userID: newComment.userID,
    });
    if (!response.valid) {
      setComments((prev) =>
        [...prev].filter((comment) => comment.id === newComment.id)
      );
      createToast({
        title: "Error",
        variant: "destructive",
        description: response.message,
      });
      setCommentsCount((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-3 p-1">
      <ScrollArea className="w-full rounded-md border-none max-h-[250px]">
        {comments.map((comment) => {
          return (
            <SingleComment
              key={comment.id}
              content={comment.content}
              id={comment.id}
              profile={comment.userProfile}
              createdAt={comment.createdAt}
            />
          );
        })}
        <Scrollbar orientation="vertical" />
      </ScrollArea>
      <div className="w-full flex flex-row space-x-2 justify-center items-center">
        <Textarea
          className="w-full"
          rows={2}
          placeholder="Type your comment here"
          value={textAreaValue}
          onChange={(e) => setTextAreaValue(e.currentTarget.value)}
        />
        <Button
          className="rounded-full"
          size={"icon"}
          onClick={handleAddComment}
        >
          <SendHorizontal size={20} />
        </Button>
      </div>
    </div>
  );
};

type SingleCommentProps = {
  content: string;
  profile: string;
  id: string;
  createdAt: Date;
  // userID: string;
  // postID: string;
};

const SingleComment = ({ content, profile, createdAt }: SingleCommentProps) => {
  const created = new Intl.DateTimeFormat(undefined, {
    timeStyle: "short",
    dateStyle: "short",
  }).format(createdAt);
  return (
    <div
      className="w-full flex flex-col space-y-2 my-4"
      aria-label={`A comment`}
    >
      <div className="w-full flex flex-row space-x-2">
        <Avatar>
          <AvatarImage src={profile} />
          <AvatarFallback>AN</AvatarFallback>
        </Avatar>
        <p
          className={`rounded-md whitespace-pre-wrap break-words p-2 bg-gray-500 text-white`}
        >
          {content}
        </p>
      </div>
      <span className="text-xs pl-12">{created}</span>
    </div>
  );
};

type BookmarkSectionProps = {
  postID: string;
  bookmarkedBy: {
    id: string;
    name: string | null;
    email: string | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
  bookmarkCount: number;
  currentUserId: string;
  title: string;
};

const BookmarksButton = ({
  bookmarkedBy,
  postID,
  bookmarkCount,
  currentUserId,
  title,
}: BookmarkSectionProps) => {
  const [isBookmarked, setIsBookmarked] = React.useState(() => {
    if (bookmarkedBy.find((user) => user.id === currentUserId)) {
      return true;
    } else {
      return false;
    }
  });
  const [debouncedBookmark, callback] = useDebounce(isBookmarked, 500);
  const [notInitial, setNotInitial] = useState(false);
  const [postbookmarks, setPostbookmarks] = React.useState(bookmarkCount);

  const updateBookmark = React.useCallback(async () => {
    const response = await mutateBookmarks({
      postID,
      addBookmark: debouncedBookmark,
      userID: currentUserId,
    });

    createToast({
      title: response.message,
      variant: "default",
      description: title,
    });
  }, [currentUserId, debouncedBookmark, postID, title]);

  const handleBookmarkClick = () => {
    setPostbookmarks((prev) => {
      if (prev <= bookmarkCount && !isBookmarked) {
        return prev + 1;
      } else {
        return prev - 1;
      }
    });
    setIsBookmarked((prev) => !prev);
    setNotInitial(true);
  };

  React.useEffect(() => {
    if (notInitial) {
      updateBookmark();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateBookmark]);
  return (
    <Button
      variant={"ghost"}
      className="flex flex-row space-x-1 w-full"
      aria-label="bookmark"
      onClick={handleBookmarkClick}
    >
      <Bookmark size={16} fill={isBookmarked ? "white" : ""} />
      <span className="inline">{postbookmarks}</span>
    </Button>
  );
};

export default PostCard;
