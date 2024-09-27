"use client";

import { addComment } from "@/actions/posts/mutateComments";
import { createToast } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { MessageCircle, SendHorizontal } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button, buttonVariants } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";

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
        <div
          role="button"
          aria-label="comments"
          className={`${buttonVariants({
            variant: "ghost",
          })} flex flex-row space-x-1 w-full`}
        >
          <MessageCircle size={16} />
          <span className="inline">{commentsCount}</span>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[300px] sm:w-[450px] md:w-[600px] xl:w-[950px]"
        aria-label="comments"
      >
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
      <ScrollArea className="w-full rounded-md border-none max-h-[200px] overflow-y-scroll">
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
        <ScrollBar orientation="vertical" />
      </ScrollArea>
      <div className="w-full flex flex-row space-x-2 justify-center items-center">
        <Textarea
          className="w-full"
          rows={1}
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
  }).format(new Date(createdAt));
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

export default CommentsButton;
